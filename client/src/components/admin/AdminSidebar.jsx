import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // 💡 Import useLocation
import { assets } from '../../assets/assets';
import { BiSolidDashboard, BiSolidUser, BiSolidPackage, BiSolidReport, BiSolidCog } from "react-icons/bi";
import { FaBoxes } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useAppContext } from '../../context/AppContext';
import { MdOutlineStoreMallDirectory } from "react-icons/md";

// Define the sidebar menu items
const menuItems = [
    {
        name: "Dashboard",
        icon: <BiSolidDashboard size={20} />,
        path: "/admin"
    },
    {
        name: "Items",
        icon: <FaBoxes size={20} />,
        path: "/admin/items"
    },
    {
        name: "Orders",
        icon: <MdOutlineStoreMallDirectory size={20} />,
        path: "/admin/orders"
    },
    {
        name: "Users",
        icon: <BiSolidUser size={20} />,
        path: "/admin/users"
    },
    {
        name: "Vendors",
        icon: <BiSolidUser size={20} />,
        path: "/admin/vendors"
    },
    {
        name: "Reports",
        icon: <BiSolidReport size={20} />,
        path: "/admin/reports"
    },
    {
        name: "Settings",
        icon: <BiSolidCog size={20} />,
        path: "/admin/settings"
    },
];

const AdminSidebar = () => {
    const { logout } = useAppContext();
    // 💡 Get the current URL location object
    const location = useLocation();

    // Helper function to determine if a menu item is active
    const isActive = (path) => {
        // Special handling for the base path '/admin' to avoid it matching all sub-paths
        if (path === '/admin') {
            return location.pathname === '/admin' || location.pathname === '/admin/';
        }
        // Check if the current pathname starts with the menu item's path
        return location.pathname.startsWith(path);
    };

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-4 z-50 transition-transform -translate-x-full md:translate-x-0">
            {/* Sidebar Header */}
            <div className="flex items-center justify-center p-4">
               <Link to='/'>
                <img src={assets.logo} alt="Logo" className="w-auto h-8" />
                </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="mt-8">
                <ul>
                    {menuItems.map((item, index) => {
                        const active = isActive(item.path);
                        
                        // 💡 Dynamically construct the className based on the active state
                        const linkClasses = `
                            flex items-center gap-4 p-3 rounded-lg transition-colors duration-200
                            ${active 
                                ? 'bg-blue-600 text-white shadow-md' // Active (clicked/current) style
                                : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600' // Inactive style
                            }
                        `;
                        
                        const iconClasses = `
                            ${active 
                                ? 'text-white' // Active icon color
                                : 'text-gray-500' // Inactive icon color
                            }
                        `;

                        return (
                            <li key={index} className="mb-2">
                                <Link 
                                    to={item.path} 
                                    className={linkClasses}
                                >
                                    <span className={iconClasses}>{item.icon}</span>
                                    <span className="text-lg font-medium">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-4 left-4 right-4">
                <button
                    onClick={logout}
                    className="flex items-center w-full gap-4 p-3 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 transition-colors duration-200"
                >
                    <span className="text-lg">
                        <MdLogout size={20} />
                    </span>
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;















// import React from 'react';
// import { Link } from 'react-router-dom';
// import { assets } from '../../assets/assets';
// import { BiSolidDashboard, BiSolidUser, BiSolidPackage, BiSolidReport, BiSolidCog } from "react-icons/bi";
// import { FaBoxes } from "react-icons/fa";
// import { MdLogout } from "react-icons/md";
// import { useAppContext } from '../../context/AppContext';
// import { MdOutlineStoreMallDirectory } from "react-icons/md";

// // Define the sidebar menu items
// const menuItems = [
//     {
//         name: "Dashboard",
//         icon: <BiSolidDashboard size={20} />,
//         path: "/admin"
//     },
//     {
//         name: "Items",
//         icon: <FaBoxes size={20} />,
//         path: "/admin/items"
//     },
//     {
//         name: "Orders",
//         icon: <MdOutlineStoreMallDirectory size={20} />,
//         path: "/admin/orders"
//     },
//     {
//         name: "Users",
//         icon: <BiSolidUser size={20} />,
//         path: "/admin/users"
//     },
//     {
//         name: "Vendors",
//         icon: <BiSolidUser size={20} />,
//         path: "/admin/vendors"
//     },
//     {
//         name: "Reports",
//         icon: <BiSolidReport size={20} />,
//         path: "/admin/reports"
//     },
//     {
//         name: "Settings",
//         icon: <BiSolidCog size={20} />,
//         path: "/admin/settings"
//     },
// ];

// const AdminSidebar = () => {
//     const { logout } = useAppContext();

//     return (
//         <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-4 z-50 transition-transform -translate-x-full md:translate-x-0">
//             {/* Sidebar Header */}
//             <div className="flex items-center justify-center p-4">
//                 <img src={assets.logo} alt="Logo" className="w-auto h-8" />
//             </div>

//             {/* Navigation Menu */}
//             <nav className="mt-8">
//                 <ul>
//                     {menuItems.map((item, index) => (
//                         <li key={index} className="mb-2">
//                             <Link 
//                                 to={item.path} 
//                                 className="flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-blue-100 transition-colors duration-200"
//                             >
//                                 <span className="text-gray-500">{item.icon}</span>
//                                 <span className="text-lg font-medium">{item.name}</span>
//                             </Link>
//                         </li>
//                     ))}
//                 </ul>
//             </nav>

//             {/* Logout Button */}
//             <div className="absolute bottom-4 left-4 right-4">
//                 <button
//                     onClick={logout}
//                     className="flex items-center w-full gap-4 p-3 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 transition-colors duration-200"
//                 >
//                     <span className="text-lg">
//                         <MdLogout size={20} />
//                     </span>
//                     <span className="font-medium">Logout</span>
//                 </button>
//             </div>
//         </aside>
//     );
// };

// export default AdminSidebar;