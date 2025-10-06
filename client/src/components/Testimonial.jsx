import React, { useState } from 'react'

// Placeholder Component for Title
const Title = ({ title, subTitle }) => (
    <div className='text-center mb-12'>
        <h2 className='text-4xl font-extrabold text-gray-900'>{title}</h2>
        <p className='text-lg text-gray-600 mt-2 max-w-3xl mx-auto'>{subTitle}</p>
    </div>
);


const MotionDiv = ({ children, className, style }) => <div className={className} style={style}>{children}</div>;


const assets = {
    // Adding more mock testimonials to show the sliding feature
    testimonial_image_1: "https://placehold.co/48x48/1d4ed8/ffffff?text=N",
    testimonial_image_2: "https://placehold.co/48x48/059669/ffffff?text=J",
    testimonial_image_3: "https://placehold.co/48x48/9333ea/ffffff?text=R",
    star_icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FBBF24" class="w-5 h-5"><path fill-rule="evenodd" d="M10.788 3.212a.75.75 0 010 1.06l-1.5 1.5a.75.75 0 000 1.06l1.5 1.5a.75.75 0 11-1.06 1.06l-1.5-1.5a.75.75 0 00-1.06 0l-1.5 1.5a.75.75 0 11-1.06-1.06l1.5-1.5a.75.75 0 000-1.06l-1.5-1.5a.75.75 0 011.06-1.06l1.5 1.5a.75.75 0 001.06 0l1.5-1.5a.75.75 0 011.06 0zm-4.75 10.938a7.5 7.5 0 0114.238-5.833 7.5 7.5 0 01-14.238 5.833z" clip-rule="evenodd" /><path d="M12 21a9 9 0 100-18 9 9 0 000 18z" stroke="#FBBF24" stroke-width="1.5" /></svg>',
};



const Testimonial = () => {

    // Extended testimonials to ensure sliding is visible
    const testimonials = [
        { name: "Neha", location: "Noida", image: assets.testimonial_image_1, testimonial: "I've rented cars from various companies, but the experience with Rental Services was exceptional. Highly recommended!" },
        { name: "Jhon Smith", location: "Mumbai", image: assets.testimonial_image_2, testimonial: "Rental Services made my trip so much easier. The villa was very beautiful, and the customer services was fantastic!" },
        { name: "Raghav", location: "Jaipur", image: assets.testimonial_image_3, testimonial: "I highly recommend Rental Services! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service." },
        { name: "Priya Sharma", location: "Delhi", image: assets.testimonial_image_1, testimonial: "Excellent customer support and very smooth booking process. I will definitely use their services again for my next travel." },
        { name: "David Lee", location: "New York", image: assets.testimonial_image_2, testimonial: "Fantastic selection of electronics for rent. The entire process, from reservation to return, was flawless and convenient." },
        { name: "Amira Khan", location: "Dubai", image: assets.testimonial_image_3, testimonial: "The furniture rental service was perfect for my short-term apartment. High quality and great prices." },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Calculate how many items are visible at once (Carousel View Size)
    // We'll design the movement based on 1 item for simplicity, but the view will be responsive.
    const ITEMS_PER_SLIDE = 1; 

    // Determine the maximum possible index to start a slide. 
    // If showing 3 cards (desktop), the last possible starting index is length - 3.
    // Since we are scrolling by 1, the maximum index is simply length - 1 (the last card).
    const maxIndex = testimonials.length - 1;

    const handleNext = () => {
        setCurrentIndex(prev => Math.min(prev + ITEMS_PER_SLIDE, maxIndex));
    };

    const handlePrev = () => {
        setCurrentIndex(prev => Math.max(prev - ITEMS_PER_SLIDE, 0));
    };

    // Calculate the translateX value based on the current index
    // We use a fixed percentage (33.333% for 3 items on large screens, 100% on small)
    // To handle responsiveness, we use the `currentIndex` but let the CSS define the card width.
    const cardWidthPercentage = 100 / 3; // For a 3-column desktop view
    const translateValue = `translateX(-${currentIndex * cardWidthPercentage}%)`;
    
    // SVG Icons for the Navigation Arrows
    const ArrowIcon = ({ direction, disabled, onClick }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`absolute top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-xl border border-gray-200 transition-all duration-300
                        hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed
                        ${direction === 'left' ? 'left-4' : 'right-4'} hidden md:block`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {direction === 'left' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                )}
            </svg>
        </button>
    );

    return (
        <div className="py-20 bg-gray-50">
            <div className="px-6 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
                <Title 
                    title="What Our Customers Say" 
                    subTitle="Discover why discerning travelers choose our services for luxury accommodations and premium rentals worldwide."
                />

                {/* CAROUSEL CONTAINER (Relative for Arrow Positioning) */}
                <div className="relative mt-12">
                    
                    {/* Testimonial Track Wrapper (Hides overflow) */}
                    <div className="overflow-hidden">
                        
                        {/* Testimonial Track (This slides) */}
                        <MotionDiv 
                            style={{ transform: translateValue }}
                            className="flex transition-transform duration-700 ease-in-out"
                        >
                            {testimonials.map((testimonial, index) => (
                                // Each testimonial item must define its responsive width
                                <div 
                                    key={index} 
                                    // Base width: full width on mobile
                                    // sm: half width on small screen
                                    // lg: third width on large screen
                                    className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-4"
                                >
                                    <MotionDiv 
                                        className="bg-white h-full p-8 rounded-2xl shadow-xl border border-gray-100 transform hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center gap-4">
                                                <img className="w-14 h-14 rounded-full object-cover" src={testimonial.image} alt={testimonial.name} />
                                                <div>
                                                    <p className="text-xl font-semibold text-gray-900">{testimonial.name}</p>
                                                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-1 mt-4">
                                                {/* Rendering 5 stars */}
                                                {Array(5).fill(0).map((_, starIndex) => (
                                                    <img key={starIndex} src={assets.star_icon} alt="star-icon" className="w-5 h-5"/>
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mt-6 text-base italic leading-relaxed">"{testimonial.testimonial}"</p>
                                    </MotionDiv>
                                </div>
                            ))}
                        </MotionDiv>
                    </div>

                    {/* Left Arrow */}
                    <ArrowIcon 
                        direction="left"
                        onClick={handlePrev} 
                        disabled={currentIndex === 0} 
                    />

                    {/* Right Arrow */}
                    <ArrowIcon 
                        direction="right"
                        onClick={handleNext} 
                        // Disable when the last visible item is the last testimonial card
                        disabled={currentIndex >= testimonials.length - ITEMS_PER_SLIDE} 
                    />

                    {/* Simple Pagination Dots (Visible on Mobile) */}
                    <div className="flex justify-center gap-2 mt-8 md:hidden">
                        {testimonials.map((_, index) => (
                            <div
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 w-2 rounded-full cursor-pointer transition-colors ${
                                    index === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'
                                }`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Testimonial














// import React from 'react'
// import Title from './Title'
// import { assets } from '../assets/assets';
// import {motion} from 'motion/react'

// const Testimonial = () => {

//          const testimonials = [
//         { name: "Neha", location: "Noida", image: assets.testimonial_image_1, testimonial: "I've rented cars from varios compines, but the experience with Rental Services was exception." },
//        { name: "Jhon Smith", location: "Mumbai", image: assets.testimonial_image_2, testimonial: "Rental Services made my trip so much easier. the Vila was very beautyful, and the coustomer services was fantastic!" },
//         { name: "Raghav", location: "Jaipur", image: assets.testimonial_image_1, testimonial: "I highly recommed Rental Services! Their fleet is amazing, and i always feel like i'm getting the best deal with excellent sevice." }
//     ];

//   return (
//    <div className="py-28 px-16 lg:px-24 xl:px-44">

//     <Title title="What Our Customer Say" subTitle="Discover why discerning travelers choose StayVenture for their luxery accommodation around the world."/>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-18">
//                 {testimonials.map((testimonial, index) => (
//                     <motion.div initial={{y: 40, opacity:0}} whileInView={{ y: 0, opacity: 1}} transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }} viewport={{ once: true, amount: 0.3 }} key={index} className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500">
//                         <div className="flex items-center gap-3">
//                             <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
//                             <div>
//                                 <p className=" text-xl">{testimonial.name}</p>
//                                 <p className="text-gray-500">{testimonial.location}</p>
//                             </div>
//                         </div>
//                         <div className="flex items-center gap-1 mt-4">
//                             {Array(5).fill(0).map((_, index) => (
//                                 <img key={index} src={assets.star_icon} alt="star-icon"/>
                                
//                             ))}
//                         </div>
//                         <p className="text-gray-500 max-w-90 mt-4 font-light">"{testimonial.testimonial}"</p>
//                     </motion.div>
//                 ))}
//             </div>
//         </div>
//   )
// }

// export default Testimonial