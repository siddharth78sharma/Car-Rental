import React, { useState } from "react";
import { assets, cityList } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [serviceType, setServiceType] = useState("");
  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } =
    useAppContext();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/services?serviceType=${serviceType}&pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returndate=${returnDate}`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="h-screen w-full flex flex-col items-center justify-center relative text-white overflow-hidden"
    >
      {/* ===== Background Image / Gradient ===== */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1920&q=80"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      {/* ===== Title & Logo ===== */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <Link to="/" className="inline-block">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={assets.logo}
            alt="logo"
            className="max-w-[220px] md:max-w-[180px] object-contain"
          />
        </Link>

        <h1 className="mt-6 text-4xl md:text-5xl font-semibold">
          Book Your Perfect Ride
        </h1>
        <p className="text-lg mt-2 opacity-90">Cars • Bikes • Villas • More</p>
      </motion.div>

      {/* ===== Search Box (Glass Effect) ===== */}
      <motion.form
        onSubmit={handleSearch}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 mt-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-6 md:p-8 w-[90%] max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-black">
          {/* Service Type */}
          <div className="flex flex-col gap-1">
            <label className="text-white font-medium">Service</label>
            <select
              required
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="bg-white/80 text-black rounded-lg px-3 py-2 outline-none"
            >
              <option value="">Select Service</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="villa">Villa</option>
              <option value="furniture">Furniture</option>
              <option value="electronics">Electronics</option>
              <option value="instruments">Instruments</option>
            </select>
          </div>

          {/* Pickup Location */}
          <div className="flex flex-col gap-1">
            <label className="text-white font-medium">Pickup Location</label>
            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="bg-white/80 text-black rounded-lg px-3 py-2 outline-none"
            >
              <option value="">Select Location</option>
              {cityList.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Pickup Date */}
          <div className="flex flex-col gap-1">
            <label className="text-white font-medium">Pick-up Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="bg-white/80 text-black rounded-lg px-3 py-2 outline-none"
            />
          </div>

          {/* Return Date */}
          <div className="flex flex-col gap-1">
            <label className="text-white font-medium">Return Date</label>
            <input
              type="date"
              required
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="bg-white/80 text-black rounded-lg px-3 py-2 outline-none"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-semibold shadow-lg"
        >
          Search
        </motion.button>
      </motion.form>

      {/* ===== Bottom Car Image ===== */}
      {/* <motion.img
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        src={assets.main_car}
        className="relative z-10 mt-10 max-w-[420px] drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
      /> */}
    </motion.div>
  );
};

export default Hero;












// import React, { useState } from "react";
// import { assets, cityList } from "../assets/assets";
// import { useAppContext } from "../context/AppContext";
// import { motion } from "motion/react";
// import { Link } from "react-router-dom";

// const Hero = () => {
//   const [pickupLocation, setPickupLocation] = useState("");
//     const [serviceType, setServiceType] = useState(""); 
//   const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     navigate(
//       `/services?serviceType=${serviceType}&pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returndate=${returnDate}`
//     );
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.8 }}
//       className="h-screen flex flex-col items-center justify-center gap-14 bg-light text-center"
//     >
//       {/* ===== Logo Section ===== */}
//       <motion.div
//         initial={{ y: 50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.8, delay: 0.2 }}
//         className="flex justify-center"
//       >
//         <Link to="/" className="inline-block">
//           <motion.img
//             whileHover={{ scale: 1.05 }}
//             src={assets.logo}
//             alt="logo"
//             className="max-w-[180px] md:max-w-[220px] lg:max-w-[250px] object-contain"
//             transition={{ type: "spring", stiffness: 300 }}
//           />
//         </Link>
//       </motion.div>

//       {/* ===== Search Form ===== */}
//       <motion.form
//         initial={{ scale: 0.95, y: 50, opacity: 0 }}
//         animate={{ scale: 1, y: 0, opacity: 1 }}
//         transition={{ duration: 0.6, delay: 0.4 }}
//         onSubmit={handleSearch}
//         className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-5xl bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]"
//       >
//         <div className="flex flex-col md:flex-row items-start md:items-center gap-10 md:ml-8">
 
//            {/* ===== Service Type Dropdown ===== */}
//           <div className="flex flex-col items-start gap-2">
//             <select
//               required
//               value={serviceType}
//               onChange={(e) => setServiceType(e.target.value)}
//               className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//             >
//               <option value="">Select Service</option>
//               <option value="car">Car</option>
//               <option value="bike">Bike</option>
//               <option value="villa">Villa</option>
//               <option value="furniture">Furniture</option>
//               <option value="electronics">Electronics</option>
//               <option value="instruments">Instruments</option>
//             </select>
//             <p className="text-sm text-gray-500">
//               {serviceType ? serviceType.charAt(0).toUpperCase() + serviceType.slice(1) : "Please select a service"}
//             </p>
//           </div>

//           <div className="flex flex-col items-start gap-2">
//             <select
//               required
//               value={pickupLocation}
//               onChange={(e) => setPickupLocation(e.target.value)}
//               className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//             >
//               <option value="">Pickup Location</option>
//               {cityList.map((city) => (
//                 <option key={city} value={city}>
//                   {city}
//                 </option>
//               ))}
//             </select>
//             <p className="text-sm text-gray-500">
//               {pickupLocation ? pickupLocation : "Please select location"}
//             </p>
//           </div>

//           <div className="flex flex-col items-start gap-2">
//             <label htmlFor="pickup-date" className="font-medium">
//               Pick-up Date
//             </label>
//             <input
//               value={pickupDate}
//               onChange={(e) => setPickupDate(e.target.value)}
//               type="date"
//               id="pickup-date"
//               min={new Date().toISOString().split("T")[0]}
//               className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//               required
//             />
//           </div>

//           <div className="flex flex-col items-start gap-2">
//             <label htmlFor="return-date" className="font-medium">
//               Return Date
//             </label>
//             <input
//               value={returnDate}
//               onChange={(e) => setReturnDate(e.target.value)}
//               type="date"
//               id="return-date"
//               className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//               required
//             />
//           </div>
//         </div>

//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer"
//         >
//           <img src={assets.search_icon} alt="search" className="brightness-300" />
//           Search
//         </motion.button>
//       </motion.form>

//       {/* ===== Main Image ===== */}
//       <motion.img
//         initial={{ y: 100, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.8, delay: 0.6 }}
//         src={assets.main_car}
//         alt="car"
//         className="max-h-70 w-150 object-contain"
//       />
//     </motion.div>
//   );
// };

// export default Hero;














// import React, { useState } from 'react'
// import { assets, cityList } from '../assets/assets'
// import { useAppContext } from '../context/AppContext'
// import {motion} from 'motion/react'
// import { Link } from 'react-router-dom';

// const Hero = () => {

//      const [pickupLocation, setPickupLocation] = useState('')

//      const {pickupDate, setPickupDate, returnDate, setReturnDate, navigate} = useAppContext()

//      const heandleSearch = (e)=> {
//       e.preventDefault()
//       navigate('/services?pickupLocation=' + pickupLocation + '&pickupDate=' + pickupDate + '&returndate=' + returnDate)
//      }

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1}} transition={{ duration: 0.8 }} className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center'>
      
//        <motion.h1 initial={{ y: 50, opacity:0 }} animate={{ y: 0, opacity: 1}} transition={{ duration: 0.8, delay: 0.2 }} className='text-4xl md:text-4xl font-semibold'>
//          <Link to='/'>
//              <motion.img whileHover={{ scale: 1.05 }} src={assets.logo} alt="logo"  className='bg-white'/>
//         </Link>
//        </motion.h1>

//        <motion.form initial={{ scale: 0.95, y: 50, opacity:0}} animate={{ scale: 1, y: 0, opacity: 1}} transition={{ duration: 0.6, delay: 0.4 }} onSubmit={heandleSearch} className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-55 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'>

//         <div className='flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8'>

//           {/* <div className='flex flex-col items-start gap-2'>
//                 <select required value={pickupLocation} onChange={(e)=>setPickupLocation(e.target.value)}>
//                    <option value="">Services</option>
//                    {cityList.map((city)=> <option key={city}value={city}>{city}</option>)}
//                 </select>
//                 <p className='px-l text-sm text-gray-500'>{pickupLocation ? pickupLocation :'Please select service'}</p>
//             </div> */}

//             <div className='flex flex-col items-start gap-2'>
//                 <select required value={pickupLocation} onChange={(e)=>setPickupLocation(e.target.value)}>
//                    <option value="">Pickup Location</option>
//                    {cityList.map((city)=> <option key={city}value={city}>{city}</option>)}
//                 </select>
//                 <p className='px-l text-sm text-gray-500'>{pickupLocation ? pickupLocation :'Please select location'}</p>
//             </div>
//             <div className='flex flex-col items-start gap-2'>
//                 <label htmlFor='pickup-date'>Pick-up Date</label>
//                 <input value={pickupDate} onChange={e=>setPickupDate(e.target.value)} type="date" id="pickup-date" min={new Date().toISOString().split('T')[0]} className='text-sm text-gray-500' required/>
//             </div>
//              <div className='flex flex-col items-start gap-2'>
//                 <label htmlFor='return-date'>Return Date</label>
//                 <input value={returnDate} onChange={e=>setReturnDate(e.target.value)} type="date" id="return-date" className='text-sm text-gray-500' required/>
//             </div>
             
//         </div>
//              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer'>
//                 <img src={assets.search_icon} alt="search" className='brightness-300' />
//                 Search
//               </motion.button>
//      </motion.form>

//        <motion.img initial={{y: 100, opacity:0}} animate={{ y: 0, opacity: 1}} transition={{ duration: 0.8, delay: 0.6 }} src={assets.main_car} alt="car" className='max-h-70 w-150'/>
//     </motion.div>
//   )
// }

// export default Hero