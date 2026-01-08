// import React from 'react';
// import { motion } from 'motion/react';

// // This component uses an inline SVG for the map pin icon to keep it self-contained.
// const LocationIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//     </svg>
// );

// const ContactUs = () => {
//     // Array of location data to easily render cards
//     const locations = [
//         { city: 'DELHI-NCR', address: 'Plot No. 12 Sector 18, Maruti Industrial Area Gurgaon 122015' },
//         { city: 'BENGALURU', address: 'No 1, Bandappa Colony, New Biyapanahalli Extension, Old Madras Rd, opp. Montfort college, Bengaluru, Karnataka 560038' },
//         { city: 'MUMBAI', address: 'Plot No 94, Marol Co Op Industrial Estate, Andheri Kurla Road, Andheri East, Mumbai, Maharashtra 400059' },
//         { city: 'PUNE', address: '801-802, The Capital, Near Hotel Westin, Survey No. 272-273, Hissa No. 4, Village Wadgaon Sheri, Ramwadi, Pune, Maharashtra 411014' },
//         { city: 'HYDERABAD', address: 'Plot No. 34, Survey No. 72, Sy. No. 71/1/A, Kondapur, Hyderabad, Telangana 500084' },
//         { city: 'JAIPUR', address: 'Plot No. A-118, Road No. 9, Vishwakarma Industrial Area, Jaipur, Rajasthan 302013' },
//     ];

//     const containerVariants = {
//         hidden: { opacity: 0 },
//         visible: {
//             opacity: 1,
//             transition: {
//                 staggerChildren: 0.1,
//             },
//         },
//     };

//     const itemVariants = {
//         hidden: { y: 20, opacity: 0 },
//         visible: {
//             y: 0,
//             opacity: 1,
//             transition: {
//                 duration: 0.5,
//                 ease: 'easeOut',
//             },
//         },
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
//             <header className="text-center mb-12">
//                 <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">Contact Us</h1>
//                 <p className="text-lg mt-4 text-gray-600">
//                     We are Available 24x7 @ <a href="tel:+919512341234" className="text-indigo-600 hover:underline">9123457878</a>
//                 </p>
//             </header>

//             <motion.div
//                 className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//                 variants={containerVariants}
//                 initial="hidden"
//                 animate="visible"
//             >
//                 {locations.map((location, index) => (
//                     <motion.div
//                         key={index}
//                         className="contact-card bg-white rounded-2xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer flex flex-col items-center text-center"
//                         variants={itemVariants}
//                     >
//                         <div className="icon w-16 h-16 text-indigo-500 mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
//                             <LocationIcon />
//                         </div>
//                         <h2 className="text-xl font-semibold text-gray-800 mb-2">{location.city}</h2>
//                         <p className="text-gray-500 max-w-xs">{location.address}</p>
//                     </motion.div>
//                 ))}
//             </motion.div>
//         </div>
//     );
// };

// export default ContactUs;








import React from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const ContactUs = () => {
  const locations = [
    {
      city: "DELHI-NCR",
      address:
        "Plot No. 12 Sector 18, Maruti Industrial Area, Gurgaon, Haryana 122015",
    },
    {
      city: "BENGALURU",
      address:
        "No 1, Bandappa Colony, New Biyapanahalli Extension, Old Madras Rd, Opp. Montfort College, Bengaluru, Karnataka 560038",
    },
    {
      city: "MUMBAI",
      address:
        "Plot No 94, Marol Co-Op Industrial Estate, Andheri East, Mumbai, Maharashtra 400059",
    },
    {
      city: "PUNE",
      address:
        "801-802, The Capital, Near Hotel Westin, Survey No. 272-273, Wadgaon Sheri, Pune, Maharashtra 411014",
    },
    {
      city: "HYDERABAD",
      address:
        "Plot No. 34, Survey No. 72, Kondapur, Hyderabad, Telangana 500084",
    },
    {
      city: "JAIPUR",
      address:
        "Plot No. A-118, Road No. 9, Vishwakarma Industrial Area, Jaipur, Rajasthan 302013",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 font-sans pt-24">
      {/* Header Section */}
      <header className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-800"
        >
          Contact Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg mt-4 text-gray-600"
        >
          We're available 24x7 — Call us at{" "}
          <a
            href="tel:+919512341234"
            className="text-indigo-600 font-semibold hover:underline"
          >
            +91 95123 41234
          </a>
        </motion.p>
      </header>

      {/* Contact Info + Form */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        {/* Contact Info Section */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div
            variants={item}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
              <FaPhoneAlt />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
              <p className="text-gray-500">+91 95123 41234</p>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
              <FaEnvelope />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Email</h3>
              <p className="text-gray-500">support@carrental.com</p>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
              <FaMapMarkerAlt />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Head Office</h3>
              <p className="text-gray-500">
                Plot No. 12, Sector 18, Gurgaon, Haryana 122015
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white p-8 rounded-2xl shadow-sm"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Send us a Message
          </h2>
          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <textarea
              rows="4"
              placeholder="Your Message"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            ></textarea>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all"
            >
              Submit
            </motion.button>
          </div>
        </motion.form>
      </div>

      {/* Location Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {locations.map((loc, i) => (
          <motion.div
            key={i}
            variants={item}
            className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 mx-auto mb-3 text-indigo-600">
              <FaMapMarkerAlt className="text-3xl mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">{loc.city}</h3>
            <p className="text-gray-500 mt-2">{loc.address}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ContactUs;

