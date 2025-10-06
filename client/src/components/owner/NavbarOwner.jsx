import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const NavbarOwner = () => {
   // Correct way to get the user object from the context
   const { user } = useAppContext();

   return (
     <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all'>
       <Link to='/'>
         <img src={assets.logo} alt="" className='h-7'/>
       </Link>
       
       <div className="flex items-center gap-4">
         <p className="text-gray-800 hidden sm:block">Welcome, <span className="font-semibold">{user?.name || "Owner"}</span></p>

         {/* Profile link with image */}
         {/* <Link to="/owner/profile">
           <img 
             src={user?.profilePic || assets.default_user_image} 
             alt="Profile" 
             className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 hover:border-blue-500 transition-colors"
           />
         </Link> */}
       </div>
     </div>
   )
}

export default NavbarOwner;













// import React from 'react'
// import { assets } from '../../assets/assets'
// import { Link } from 'react-router-dom';
// import { useAppContext } from '../../context/AppContext';

// const NavbarOwner = () => {

//    const { user } = useAppContext();

//   return (
//     <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all'>
       
//        <Link to='/'>
//        <img src={assets.logo} alt="" className='h-7'/>
//        </Link>
//        <p>Welcome, {user?.name || "Owner"}</p>
//     </div>
//   )
// }

// export default NavbarOwner