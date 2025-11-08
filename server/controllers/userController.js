import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Item from "../models/Car.js"; 
import Booking from '../models/Booking.js';
import crypto from "crypto";
import nodemailer from "nodemailer";
//import { sendEmail } from "../utils/sendEmail.js";


// Generate JWT token
const generateToken = (userId)=>{
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET)
}

// Register User
 export const registerUser = async (req, res)=>{
    try{
        const {name, email, password} = req.body
          
        if(!name || !email ||!password || password.length < 8){
            return res.json({success: false, message: 'fill all the fields'})
        }

        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({success: false, message: 'user already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashedPassword})
        const token = generateToken(user._id.toString())
        res.json({success: true, token})

    } catch (error){
         console.log(error.message);
         res.json({success: false, massage: error.message})
    }
}

// Login user
export const loginUser = async (req, res)=> {
    try{
        const {email, password} =req.body
        const user = await User.findOne({email})

        if(!user){
            return res.json({success: false, message: 'User not found'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: 'Invalid Credentials'})
        }

        const token = generateToken(user._id.toString())

        // FIX: Return the user's role in the response
        res.json({
            success: true, 
            token,
            // Check the user's role and send boolean flags to the frontend
            isAdmin: user.role === 'admin',
            isOwner: user.role === 'owner',
            message: 'Login successful!'
        })

    } catch (error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// get user data using token (jwt)
export const getUserData = async (req, res) =>{
    try {
        const {user} = req; // The user object is attached to the request by your authentication middleware
        // The user object contains the 'role' field
        res.json({success: true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// FIX: Update function to get all items from the single 'Item' model
export const getItems = async (req, res) => {
    try {
        const items = await Item.find({});
        res.json({ success: true, items });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// You can keep the original 'getCars' if it's used elsewhere, but update its logic
export const getCars = async (req, res) => {
    try {
        // This will now find only items with type 'Car'
        const cars = await Item.find({ type: "Car", isAvaliable: true });
        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// Get all items for the admin dashboard WITH PAGINATION, SEARCH, SORT, and CATEGORY FILTER
export const getAdminItems = async (req, res) => {
    try {
        console.log("Attempting to fetch admin items...");
        
        // ⭐ 1. Get all necessary query parameters ⭐
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchTerm = req.query.search || '';
        const sortOrder = req.query.sort || ''; // e.g., 'price_asc', 'price_desc'
        const category = req.query.category || ''; // e.g., 'Bike', 'Sofa', '' (all)
        
        const skip = (page - 1) * limit;

        // ⭐ 2. Define the base filter ⭐
        let filter = {};
        
        // ⭐ 3. Apply Search filter ⭐
        if (searchTerm) {
            const searchRegex = new RegExp(searchTerm, 'i'); // Case-insensitive search
            filter = {
                ...filter, // Keep any existing filters
                $or: [
                    { brand: searchRegex },
                    { model: searchRegex }
                ]
            };
        }
        
        // ⭐ 4. Apply Category Filter (THE CRITICAL FIX) ⭐
        if (category) {
            // Add category to the filter object for an exact match
            filter.category = category;
        }

        // ⭐ 5. Define Sorting Options ⭐
        let sortOptions = { createdAt: -1 }; // Default sort
        if (sortOrder === 'price_asc') {
            sortOptions = { pricePerDay: 1 };
        } else if (sortOrder === 'price_desc') {
            sortOptions = { pricePerDay: -1 };
        }

        // ⭐ 6. Count total items for pagination math (using the combined filter) ⭐
        const totalItems = await Item.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / limit);

        // ⭐ 7. Fetch the items for the current page ⭐
        const items = await Item.find(filter) 
            .populate('owner', 'name') // Populate the owner's name for the table
            .sort(sortOptions) // Apply dynamic sorting
            .skip(skip)
            .limit(limit); 

        console.log(`[Admin Items] Fetched ${items.length} items. Filter: ${JSON.stringify(filter)}`);

        // ⭐ 8. Return items along with pagination metadata ⭐
        res.json({ 
            success: true, 
            items,
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalItems
        });

    } catch (error) {
        console.error("Error in getAdminItems:", error.message);
        res.status(500).json({ success: false, message: "Error fetching items." });
    }
};


// Delete an item
export const deleteAdminItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findByIdAndDelete(id);

        if (!item) {
            return res.json({ success: false, message: "Item not found." });
        }

        res.json({ success: true, message: "Item deleted successfully." });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: "Failed to delete item." });
    }
};

// Get all bookings for the admin dashboard
export const getAdminOrders = async (req, res) => {
    try {
        // Find all bookings and populate user and car details
        const bookings = await Booking.find()
            .populate('user', 'name')
            .populate('car', 'name'); 

        res.json({ success: true, orders: bookings }); // Send response as 'orders' to match frontend
    } catch (error) {
        console.error("Error fetching admin orders:", error);
        res.status(500).json({ success: false, message: "Server error fetching orders." });
    }
};

// Update a booking's status
export const updateAdminOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            return res.json({ success: false, message: "Booking ID and status are required." });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!updatedBooking) {
            return res.json({ success: false, message: "Booking not found." });
        }

        res.json({ success: true, message: "Booking status updated successfully." });
    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({ success: false, message: "Server error updating status." });
    }
};

// Get all users for the admin dashboard
export const getAdminUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json({ success: true, users });
    } catch (error) {
        console.error("Error fetching admin users:", error);
        res.status(500).json({ success: false, message: "Server error fetching users." });
    }
};

// Update a user's role
export const updateAdminUserRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        if (!userId || !role) {
            return res.json({ success: false, message: "User ID and role are required." });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });
        
        if (!updatedUser) {
            return res.json({ success: false, message: "User not found." });
        }

        res.json({ success: true, message: "User role updated successfully.", user: updatedUser });
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ success: false, message: "Server error updating role." });
    }
};

// New: Get all vendors (users with role 'owner')
export const getAdminVendors = async (req, res) => {
    try {
        const vendors = await User.find({ role: 'owner' });
        res.json({ success: true, vendors });
    } catch (error) {
        console.error("Error fetching admin vendors:", error);
        res.status(500).json({ success: false, message: "Server error fetching vendors." });
    }
};

// New: Update a vendor's verification status
export const updateVendorStatus = async (req, res) => {
    try {
        const { vendorId, status } = req.body;
        if (!vendorId || status === undefined) {
            return res.json({ success: false, message: "Vendor ID and status are required." });
        }
        
        const updatedVendor = await User.findByIdAndUpdate(vendorId, { isVerified: status }, { new: true });
        
        if (!updatedVendor) {
            return res.json({ success: false, message: "Vendor not found." });
        }
        
        res.json({ success: true, message: "Vendor status updated successfully.", vendor: updatedVendor });
    } catch (error) {
        console.error("Error updating vendor status:", error);
        res.status(500).json({ success: false, message: "Server error updating status." });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        // The `protect` middleware should have already attached the user to the request
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        
        res.json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ success: false, message: "Server error fetching profile." });
    }
};

// export const updateVendorProfile = async (req, res) => {
//     try {
//         const { name, email, phone, bio } = req.body;
//         const userId = req.user.id; // Get user ID from the `protect` middleware

//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found." });
//         }

//         // Update the user fields
//         user.name = name || user.name;
//         user.email = email || user.email;
//         user.phone = phone || user.phone;
//         user.bio = bio || user.bio;

//         await user.save();

//         res.json({ success: true, message: "Profile updated successfully.", user });

//     } catch (error) {
//         console.error("Error updating vendor profile:", error);
//         res.status(500).json({ success: false, message: "Server error updating profile." });
//     }
// };



export const listAllPublicItems = async (req, res) => {
    try {
        
        const filter = {}; // Fetches everything! 
        
        const publicItems = await Item.find(filter) 
            .select('-owner -__v') 

        console.log(`[DEBUG] Fetched ${publicItems.length} items with filter: ${JSON.stringify(filter)}`);


        res.json({ success: true, items: publicItems });
    } catch (error) {
        console.error("Error fetching public items:", error.message);
        res.status(500).json({ success: false, message: "Error fetching public services." });
    }
};



// Function to get ALL core dashboard statistics (for DashboardStats component)
export const getAdminDashboardStats = async (req, res) => {
    try {
        // 1. Total Users
        const totalUsers = await User.countDocuments({});

        // 2. Total Vendors (Users with role 'owner')
        const totalVendors = await User.countDocuments({ role: 'owner' });

        // 3. Total Items (from the Item model)
        const totalItems = await Item.countDocuments({});
        
        // 4. Booking Stats
        const totalBookings = await Booking.countDocuments({});
        const pendingBookings = await Booking.countDocuments({ status: 'pending' });
        // Assuming 'confirmed' and 'completed' are confirmed states
        const confirmedBookings = await Booking.countDocuments({ $or: [{ status: 'confirmed' }, { status: 'completed' }] }); 
        
        // 5. Total Revenue (Aggregate the total amount from all successful bookings)
        const revenueResult = await Booking.aggregate([
            { $match: { status: { $in: ['confirmed', 'completed'] } } }, // Only count revenue from confirmed/completed bookings
            { 
                $group: { 
                    _id: null, 
                    totalRevenue: { $sum: '$totalAmount' } // Assuming 'totalAmount' is the field for booking price
                } 
            }
        ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;


        // Send the structured data matching the frontend's expected format
        res.json({
            success: true,
            totalUsers,
            totalVendors,
            totalItems,
            totalRevenue: Math.round(totalRevenue), // Send as a rounded number
            totalBookings,
            pendingBookings,
            confirmedBookings,
        });

    } catch (error) {
        console.error("Error fetching admin dashboard stats:", error);
        res.status(500).json({ success: false, message: "Server error fetching stats." });
    }
};

// Function to get data for the DashboardGraphs component (graphs and tables)
export const getAdminDashboardGraphs = async (req, res) => {
    try {
        // --- 1. Monthly Users & Vendors Data (for the Bar Chart) ---
        // This is a complex aggregation to group by month.
        const monthlyData = await User.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Group by month of creation
                    Users: { $sum: 1 }, // Count all users in that month
                    Vendors: { 
                        $sum: { 
                            $cond: [{ $eq: ["$role", "owner"] }, 1, 0] // Count users with role 'owner'
                        } 
                    }
                }
            },
            { $sort: { "_id": 1 } }, // Sort by month number
            { // Map month number to name for chart readability
                $project: {
                    _id: 0,
                    name: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$_id", 1] }, then: "Jan" },
                                { case: { $eq: ["$_id", 2] }, then: "Feb" },
                                { case: { $eq: ["$_id", 3] }, then: "Mar" },
                                { case: { $eq: ["$_id", 4] }, then: "Apr" },
                                { case: { $eq: ["$_id", 5] }, then: "May" },
                                { case: { $eq: ["$_id", 6] }, then: "Jun" },
                                { case: { $eq: ["$_id", 7] }, then: "Jul" },
                                { case: { $eq: ["$_id", 8] }, then: "Aug" },
                                { case: { $eq: ["$_id", 9] }, then: "Sep" },
                                { case: { $eq: ["$_id", 10] }, then: "Oct" },
                                { case: { $eq: ["$_id", 11] }, then: "Nov" },
                                { case: { $eq: ["$_id", 12] }, then: "Dec" },
                            ],
                            default: "Unknown"
                        }
                    },
                    Users: 1,
                    Vendors: 1
                }
            }
        ]);


        // --- 2. Recent Users Table Data ---
        const recentUsers = await User.find({})
            .sort({ createdAt: -1 })
            .limit(5) // Limit to the top 5 recent users
            .select('name email createdAt'); 
            
        // Map data to match frontend structure (renaming 'createdAt' to 'registrationDate' and using a simple date format)
        const recentUsersFormatted = recentUsers.map(user => ({
            name: user.name,
            email: user.email,
            registrationDate: user.createdAt.toISOString().split('T')[0]
        }));


        // --- 3. Top Vendors Table Data ---
        // This needs an aggregation on the Booking or Item model to count sales/revenue per vendor.
        // For simplicity, let's just count how many ITEMS each vendor owns.
        const topVendorsAggregation = await Item.aggregate([
            { $group: { _id: "$owner", itemsSold: { $sum: 1 } } }, // Group by owner, count items
            { $sort: { itemsSold: -1 } },
            { $limit: 4 }, // Top 4 vendors
            { 
                $lookup: { // Join with User model to get the owner's name
                    from: 'users', // The collection name for the User model
                    localField: '_id',
                    foreignField: '_id',
                    as: 'ownerDetails'
                }
            },
            { $unwind: '$ownerDetails' }, // Flatten the array result from $lookup
            {
                $project: {
                    _id: 0,
                    name: '$ownerDetails.name',
                    itemsSold: 1
                }
            }
        ]);
        
        // Use a more descriptive key name for top vendors
        const topVendors = topVendorsAggregation; 


        // Send the structured data matching the frontend's expected format
        res.json({
            success: true,
            monthlyData, // Used for BarChart
            recentUsers: recentUsersFormatted, // Used for Recent Users table
            topVendors, // Used for Top Vendors table
        });

    } catch (error) {
        console.error("Error fetching admin dashboard graphs data:", error);
        res.status(500).json({ success: false, message: "Server error fetching graph data." });
    }
};


// // Function to allow a registered user to become a vendor (owner)
// export const becomeVendor = async (req, res) => {
//     try {
//         // The user ID is available from the 'protect' middleware (req.user is set by the middleware)
//         const userId = req.user.id; 
//         const { storeName, phoneNumber } = req.body;

//         // 1. Input Validation
//         if (!storeName || !phoneNumber) {
//             return res.json({ success: false, message: 'Store Name and Phone Number are required.' });
//         }

//         // 2. Find the user
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found.' });
//         }

//         // 3. Prevent already being a vendor/admin
//         if (user.role === 'owner' || user.role === 'admin') {
//             return res.json({ success: false, message: 'You are already registered as an owner or admin.' });
//         }

//         // 4. Update the user's role and add vendor details
//         user.role = 'owner';
//         user.storeName = storeName; // Assuming your User model has a 'storeName' field
//         user.phone = phoneNumber;  // Update phone number (if not already set)
//         user.isVerified = false;   // Optionally set initial verification status

//         await user.save();

//         // 5. Send success response
//         res.json({ 
//             success: true, 
//             message: 'Vendor registration successful! Your status is pending admin approval.',
//             user: user // Optionally return the updated user object
//         });

//     } catch (error) {
//         console.error("Error in becomeVendor:", error.message);
//         res.status(500).json({ success: false, message: 'Server error during vendor registration.' });
//     }
// };


// 🟢 Register as Vendor
export const becomeVendor = async (req, res) => {
  try {
    const { storeName, phoneNumber, businessType, address, city, state, country, postalCode, description, website, gstNumber } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.role = "owner";
    user.vendorProfile = { storeName, phoneNumber, businessType, address, city, state, country, postalCode, description, website, gstNumber };
    await user.save();

    res.json({ success: true, message: "Vendor registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error during vendor registration" });
  }
};

// 🟡 Get Vendor Profile
export const getVendorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, vendorProfile: user.vendorProfile || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching vendor profile" });
  }
};

// 🟣 Update Vendor Profile
export const updateVendorProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role !== "owner") return res.status(403).json({ success: false, message: "Not authorized" });

    user.vendorProfile = { ...user.vendorProfile, ...updates };
    await user.save();

    res.json({ success: true, message: "Vendor profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error updating vendor profile" });
  }
};

// api for forgate password
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found" });

//     // Create reset token
//     const token = crypto.randomBytes(32).toString("hex");
//     user.resetToken = token;
//     user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
//     await user.save();

//     // Email link
//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

//     const html = `
//       <div style="font-family:Arial,sans-serif;line-height:1.6;">
//         <h2>Password Reset Request</h2>
//         <p>Click the link below to reset your password:</p>
//         <a href="${resetUrl}" style="color:#007bff;">${resetUrl}</a>
//         <p>This link will expire in 15 minutes.</p>
//       </div>
//     `;

//     await sendEmail(user.email, "Reset your password", html);

//     res.json({ success: true, message: "Password reset link sent!" });
//   } catch (error) {
//     console.error("Forgot password error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    console.log("Reset token generated:", resetUrl);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");

    res.json({ success: true, message: "Reset link sent to your email" });

  } catch (error) {
    console.error("Forgot password error:", error); // <--- Important
    res.json({ success: false, message: "Server error. Please try again later." });
  }
};



// api for reset password
// export const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { newPassword } = req.body;

//     const user = await User.findOne({
//       resetToken: token,
//       resetTokenExpiry: { $gt: Date.now() },
//     });

//     if (!user)
//       return res.status(400).json({ success: false, message: "Invalid or expired token" });

//     user.password = newPassword;
//     user.resetToken = undefined;
//     user.resetTokenExpiry = undefined;
//     await user.save();

//     res.json({ success: true, message: "Password reset successful!" });
//   } catch (error) {
//     console.error("Reset password error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // still valid
    });

    if (!user) {
      return res.json({ success: false, message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    //user.password = newPassword; // 🔒 Make sure password hashing middleware runs
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.json({ success: false, message: "Server error resetting password" });
  }
};




//ufze svjp xfpg erab