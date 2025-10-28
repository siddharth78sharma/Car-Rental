import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types

const bookingShema = new mongoose.Schema({
    // FIX: The ref should be 'Item' to match the exported model name in car.js
    car: {type: ObjectId, ref: 'Item', required: true},
    user: {type: ObjectId, ref: "User", required: true},
    owner: {type: ObjectId, ref: "User", required: true},
    pickupDate: {type: Date, required: true},
    returnDate: {type: Date, required: true},
    status: {type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending"},
    price: {type: Number, required: true},
     paymentMethod: { type: String, enum: ['card', 'paypal', 'cash', 'default'], default: 'default' }
},{timestamps: true})

// FIX: Check if the model already exists before compiling it
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingShema)

export default Booking 
