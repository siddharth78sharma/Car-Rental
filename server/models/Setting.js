import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
    // You can add different settings here
    someValue: { type: String, default: 'Default Value' },
}, { timestamps: true });

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;