import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { MdLogout } from "react-icons/md";

const Sidebar = () => {

    const { user, axios, fetchUser, logout } = useAppContext()
    const location = useLocation()
    const [image, setImage] = useState('')

    const updateImage = async () => {
        try {
            const fromData = new FormData()
            fromData.append('image', image)

            const { data } = await axios.post('/api/owner/update-image', fromData)

            if (data.success) {
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

    return (
        <div className='w-full md:w-64 bg-gray-50 text-gray-900 p-6 shadow-lg md:fixed md:h-full flex flex-col items-center font-sans'>
            <div className='flex items-center gap-2 mb-8 md:hidden'>
                <img src={assets.logo} alt="logo" className="h-8 w-8" />
                {/* <span className='font-bold text-xl'>Dasher UI</span> */}
            </div>

            <div className='group relative'>
                <label htmlFor="image">
                    <img src={image ? URL.createObjectURL(image) : user?.image || "https://i.pravatar.cc/150?img=3"} alt="" className='h-14 w-14 rounded-full mx-auto border-4 border-gray-300 object-cover'/>
                    <input type="file" id='image' accept="image/*" hidden onChange={e => setImage(e.target.files[0])} />

                    <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer'>
                        <img src={assets.edit_icon} alt="" className='h-6 w-6' />
                    </div>
                </label>
            </div>
            {image && (
                <button className='absolute top-0 right-0 flex p-2 gap-1 bg-blue-100 text-blue-600 cursor-pointer' onClick={updateImage}>
                    Save <img src={assets.check_icon} width={13} alt="" />
                </button>
            )}
            <p className='mt-2 text-base font-semibold text-gray-800'>{user?.name}</p>

            <div className='w-full mt-8'>
                {ownerMenuLinks.filter(link => link.path !== '/owner/add-items').map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path}
                        end={link.path === '/owner'}
                        className={({ isActive }) =>
                            `relative flex items-center gap-3 w-full py-3 pl-4 rounded-lg first:mt-6 transition-all duration-200 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`
                        }
                    >
                        <img src={location.pathname.startsWith(link.path) ? link.coloredIcon : link.icon} alt="" className='h-5 w-5 opacity-90' />
                        <span className='max-md:hidden'>{link.name}</span>
                        <div className={`${location.pathname.startsWith(link.path) && 'bg-blue-600'} w-1.5 h-8 rounded-l right-0 absolute`}></div>
                    </NavLink>
                ))}
            </div>
            
            {/* Logout Button */}
            <button
                onClick={logout}
                className="flex items-center w-full gap-4 p-3 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 transition-colors duration-200">
                    <span className="text-lg">
                        <MdLogout size={20} />
                    </span>
                    <span className="font-medium">Logout</span>
            </button>             
                        
        </div>
    );
}

export default Sidebar;













// import React, { useState } from 'react';
// import { assets, ownerMenuLinks } from '../../assets/assets';
// import { NavLink, useLocation } from 'react-router-dom';
// import { useAppContext } from '../../context/AppContext';
// import toast from 'react-hot-toast';
// import { MdLogout } from "react-icons/md";
// import VendorSettings from '../../pages/owner/VendorSettings';

// const Sidebar = () => {
//     const { user, axios, fetchUser, logout } = useAppContext();
//     const location = useLocation();
//     const [image, setImage] = useState('');

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
//     };

//     return (
//         <div className='w-full md:w-64 bg-gray-50 text-gray-900 p-6 shadow-lg md:fixed md:h-full flex flex-col items-center font-sans'>
//             <div className='flex items-center gap-2 mb-8 md:hidden'>
//                 <img src={assets.logo} alt="logo" className="h-8 w-8" />
//                 <span className='font-bold text-xl'>Dasher UI</span>
//             </div>

//             {/* Make the profile image a clickable link */}
//             <NavLink to="/profile" className='group relative'>
//                 <label htmlFor="image">
//                     <img 
//                         src={image ? URL.createObjectURL(image) : user?.profilePic || "https://i.pravatar.cc/150?img=3"} 
//                         alt="" 
//                         className='h-14 w-14 rounded-full mx-auto border-4 border-gray-300 object-cover'
//                     />
//                     <input type="file" id='image' accept="image/*" hidden onChange={e => setImage(e.target.files[0])} />

//                     <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer'>
//                         <img src={assets.edit_icon} alt="" className='h-6 w-6' />
//                     </div>
//                 </label>
//             </NavLink>
//             {image && (
//                 <button className='absolute top-0 right-0 flex p-2 gap-1 bg-blue-100 text-blue-600 cursor-pointer' onClick={updateImage}>
//                     Save <img src={assets.check_icon} width={13} alt="" />
//                 </button>
//             )}
//             <p className='mt-2 text-base font-semibold text-gray-800'>{user?.name}</p>

//             <div className='w-full mt-8'>
//                 {ownerMenuLinks.filter(link => link.path !== '/owner/add-items').map((link, index) => (
//                     <NavLink
//                         key={index}
//                         to={link.path}
//                         end={link.path === '/owner'}
//                         className={({ isActive }) =>
//                             `relative flex items-center gap-3 w-full py-3 pl-4 rounded-lg first:mt-6 transition-all duration-200 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`
//                         }
//                     >
//                         <img src={location.pathname.startsWith(link.path) ? link.coloredIcon : link.icon} alt="" className='h-5 w-5 opacity-90' />
//                         <span className='max-md:hidden'>{link.name}</span>
//                         <div className={`${location.pathname.startsWith(link.path) && 'bg-blue-600'} w-1.5 h-8 rounded-l right-0 absolute`}></div>
//                     </NavLink>
//                 ))}
//             </div>

            
//             <button
//                 onClick={logout}
//                 className="flex items-center w-full gap-4 p-3 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 transition-colors duration-200">
//                 <span className="text-lg">
//                     <MdLogout size={20} />
//                 </span>
//                 <span className="font-medium">Logout</span>
//             </button>             
//         </div>
//     );
// }

// export default Sidebar;