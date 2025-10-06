import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const itemSchema = new mongoose.Schema({
    owner: { type: ObjectId, ref: 'User' },
    type: { type: String, enum: ["Car", "Bike", "House", "Furniture", "Electronics", "Instruments"], required: true },
    // FIX: Removed the default values so they will be empty if not provided
    brand: { type: String },
    model: { type: String },
    image: { type: String, required: true },
    year: { type: Number, default: new Date().getFullYear() },
    category: { type: String }, // FIX: Removed default
    seating_capacity: { type: Number},
    fuel_type: { type: String }, // FIX: Removed default
    pricePerDay: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    isAvaliable: { type: Boolean, default: true },
    features: { type: [String], default: [] },
    rooms: { type: Number, default: 0 },
}, { timestamps: true });

// FIX: Check if the model already exists before compiling it
const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);

export default Item;








