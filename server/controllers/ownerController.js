import fs from "fs";
import imagekit from "../configs/imageKit.js"; // Import your ImageKit config
import Booking from "../models/Booking.js";
import Item from "../models/Car.js"; // Renamed from Car to be generic
import User from "../models/User.js";
import { geocodeVendorAddress } from "./mapController.js";

// api to change role of user
export const changeRoleToOwner = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { role: "owner" });
        res.json({ success: true, message: "Now you can list services" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// api to list a new item (car, bike, house, etc.)
export const addItem = async (req, res) => {
    try {
        const { _id } = req.user;
        let itemData = JSON.parse(req.body.itemData); // Use itemData to be generic
        const imageFile = req.file;

        // upload image to imagekit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/services' // Generic folder for all services
        });

        // Delete the temporary file from the server
        fs.unlinkSync(imageFile.path);

        // optimisation through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '1280' },
                { quality: 'auto' },
                { format: 'webp' }]
        });

        const image = optimizedImageUrl;
        await Item.create({ ...itemData, owner: _id, image }); // Use Item model
        res.json({ success: true, message: "Item added" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

   // Api to list owner items WITH PAGINATION
export const getOwnerItems = async (req, res) => {
    try {
        const { _id } = req.user;
        
        // ⭐ 1. Get pagination parameters from query string ⭐
        // Default to page 1 and limit 10 (as requested)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit; // Calculate how many documents to skip

        // Define the filter (items belonging to the current owner)
        const filter = { owner: _id };

        // ⭐ 2. Count total items for pagination math ⭐
        const totalItems = await Item.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / limit);

        // ⭐ 3. Fetch the items for the current page using skip() and limit() ⭐
        const items = await Item.find(filter) 
            .skip(skip)
            .limit(limit)
            // Optional: You might want to sort them, e.g., by newest first
            .sort({ createdAt: -1 }); 

        // ⭐ 4. Return items along with pagination metadata ⭐
        res.json({ 
            success: true, 
            items,
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalItems
        });
        
    } catch (error) {
        console.error("Error fetching owner items:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch items." });
    }
};


// Api to list owner items
// export const getOwnerItems = async (req, res) => {
//     try {
//         const { _id } = req.user;
//         const items = await Item.find({ owner: _id }); // Use Item model
//         res.json({ success: true, items });
//     } catch (error) {
//         console.log(error.message);
//         res.json({ success: false, message: error.message });
//     }
// };

// Api to get a single item by ID
export const getItemById = async (req, res) => {
    try {
        const { itemId } = req.params;
        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found." });
        }

        // Ensure only the owner can view their own item details.
        if (req.user.role !== 'owner' || item.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized." });
        }

        res.json({ success: true, item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Api to update an item
export const updateItem = async (req, res) => {
  try {
    const { _id } = req.user;
    const { itemId } = req.params; // ✅ get itemId from URL params
    const updatedData = req.body;

    const item = await Item.findById(itemId);

    // Check if the item exists and belongs to the owner
    if (!item || item.owner.toString() !== _id.toString()) {
      return res.status(404).json({ success: false, message: "Item not found or unauthorized." });
    }

    // ✅ Update item in DB
    const updatedItem = await Item.findByIdAndUpdate(itemId, updatedData, { new: true });

    res.json({
      success: true,
      message: "Item updated successfully.",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ success: false, message: "Failed to update item." });
  }
};



// export const updateItem = async (req, res) => {
//     try {
//         const { _id } = req.user;
//         const { itemId, ...updatedData } = req.body;
//         const item = await Item.findById(itemId);

//         // Check if the item exists and belongs to the owner
//         if (!item || item.owner.toString() !== _id.toString()) {
//             return res.status(404).json({ success: false, message: "Item not found or unauthorized." });
//         }

//         // Update the item with the new data
//         const updatedItem = await Item.findByIdAndUpdate(itemId, updatedData, { new: true });
//         res.json({ success: true, message: "Item updated successfully.", item: updatedItem });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ success: false, message: "Failed to update item." });
//     }
// };

// Api to Toggle Item Availability
export const toggleItemAvailability = async (req, res) => {
    try {
        const { _id } = req.user;
        const { itemId } = req.body;
        const item = await Item.findById(itemId); // Use Item model and itemId

        // Checking if item belongs to the User
        if (item.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }
        item.isAvaliable = !item.isAvaliable;
        await item.save();
        res.json({ success: true, message: "Availability Toggled" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Api to delete an item
export const deleteItem = async (req, res) => {
    try {
        const { _id } = req.user;
        const { itemId } = req.body;
        const item = await Item.findById(itemId); // Use Item model and itemId

        // Checking if item belongs to the User
        if (item.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        // To properly delete the document from the database
        await Item.findByIdAndDelete(itemId);
        res.json({ success: true, message: "Item Removed" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Api to get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const { _id, role } = req.user;
        if (role !== 'owner') {
            return res.json({ success: false, message: "Unauthorized" });
        }
        const items = await Item.find({ owner: _id }); // Use Item model
        const bookings = await Booking.find({ owner: _id }).populate('car').sort({ createdAt: -1 }); // Use 'item' instead of 'car'
        const pendingBookings = await Booking.find({ owner: _id, status: "pending" });
        const completedBookings = await Booking.find({ owner: _id, status: "confirmed" });

        // calculate monthlyRevenue from booking where status is confirmed
        const monthlyRevenue = bookings.filter(booking => booking.status === 'confirmed').reduce((acc, booking) => acc + booking.price, 0);
        const dashboardData = { // Renamed variable to avoid conflict
            totalItems: items.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0, 3),
            monthlyRevenue
        };
        res.json({ success: true, dashboardData });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to update user image
export const updateUserImage = async (req, res) => {
    try {
        const { _id } = req.user;
        const imageFile = req.file;
        if (!imageFile) {
            return res.status(400).json({ success: false, message: "Image file is missing." });
        }
       
        // upload image to imagekit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        });

        // Delete the temporary file from the server
        fs.unlinkSync(imageFile.path);

        // optimisation through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '400' },
                { quality: 'auto' },
                { format: 'webp' }]
        });

        const image = optimizedImageUrl;
        await User.findByIdAndUpdate(_id, { image });
        res.json({ success: true, message: "Image Updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// ⭐ NEW API: Update vendor-specific profile details (storeName, phoneNumber, location)
export const updateVendorProfile = async (req, res) => {
    try {
        const { _id, role } = req.user;
        const { storeName, phoneNumber, location } = req.body;

        // 1. Authorization Check: Only owners can update these details.
        if (role !== 'owner') {
            return res.status(403).json({ success: false, message: "Access denied. Only vendors can update profile details." });
        }

        // 2. Prepare Update Data
        // Use an object to hold the fields to update
        const updateFields = {
            storeName,
            phoneNumber,
            location
        };

        // 3. Update the User document in the database
        const updatedUser = await User.findByIdAndUpdate(
            _id, 
            updateFields, 
            { new: true, runValidators: true } // returns the new document and runs schema validators
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // 4. Respond with success and the updated user object (required by client-side logic)
        res.json({ 
            success: true, 
            message: "Vendor details updated successfully.", 
            user: updatedUser 
        });

    } catch (error) {
        console.error("Error updating vendor profile:", error.message);
        // For security, avoid sending raw internal error messages in production
        res.status(500).json({ success: false, message: "Failed to update vendor profile. Please check server logs." });
    }
};


export const getItemDetails = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameter

        // Assuming your items are stored in the Car model
        const item = await Item.findById(id); 

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        // Return the item data
        res.json({ success: true, item });
    } catch (error) {
        console.log(error.message);
        // Handle case where ID format is invalid
        res.status(500).json({ success: false, message: "Server error fetching item details" });
    }
};

export const getVendorServices = async (req, res) => {
  try {
    const vendorId = req.params.id;

    // Get vendor details
    const vendor = await User.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    // Fetch items/services created by this vendor
    const services = await Item.find({ owner: vendorId });

    res.status(200).json({
      success: true,
      vendor,
      services,
    });

  } catch (error) {
    console.error("Error fetching vendor services:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};