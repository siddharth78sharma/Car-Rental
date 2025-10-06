import React from 'react';
import { motion } from 'motion/react';

// This component uses an inline SVG for the map pin icon to keep it self-contained.
const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ContactUs = () => {
    // Array of location data to easily render cards
    const locations = [
        { city: 'DELHI-NCR', address: 'Plot No. 12 Sector 18, Maruti Industrial Area Gurgaon 122015' },
        { city: 'BENGALURU', address: 'No 1, Bandappa Colony, New Biyapanahalli Extension, Old Madras Rd, opp. Montfort college, Bengaluru, Karnataka 560038' },
        { city: 'MUMBAI', address: 'Plot No 94, Marol Co Op Industrial Estate, Andheri Kurla Road, Andheri East, Mumbai, Maharashtra 400059' },
        { city: 'PUNE', address: '801-802, The Capital, Near Hotel Westin, Survey No. 272-273, Hissa No. 4, Village Wadgaon Sheri, Ramwadi, Pune, Maharashtra 411014' },
        { city: 'HYDERABAD', address: 'Plot No. 34, Survey No. 72, Sy. No. 71/1/A, Kondapur, Hyderabad, Telangana 500084' },
        { city: 'JAIPUR', address: 'Plot No. A-118, Road No. 9, Vishwakarma Industrial Area, Jaipur, Rajasthan 302013' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            },
        },
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <header className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">Contact Us</h1>
                <p className="text-lg mt-4 text-gray-600">
                    We are Available 24x7 @ <a href="tel:+919512341234" className="text-indigo-600 hover:underline">9123457878</a>
                </p>
            </header>

            <motion.div
                className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {locations.map((location, index) => (
                    <motion.div
                        key={index}
                        className="contact-card bg-white rounded-2xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer flex flex-col items-center text-center"
                        variants={itemVariants}
                    >
                        <div className="icon w-16 h-16 text-indigo-500 mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                            <LocationIcon />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{location.city}</h2>
                        <p className="text-gray-500 max-w-xs">{location.address}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default ContactUs;
