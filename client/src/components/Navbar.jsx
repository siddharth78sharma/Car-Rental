import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { menuLinks, assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import VendorRegistrationForm from './VendorRegistrationForm';

const Navbar = () => {
    // Destructure required values, including isOwner and isAdmin
    const { setShowLogin, user, logout, isOwner, isAdmin, setIsOwner, axios, fetchUser } = useAppContext();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [showVendorForm, setShowVendorForm] = useState(false);
    const [image, setImage] = useState('')

    const updateImage = async () => {
        try {
            const fromData = new FormData()
            fromData.append('image', image)

            const { data } = await axios.post('/api/owner/update-image', fromData)

            if (data.success) {
                // Assuming fetchUser is defined in AppContext and refreshes user data
                fetchUser() 
                toast.success(data.message)
                setImage('')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getDashboardPath = () => {
        if (isAdmin) return '/admin';
        if (isOwner) return '/owner';
        return '/'; 
    };

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    return (
        <>
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === '/' && "bg-light"}`}>
                <Link to='/'>
                    <motion.img whileHover={{ scale: 1.05 }} src={assets.logo} alt="logo" className="h-8 w-55" />
                </Link>
                
                <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === '/' ? "bg-light" : "bg-white"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
                    {menuLinks.map((link, index) => (
                        <Link key={index} to={link.path}>
                            {link.name}
                        </Link>
                    ))}

                    <Link to="/about">About Us</Link>
                    <Link to="/contact-us">Contact Us</Link>
                    <Link to="/help">Help</Link>
                    
                    <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
                        {!user ? (
                            <button onClick={() => setShowLogin(true)} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg">
                                Login
                            </button>
                        ) : (
                            <div className="relative">
                                {/* Corrected line: use user?.profilePic */}
                                <label htmlFor="image">
                                <img
                                    src={image ? URL.createObjectURL(image) : user?.image || "https://i.pravatar.cc/150?img=3"}
                                    alt="User Profile"
                                    className="w-10 h-10 rounded-full cursor-pointer"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                />
                                </label>
                                   {image && (
                                       <button className='absolute top-0 right-0 flex p-2 gap-1 bg-blue-100 text-blue-600 cursor-pointer'
                                        onClick={updateImage}
                                        >
                                           Save <img src={assets.check_icon} width={13} alt="" />
                                       </button>
                                   )}

                                {isMenuOpen && (
                                    <div className="absolute top-12 right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Profile Page
                                        </Link>
                                        
                                        {/* 1. CONDITIONAL DASHBOARD LINK */}
                                        {(isOwner || isAdmin) && (
                                            <Link
                                                to={getDashboardPath()}
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Dashboard
                                            </Link>
                                        )}

                                        {/* 2. CONDITIONAL BECOME A VENDOR BUTTON */}
                                        {/* Show ONLY if the user is logged in AND is a 'user' (not owner/admin) */}
                                        {user.role === 'user' && (
                                            <button 
                                                onClick={() => {
                                                    setShowVendorForm(true);
                                                    setIsMenuOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                            >
                                                Become a Vendor
                                            </button>
                                        )}

                                        {isAdmin && (
                                            <Link
                                                to="/admin/settings"
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Settings
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <button className='sm:hidden cursor-pointer' aria-label="menu" onClick={() => setOpen(!open)}>
                    <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
                </button>
            </motion.div>

            {showVendorForm && <VendorRegistrationForm setShowVendorForm={setShowVendorForm} />}
        </>
    );
};

export default Navbar;














// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { menuLinks, assets } from '../assets/assets';
// import { useAppContext } from '../context/AppContext';
// import { motion } from 'motion/react';
// import VendorRegistrationForm from './VendorRegistrationForm';

// const Navbar = () => {
//     const { setShowLogin, user, logout, isOwner, isAdmin, setIsOwner, axios, fetchUser, } = useAppContext();
//     const location = useLocation();
//     const [open, setOpen] = useState(false);
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const navigate = useNavigate();
//     const [showVendorForm, setShowVendorForm] = useState(false);
//     const [image, setImage] = useState('')

//     const updateImage = async () => {
//         try {
//             const fromData = new FormData()
//             fromData.append('image', image)

//             const { data } = await axios.post('/api/owner/update-image', fromData)

//             if (data.success) {
//                 fetchUser()
//                 toast.success(data.message)
//                 setImage('')
//             } else {
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             toast.error(error.message)
//         }
//         }

//     const getDashboardPath = () => {
//         if (isAdmin) return '/admin';
//         if (isOwner) return '/owner';
//         return '/'; 
//     };

//     const handleLogout = () => {
//         logout();
//         setIsMenuOpen(false);
//     };

//     return (
//         <>
//             <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === '/' && "bg-light"}`}>
//                 <Link to='/'>
//                     <motion.img whileHover={{ scale: 1.05 }} src={assets.logo} alt="logo" className="h-8 w-55" />
//                 </Link>
                
//                 <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === '/' ? "bg-light" : "bg-white"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
//                     {menuLinks.map((link, index) => (
//                         <Link key={index} to={link.path}>
//                             {link.name}
//                         </Link>
//                     ))}

//                     <Link to="/about">About Us</Link>
//                     <Link to="/contact-us">Contact Us</Link>
//                     <Link to="/help">Help</Link>
                    
//                     <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
//                         {!user ? (
//                             <button onClick={() => setShowLogin(true)} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg">
//                                 Login
//                             </button>
//                         ) : (
//                             <div className="relative">
//                                 {/* Corrected line: use user?.profilePic */}
//                                <label htmlFor="image">
//                                 <img
//                                     src={image ? URL.createObjectURL(image) : user?.image || "https://i.pravatar.cc/150?img=3"}
//                                     alt="User Profile"
//                                     className="w-10 h-10 rounded-full cursor-pointer"
//                                     onClick={() => setIsMenuOpen(!isMenuOpen)}
//                                 />
//                                 </label>
//                                  {image && (
//                                      <button className='absolute top-0 right-0 flex p-2 gap-1 bg-blue-100 text-blue-600 cursor-pointer' onClick={updateImage}>
//                                        Save <img src={assets.check_icon} width={13} alt="" />
//                                      </button>
//                                  )}

//                                 {isMenuOpen && (
//                                     <div className="absolute top-12 right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
//                                         <Link
//                                             to="/profile"
//                                             className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
//                                             onClick={() => setIsMenuOpen(false)}
//                                         >
//                                             Profile Page
//                                         </Link>
//                                         <Link
//                                             to={getDashboardPath()}
//                                             className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
//                                             onClick={() => setIsMenuOpen(false)}
//                                         >
//                                             Dashboard
//                                         </Link>
//                                         {user.role === 'user' && (
//                                             <button 
//                                                 onClick={() => {
//                                                     setShowVendorForm(true);
//                                                     setIsMenuOpen(false);
//                                                 }}
//                                                 className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
//                                             >
//                                                 Become a Vendor
//                                             </button>
//                                         )}
//                                         {isAdmin && (
//                                             <Link
//                                                 to="/admin/settings"
//                                                 className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
//                                                 onClick={() => setIsMenuOpen(false)}
//                                             >
//                                                 Settings
//                                             </Link>
//                                         )}
//                                         <button
//                                             onClick={handleLogout}
//                                             className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
//                                         >
//                                             Logout
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <button className='sm:hidden cursor-pointer' aria-label="menu" onClick={() => setOpen(!open)}>
//                     <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
//                 </button>
//             </motion.div>

//             {showVendorForm && <VendorRegistrationForm setShowVendorForm={setShowVendorForm} />}
//         </>
//     );
// };

// export default Navbar;
















// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { menuLinks, assets } from '../assets/assets';
// import { useAppContext } from '../context/AppContext';
// import { motion } from 'motion/react';
// import VendorRegistrationForm from './VendorRegistrationForm';

// const Navbar = () => {
//     const { setShowLogin, user, logout, isOwner, isAdmin, setIsOwner } = useAppContext();
//     const location = useLocation();
//     const [open, setOpen] = useState(false);
//     const [isMenuOpen, setIsMenuOpen] = useState(false); // New state for the profile menu
//     const navigate = useNavigate();
//     const [showVendorForm, setShowVendorForm] = useState(false);
//     const [image, setImage] = useState('')

//     const handleActionClick = () => {
//         if (!user) {
//             setShowLogin(true);
//         } else if (isAdmin) {
//             navigate('/admin');
//         } else if (isOwner) {
//             navigate('/owner');
//         } else {
//             setShowVendorForm(true);
//         }
//     };

//     const getActionText = () => {
//         if (!user) {
//             return "Login";
//         } else if (isAdmin) {
//             return "Admin Dashboard";
//         } else if (isOwner) {
//             return "Vendor Dashboard";
//         } else {
//             return "Become a Vendor";
//         }
//     };

//     const handleLogout = () => {
//         logout();
//         setIsMenuOpen(false); // Close the menu after logging out
//     };

//     const getDashboardPath = () => {
//         if (isAdmin) return '/admin';
//         if (isOwner) return '/owner';
//         return '/'; // A fallback path for regular users
//     };

//     return (
//         <>
//             <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === '/' && "bg-light"}`}>
//                 <Link to='/'>
//                     <motion.img whileHover={{ scale: 1.05 }} src={assets.logo} alt="logo" className="h-8 w-55" />
//                 </Link>
                
//                 <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === '/' ? "bg-light" : "bg-white"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
//                     {menuLinks.map((link, index) => (
//                         <Link key={index} to={link.path}>
//                             {link.name}
//                         </Link>
//                     ))}

//                     <Link to="/about">About Us</Link>
//                     <Link to="/contact-us">Contact Us</Link>
//                     <Link to="/help">Help</Link>
                    
//                     <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
//                         {!user ? (
//                             <button onClick={handleActionClick} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg">
//                                 {getActionText()}
//                             </button>
//                         ) : (
//                             <div className="relative">
//                                 {/* <img
//                                     src={user?.image || assets.default_user_image}
//                                     alt="User Profile"
//                                     className="w-10 h-10 rounded-full cursor-pointer"
//                                     onClick={() => setIsMenuOpen(!isMenuOpen)}
//                                 /> */}

//                                <label htmlFor="image">
//                                      <img src={image ? URL.createObjectURL(image) : user?.image || "https://i.pravatar.cc/150?img=3"}  alt="User Profile"
//                                     className='h-14 w-14 rounded-full mx-auto border-4 border-gray-300 object-cover'
//                                     onClick={() => setIsMenuOpen(!isMenuOpen)}/>
//                                </label>
//                                 {isMenuOpen && (
//                                     <div className="absolute top-12 right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
//                                         <Link
//                                             to="/profile"
//                                             className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
//                                             onClick={() => setIsMenuOpen(false)}
//                                         >
//                                             Profile Page
//                                         </Link>
//                                         <Link
//                                             to={getDashboardPath()}
//                                             className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
//                                             onClick={() => setIsMenuOpen(false)}
//                                         >
//                                             Dashboard
//                                         </Link>
//                                         {isAdmin && (
//                                             <Link
//                                                 to="/admin/settings"
//                                                 className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
//                                                 onClick={() => setIsMenuOpen(false)}
//                                             >
//                                                 Settings
//                                             </Link>
//                                         )}
//                                         <button
//                                             onClick={handleLogout}
//                                             className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
//                                         >
//                                             Logout
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <button className='sm:hidden cursor-pointer' aria-label="menu" onClick={() => setOpen(!open)}>
//                     <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
//                 </button>
//             </motion.div>

//             {showVendorForm && <VendorRegistrationForm setShowVendorForm={setShowVendorForm} />}
//         </>
//     );
// };

// export default Navbar;













// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { menuLinks, assets } from '../assets/assets';
// import { useAppContext } from '../context/AppContext';
// import { motion } from 'motion/react';
// import VendorRegistrationForm from './VendorRegistrationForm';

// const Navbar = () => {
//     const { setShowLogin, user, logout, isOwner, isAdmin, setIsOwner } = useAppContext();
//     const location = useLocation();
//     const [open, setOpen] = useState(false);
//     const navigate = useNavigate();
//     const [showVendorForm, setShowVendorForm] = useState(false);

//     const handleActionClick = () => {
//         if (!user) {
//             setShowLogin(true);
//         } else if (isAdmin) {
//             navigate('/admin');
//         } else if (isOwner) {
//             navigate('/owner');
//         } else {
//             setShowVendorForm(true);
//         }
//     };

//     const getActionText = () => {
//         if (!user) {
//             return "Login";
//         } else if (isAdmin) {
//             return "Admin Dashboard";
//         } else if (isOwner) {
//             return "Vendor Dashboard";
//         } else {
//             return "Become a Vendor";
//         }
//     };

//     return (
//         <>
//             <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === '/' && "bg-light"}`}>
//                 <Link to='/'>
//                     <motion.img whileHover={{ scale: 1.05 }} src={assets.logo} alt="logo" className="h-8 w-55" />
//                 </Link>
                
//                 <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === '/' ? "bg-light" : "bg-white"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
//                     {menuLinks.map((link, index) => (
//                         <Link key={index} to={link.path}>
//                             {link.name}
//                         </Link>
//                     ))}

//                     <Link to="/about">About Us</Link>
//                     <Link to="/contact-us">Contact Us</Link>
//                     <Link to="/help">Help</Link>
                    
//                     {/* New: Profile Link (visible only when logged in) */}
//                     {/* {user && (
//                         <Link to="/profile" className="max-sm:hidden">
//                             Profile
//                         </Link>
//                     )} */}

//                     <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
//                         <button onClick={handleActionClick} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg">
//                             {getActionText()}
//                         </button>
//                         {user && (
//                             <button onClick={logout} className="cursor-pointer px-8 py-2 bg-red-500 hover:bg-red-600 transition-all text-white rounded-lg">
//                                 Logout
//                             </button>
//                         )}
//                     </div>
//                 </div>

//                 <button className='sm:hidden cursor-pointer' aria-label="menu" onClick={() => setOpen(!open)}>
//                     <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
//                 </button>
//             </motion.div>

//             {showVendorForm && <VendorRegistrationForm setShowVendorForm={setShowVendorForm} />}
//         </>
//     );
// };

// export default Navbar;