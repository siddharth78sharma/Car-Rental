import express from "express";
import { changeBookingStatus, checkAvailabilityOfCar, createBooking, getOwnerBookings, getUserBookings, getDashboardData, cancelBooking, extendBooking, getBookingSummary } from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

// Route to check car availability
bookingRouter.post('/check-availabillity', checkAvailabilityOfCar);

// Route to create a new booking
bookingRouter.post('/create', protect, createBooking);

// Route to get a user's bookings
bookingRouter.get('/user', protect, getUserBookings);

// Route to get an owner's bookings
bookingRouter.get('/owner', protect, getOwnerBookings);

// Route to change a booking's status
bookingRouter.post('/change-status', protect, changeBookingStatus);

// NEW: Route to get owner dashboard summary data
bookingRouter.get('/owner/dashboard', protect, getDashboardData);

bookingRouter.put('/cancel', protect, cancelBooking);
bookingRouter.put('/extend', protect, extendBooking);
bookingRouter.post('/summary', protect, getBookingSummary);

export default bookingRouter;


