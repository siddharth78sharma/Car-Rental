import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// Function to check Availability of Car for given Date
const checkAvailability = async (car, pickupDate, returnDate)=>{
    const bookings = await Booking.find({
        car,
        pickupDate: {$lte: returnDate},
        returnDate: {$gte: pickupDate},
    })
    return bookings.length === 0;
}

// API to check Availability of Cars for the given date and location
export const checkAvailabilityOfCar = async ( req, res )=>{
    try {
        const {location, pickupDate, returnDate} = req.body
        
        // Fetch all available car for the given location
        const cars = await Car.find({location, isAvaliable: true})

        // check Availability for the given date range using promise
        const availableCarsPromises = cars.map( async (car)=>{
        const isAvailable = await checkAvailability(car._id, pickupDate, returnDate)
        return {...car._doc, isAvailable: isAvailable}
        })

        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable === true)

        res.json({success: true, availableCars})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// // API to create Booking
// export const createBooking = async (req, res)=>{
//     try {
//         const {_id} = req.user;
//         const {car, pickupDate, returnDate} = req.body;

//         const isAvailable = await checkAvailability(car, pickupDate, returnDate)
//         if(!isAvailable){
//             return res.json({success: false, message: "Item is not available"})
//         }
        
//         const carData = await Car.findById(car)
        
//         // Calculate price based on pickupdate and returndate 
//         const picked = new Date(pickupDate);
//         const returned = new Date(returnDate);
//         const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
//         const price = carData.pricePerDay * noOfDays;

//         await Booking.create({car, owner: carData.owner, user: _id, pickupDate, returnDate, price})
        
//         res.json({success: true, message: "Booking Created"})

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }



// ✅ UPDATED: API to create Booking (supports Razorpay + location)
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const {
      car,
      pickupDate,
      returnDate,
      paymentMethod,
      paymentId,
      orderId,
      location,
    } = req.body;

    // Check availability for the selected dates
    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res.json({ success: false, message: "Item is not available" });
    }

    const carData = await Car.findById(car);
    if (!carData) {
      return res.json({ success: false, message: "Car not found" });
    }

    // Calculate total price based on rental duration
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    const price = carData.pricePerDay * noOfDays;

    // 🧾 Determine booking status based on payment method
    // const paymentStatus =
    //   paymentMethod === "razorpay" ? "paid" : "pending";

    // // ✅ Create the booking document
    // const newBooking = await Booking.create({
    //   car,
    //   owner: carData.owner,
    //   user: _id,
    //   pickupDate,
    //   returnDate,
    //   price,
    //   paymentMethod: paymentMethod || "cash",
    //   paymentId: paymentId || null,
    //   orderId: orderId || null,
    //   location: location || carData.location, // fallback if not provided
    //   paymentStatus: "pending",
      
    // });
    let paymentStatus = "pending";
    if (paymentMethod === "razorpay" && paymentId) {
      paymentStatus = "paid"; // ✅ Successful online payment
    }

    const newBooking = await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
      paymentMethod: paymentMethod || "cash",
      paymentStatus,
      paymentId: paymentId || null,
      orderId: orderId || null,
     // status: "confirmed", // optional
    });

    res.json({
      success: true,
      message:
        paymentMethod === "razorpay"
          ? "Booking confirmed successfully"
          : "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// API to create Booking (Updated to accept paymentMethod)
// export const createBooking = async (req, res)=>{
//     try {
//         const {_id} = req.user;
//         // ⭐ ADDED: paymentMethod
//         const {car, pickupDate, returnDate, paymentMethod} = req.body; 

//         const isAvailable = await checkAvailability(car, pickupDate, returnDate)
//         if(!isAvailable){
//             return res.json({success: false, message: "Item is not available"})
//         }
        
//         const carData = await Car.findById(car)
        
//         // Calculate price based on pickupdate and returndate 
//         const picked = new Date(pickupDate);
//         const returned = new Date(returnDate);
//         const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
//         const price = carData.pricePerDay * noOfDays;

//         // ⭐ UPDATED: Added paymentMethod to the Booking.create call
//         await Booking.create({
//             car, 
//             owner: carData.owner, 
//             user: _id, 
//             pickupDate, 
//             returnDate, 
//             price, 
//             paymentMethod: paymentMethod || 'default' // Save the chosen payment method
//         });
        
//         res.json({success: true, message: "Booking Confirmed and Created"})

//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({success: false, message: error.message})
//     }
// }


// API to list user Booking
export const getUserBookings = async (req, res)=>{
    try {
        const {_id} = req.user;
        let bookings = await Booking.find({ user: _id}).populate("car").sort({createdAt: -1})

        bookings = bookings.filter(booking => booking.car !== null);

        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get owner bookings
export const getOwnerBookings = async (req, res)=>{
    try {
        if(req.user.role !== 'owner'){
            return res.json({success: false, message: "Unauthorized" })
        }
        // FIX: The populate path is now 'car user' to match the Booking schema
        // and avoid the "Cannot populate path `item`" error
        let bookings = await Booking.find({owner: req.user._id}).populate('car user').select("-user.password").sort({createdAt: -1 })

        bookings = bookings.filter(booking => booking.car !== null && booking.user !== null);

        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to change booking status
export const changeBookingStatus = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {bookingId, status} = req.body

        const booking = await Booking.findById(bookingId)

        if(booking.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "unauthorized"})
        }

        booking.status = status;
        await booking.save();

        res.json({ success: true, message: "Status Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// NEW: API to get dashboard data for owner
export const getDashboardData = async (req, res)=>{
    try {
        if(req.user.role !== 'owner'){
            return res.json({success: false, message: "Unauthorized" })
        }
        const { _id } = req.user;

        // Fetch total items owned by the user
        const totalItems = await Car.countDocuments({ owner: _id });

        // Fetch all bookings for the owner
        const allBookings = await Booking.find({ owner: _id });

        // Calculate counts and recent bookings
        const totalBookings = allBookings.length;
        const pendingBookings = allBookings.filter(b => b.status === 'pending').length;
        const confirmedBookings = allBookings.filter(b => b.status === 'confirmed').length;
        const recentBookings = await Booking.find({ owner: _id }).populate('car').sort({ createdAt: -1 }).limit(5);

        // Calculate monthly revenue (simple example, you may want to refine this)
        const currentMonth = new Date().getMonth();
        const monthlyRevenue = allBookings
            .filter(b => b.status === 'confirmed' && new Date(b.createdAt).getMonth() === currentMonth)
            .reduce((total, booking) => total + booking.price, 0);

        const dashboardData = {
            totalItems,
            totalBookings,
            pendingBookings,
            confirmedBookings,
            recentBookings,
            monthlyRevenue,
        };

        res.json({ success: true, dashboardData });
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// NEW: Controller function to cancel a booking
export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const userId = req.user._id;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        // Ensure the logged-in user is the owner of the booking
        if (booking.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to cancel this booking." });
        }

        // Update the booking status to 'cancelled'
        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({ success: true, message: "Booking cancelled successfully." });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Server error. Could not cancel booking." });
    }
};

// NEW: Controller function to extend a booking
export const extendBooking = async (req, res) => {
    try {
        const { bookingId, newReturnDate } = req.body;
        const userId = req.user._id;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        if (booking.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to extend this booking." });
        }
        
        // Ensure the new date is valid (e.g., after the current return date)
        if (new Date(newReturnDate) <= new Date(booking.returnDate)) {
            return res.status(400).json({ success: false, message: "New return date must be after the current one." });
        }

        // Update the return date
        booking.returnDate = newReturnDate;
        await booking.save();

        res.status(200).json({ success: true, message: "Booking extended successfully." });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Server error. Could not extend booking." });
    }
};

// API to get a summary of the booking (used on the confirmation page)
export const getBookingSummary = async (req, res) => {
    try {
        const { car, pickupDate, returnDate } = req.body;

        // 1. Check availability
        const isAvailable = await checkAvailability(car, pickupDate, returnDate);
        if (!isAvailable) {
            return res.json({ success: false, message: "Item is not available for these dates." });
        }

        // 2. Fetch car data
        const carData = await Car.findById(car);
        if (!carData) {
            return res.json({ success: false, message: "Item not found." });
        }
        
        // 3. Calculate price
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        
        // Validation: Ensure return date is after pickup date
        if (returned <= picked) {
            return res.json({ success: false, message: "Return date must be after pickup date." });
        }

        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
        const price = carData.pricePerDay * noOfDays;

        res.json({
            success: true,
            summary: {
                car: carData, // Return car details for display
                pickupDate,
                returnDate,
                noOfDays,
                totalPrice: price,
            }
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Failed to create booking summary." });
    }
};


export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Allow only the user who created the booking or the owner to delete it
    if (
      booking.user.toString() !== userId.toString() &&
      booking.owner.toString() !== userId.toString()
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this booking" });
    }

    await Booking.findByIdAndDelete(bookingId);

    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Failed to delete booking" });
  }
};


export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("car")
      .populate("user", "name email phone")   // Select only relevant user fields
      .populate("owner", "name email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({ success: true, booking });
  } catch (err) {
    console.error("Error fetching booking details:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
