// src/pages/admin/AdminSettings.jsx

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AdminSettings = () => {
    const { axios } = useAppContext();
    const [settingValue, setSettingValue] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            // This is a new endpoint we'll create
            const response = await axios.get('/api/admin/settings');
            if (response.data.success) {
                // Assuming the backend sends back a 'setting' object
                setSettingValue(response.data.setting.someValue);
            } else {
                toast.error("Failed to fetch settings.");
            }
        } catch (error) {
            toast.error("An error occurred while fetching settings.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/admin/settings', {
                someValue: settingValue
            });
            if (response.data.success) {
                toast.success("Settings saved successfully.");
            } else {
                toast.error("Failed to save settings.");
            }
        } catch (error) {
            toast.error("An error occurred while saving settings.");
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Loading settings...</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Settings</h1>
            <div className="bg-white rounded-xl shadow-lg p-6">
                <form onSubmit={handleSave}>
                    <div className="mb-4">
                        <label htmlFor="settingValue" className="block text-sm font-medium text-gray-700">
                            Some Setting
                        </label>
                        {/* <input
                            type="text"
                            id="settingValue"
                            value={settingValue}
                            onChange={(e) => setSettingValue(e.target.value)}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        /> */}
                    </div>
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save Settings
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;