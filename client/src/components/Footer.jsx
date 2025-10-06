import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom' // Import the Link component
import { motion } from 'motion/react'

const Footer = () => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className='px-6 md:px-16 lg:px-24 xl:px-32 mt-20 py-16 text-sm text-indigo-200 bg-indigo-900' // Changed to indigo background and text color
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b mt-4'
      >
        <div>
          <motion.img initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} src={assets.logo} alt="logo" className='h-8 md:h-9' />
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className='max-w-80 mt-3 gap-2'>
            Premium Rental Services with a wide selection of luxury and every day vehicles for all your driving needs.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className='flex items-center gap-3 mt-6'>
            <a href='#'><img src={assets.facebook_logo} className='w-5 h-5' alt="" /></a>
            <a href='#'><img src={assets.instagram_logo} className='w-5 h-5' alt="" /></a>
            <a href='#'><img src={assets.twitter_logo} className='w-5 h-5' alt="" /></a>
            <a href='#'><img src={assets.gmail_logo} className='w-5 h-5' alt="" /></a>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='flex flex-wrap justify-between w-1/2 gap-8'
        >
          <div>
            <h2 className='text-base font-medium text-white uppercase'>Quick Links</h2>
            <ul className='mt-3 flex flex-col gap-2'>
              <li><Link to="/" className='hover:text-white transition-colors'>Home</Link></li>
              <li><Link to="/services" className='hover:text-white transition-colors'>Browse Services</Link></li>
              <li><Link to="/my-bookings" className='hover:text-white transition-colors'>My Bookings</Link></li>
              <li><Link to="/owner" className='hover:text-white transition-colors'>List Items</Link></li>
            </ul>
          </div>
          
          <div>
            <h2 className='text-base font-medium text-white uppercase'>Resources</h2>
            <ul className='mt-3 flex flex-col gap-2'>
              <li><Link to="/about" className='hover:text-white transition-colors'>About Us</Link></li>
              <li><Link to="/help" className='hover:text-white transition-colors'>Help Center</Link></li>
              <li><Link to="/terms" className='hover:text-white transition-colors'>Terms of Service</Link></li>
              <li><Link to="/privacy" className='hover:text-white transition-colors'>Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h2 className='text-base font-medium text-white uppercase'>Contact</h2>
            <ul className='mt-3 flex flex-col gap-2'>
              <li>1234 Luxury Items</li>
              <li>Delhi, CA 98762</li>
              <li>+1 234 567890</li>
              <li>info@example.com</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className='flex flex-col md:flex-row gap-2 items-center justify-between py-5 mt-4'
      >
        <p>© {new Date().getFullYear()} <a href="https://prebuiltui.com" className='hover:underline'>PrebuiltUI</a>. All rights reserved.</p>
        <ul className='flex items-center gap-4'>
          <li><Link to="/privacy" className='hover:text-white transition-colors'>Privacy</Link></li>
          <li>|</li>
          <li><Link to="/terms" className='hover:text-white transition-colors'>Terms</Link></li>
          <li>|</li>
          <li><Link to="/cookies" className='hover:text-white transition-colors'>Cookies</Link></li>
        </ul>
      </motion.div>
    </motion.div>
  )
}

export default Footer











// import React from 'react'
// import { assets } from '../assets/assets'
// import { Link } from 'react-router-dom' // Import the Link component
// import {motion} from 'motion/react'

// const Footer = () => {
//   return (
//     <motion.div initial={{y: 30, opacity:0}} whileInView={{ y: 0, opacity: 1}} transition={{ duration: 0.6 }} className='px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500'>
//       <motion.div initial={{y: 20, opacity:0}} whileInView={{ y: 0, opacity: 1}} transition={{ duration: 0.6, delay: 0.2 }} className='flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b'>
//         <div>
//           <motion.img initial={{ opacity:0}} whileInView={{ opacity: 1}} transition={{ duration: 0.5, delay: 0.3 }} src={assets.logo} alt="logo" className='h-8 md:h-9' />
//           <motion.p initial={{ opacity:0}} whileInView={{ opacity: 1}} transition={{ duration: 0.5, delay: 0.4 }} className='max-w-80 mt-3'>
//             Premium Rental Services with a wide selection of luxury and every day vehicles for all your driving needs.
//           </motion.p>
//           <motion.div initial={{ opacity:0}} whileInView={{ opacity: 1}} transition={{ duration: 0.5, delay: 0.5 }} className='flex items-center gap-3 mt-6'>
//             <a href='#'><img src={assets.facebook_logo} className='w-5 h-5' alt="" /></a>
//             <a href='#'><img src={assets.instagram_logo} className='w-5 h-5' alt="" /></a>
//             <a href='#'><img src={assets.twitter_logo} className='w-5 h-5' alt="" /></a>
//             <a href='#'><img src={assets.gmail_logo} className='w-5 h-5' alt="" /></a>
//           </motion.div>
//         </div>

//          <motion.div initial={{y: 20, opacity:0}} whileInView={{ y: 0, opacity: 1}} transition={{ duration: 0.6, delay: 0.4 }} className='flex flex-wrap justify-between w-1/2 gap-8'>
          
//           <div>
//           <h2 className='text-base font-medium text-gray-800 uppercase'>Quick Links</h2>
//           <ul className='mt-3 flex flex-col gap-1.5'>
//             {/* The following links will navigate without a page refresh */}
//             <li><Link to="/">Home</Link></li>
//             <li><Link to="/services">Browse Services</Link></li>
//             <li><Link to="/my-bookings">My Bookings</Link></li>
//             <li><Link to="/owner">List Items</Link></li>
//           </ul>
//         </div>
        
//         <div>
//           <h2 className='text-base font-medium text-gray-800 uppercase'>Resources</h2>
//           <ul className='mt-3 flex flex-col gap-1.5'>
//             {/* The following links will navigate without a page refresh */}
//             <li><Link to="/about">About Us</Link></li>
//             <li><Link to="/help">Help Center</Link></li>
//             <li><Link to="/terms">Terms of Service</Link></li>
//             <li><Link to="/privacy">Privacy Policy</Link></li>
//           </ul>
//         </div>

//         <div>
//           <h2 className='text-base font-medium text-gray-800 uppercase'>Contact</h2>
//           <ul className='mt-3 flex flex-col gap-1.5'>
//             <li>1234 Luxury Items</li>
//             <li>Delhi, CA 98762</li>
//             <li>+1 234 567890</li>
//             <li>info@example.com</li>
//           </ul>
//         </div>
//         </motion.div>

//       </motion.div>
      
//       <motion.div initial={{y: 10, opacity:0}} whileInView={{ y: 0, opacity: 1}} transition={{ duration: 0.6, delay: 0.6 }} className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
//         <p>© {new Date().getFullYear()} <a href="https://prebuiltui.com">PrebuiltUI</a>. All rights reserved.</p>
//         <ul className='flex items-center gap-4'>
//           {/* The following links will navigate without a page refresh */}
//           <li><Link to="/privacy">Privacy</Link></li>
//           <li>|</li>
//           <li><Link to="/terms">Terms</Link></li>
//           <li>|</li> 
//           <li><Link to="/cookies">Cookies</Link></li>
//         </ul>
//       </motion.div>
//     </motion.div>
//   )
// }

// export default Footer