import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { MdLogout, MdOutlineSettings, MdKeyboardArrowDown } from 'react-icons/md';
import { useAppContext } from '../../context/AppContext';

const AdminHeader = () => {
    const [openProfileMenu, setOpenProfileMenu] = useState(false);
    const { user, logout } = useAppContext();

      const [image, setImage] = useState('')

    const handleLogout = () => {
        logout();
        setOpenProfileMenu(false);
    };

    return (
        <header className="sticky top-0 bg-white shadow-sm z-40 p-4 sm:p-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
                Hi, {user?.name || "Admin"}
            </h1>

            <div className="relative">
                <div 
                    onClick={() => setOpenProfileMenu(!openProfileMenu)}
                    className="flex items-center gap-3 cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                    <img 
                       // src={user?.image || assets.profile_icon} 
                        src={image ? URL.createObjectURL(image) : user?.image || "https://i.pravatar.cc/150?img=3"}
                        alt="User Profile" 
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <span className="hidden sm:inline-block font-medium text-gray-700">
                        {user?.name || "Admin"}
                    </span>
                    <MdKeyboardArrowDown 
                        className={`text-gray-500 transition-transform duration-200 ${openProfileMenu ? 'rotate-180' : ''}`}
                        size={20}
                    />
                </div>
                
                {/* Profile Dropdown Menu */}
                {openProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                        <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                            {user?.email || "admin@gmail.com"}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                        >
                            <MdLogout size={18} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default AdminHeader;