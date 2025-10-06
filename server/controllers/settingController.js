import Setting from "../models/Setting.js";

// Get all settings
export const getSettings = async (req, res) => {
    try {
        // Find the single settings document (or create one if it doesn't exist)
        const settings = await Setting.findOne();
        if (!settings) {
            const newSettings = await Setting.create({});
            return res.json({ success: true, setting: newSettings });
        }
        res.json({ success: true, setting: settings });
    } catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ success: false, message: "Server error fetching settings." });
    }
};

// Update settings
export const updateSettings = async (req, res) => {
    try {
        const { someValue } = req.body;
        // Find and update the settings document. 'upsert: true' creates the document if it doesn't exist.
        const updatedSettings = await Setting.findOneAndUpdate({}, { someValue }, { new: true, upsert: true });

        if (!updatedSettings) {
            return res.json({ success: false, message: "Settings not found." });
        }
        
        res.json({ success: true, message: "Settings updated successfully.", setting: updatedSettings });
    } catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ success: false, message: "Server error updating settings." });
    }
};