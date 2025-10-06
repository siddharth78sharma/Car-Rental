import React from 'react';
import { motion } from 'motion/react';
import { assets } from '../assets/assets';

const Newsletter = () => {
    return (
        <div className="flex justify-center my-10 mb-40 px-4">
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl p-15 rounded-3xl shadow-2xl bg-gray-200"
            >
                <div className="flex-shrink-0 mb-8 lg:mb-0 lg:mr-25 max-w-xs">
                    <img
                        src={assets.newsletter_img}
                        alt=""
                        className="rounded-lg object-contain w-full h-auto"
                    />
                </div>

                <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="md:text-4xl text-2xl font-semibold tracking-tight leading-tight"
                    >
                        Would you like to receive <span className="block italic text-gray-800 font-bold">special offers by your email?</span>
                    </motion.h1>

                    <motion.form
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row w-full max-w-xl md:h-13 h-12 mt-4"
                    >
                        <div className="relative w-full mb-4 sm:mb-0 sm:mr-2">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <input
                                className="border border-gray-300 rounded-full h-full outline-none w-full pl-10 pr-4 text-gray-500"
                                type="email"
                                placeholder="Enter your mail"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-8 py-3 text-white bg-indigo-900 hover:bg-indigo-800 transition-all cursor-pointer rounded-full font-medium"
                        >
                            Subscribe
                        </button>
                    </motion.form>
                </div>
            </motion.div>
        </div>
    );
};

export default Newsletter;










// import React from 'react'
// import {motion} from 'motion/react'

// const Newsletter = () => {
//   return (
//      <motion.div initial={{y: 30, opacity:0}} whileInView={{ y: 0, opacity: 1}} transition={{ duration: 0.6, ease: "easeOut" }} viewport={{ once: true, amount: 0.3 }} className="flex flex-col items-center justify-center text-center space-y-2 max-md:px-4 my-10 mb-40">
//             <motion.h1 initial={{y: 20, opacity:0}} whileInView={{ y: 0, opacity: 1}} transition={{ duration: 0.5, delay: 0.2 }} className="md:text-4xl text-2xl font-semibold">Never Miss a Deal!</motion.h1>
//             <motion.p initial={{y: 20, opacity:0}} whileInView={{ y: 0, opacity: 1}} transition={{ duration: 0.5, delay: 0.3 }} className="md:text-lg text-gray-500/70 pb-8">
//                 Subscribe to get the latest offers, new arrivals, and exclusive discounts
//             </motion.p>
//             <motion.form initial={{y: 20, opacity:0}} whileInView={{ y: 0, opacity: 1}} transition={{ duration: 0.5, delay: 0.4 }} className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
//                 <input
//                     className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
//                     type="text"
//                     placeholder="Enter your email id"
//                     required
//                 />
//                 <button type="submit" className="md:px-12 px-8 h-full text-white bg-primary-dull hover:bg-indigo-600 transition-all cursor-pointer rounded-md rounded-l-none">
//                     Subscribe
//                 </button>
//             </motion.form>
//         </motion.div>
//   )
// }

// export default Newsletter