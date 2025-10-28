import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const VendorSettings = () => {
  const { user } = useAppContext();

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoLogin, setAutoLogin] = useState(false);

  // Save preferences locally in browser storage
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('vendorSettings'));
    if (savedSettings) {
      setDarkMode(savedSettings.darkMode);
      setNotifications(savedSettings.notifications);
      setAutoLogin(savedSettings.autoLogin);
    }
  }, []);

  const handleSave = () => {
    const settings = { darkMode, notifications, autoLogin };
    localStorage.setItem('vendorSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
  };

  const handleReset = () => {
    setDarkMode(false);
    setNotifications(true);
    setAutoLogin(false);
    localStorage.removeItem('vendorSettings');
    toast.success('Settings reset to default.');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl mx-auto space-y-8">
        {/* Account Overview */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
          <p className="text-gray-600"><strong>Name:</strong> {user?.name || 'N/A'}</p>
          <p className="text-gray-600"><strong>Email:</strong> {user?.email || 'N/A'}</p>
          <p className="text-gray-600"><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
        </section>

        {/* Preferences */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Preferences</h2>

          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-1 rounded-full font-medium text-sm ${
                darkMode ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {darkMode ? 'On' : 'Off'}
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Email Notifications</span>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`px-4 py-1 rounded-full font-medium text-sm ${
                notifications ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {notifications ? 'On' : 'Off'}
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Auto Login</span>
            <button
              onClick={() => setAutoLogin(!autoLogin)}
              className={`px-4 py-1 rounded-full font-medium text-sm ${
                autoLogin ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {autoLogin ? 'On' : 'Off'}
            </button>
          </div>
        </section>

        {/* Actions */}
        <section className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Save Changes
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition"
          >
            Reset to Default
          </button>
        </section>
      </div>
    </div>
  );
};

export default VendorSettings;
