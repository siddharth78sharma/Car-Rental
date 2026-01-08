import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import CarCard from '../components/CarCard';
import {motion} from 'framer-motion' // Using framer-motion (standard library)

const CarDetails = () => {
    const { id } = useParams();
    // Destructure everything you need from context
    const { items, axios, pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext(); 
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [relatedItems, setRelatedItems] = useState([]);
    const currency = import.meta.env.VITE_CURRENCY;

    const RECOMMENDED_COUNT = 4;

    // ⭐ CRITICAL CHANGE: Redirect to BookingDetails page
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 1. Basic Validation
        if (!pickupDate || !returnDate) {
            toast.error("Please select both pickup and return dates.");
            return;
        }

        // 2. Navigate to the new booking confirmation page
        // Pass item ID via URL params and dates via location state
        navigate(`/booking-details/${id}`, {
            state: {
                pickupDate: pickupDate,
                returnDate: returnDate,
                // Optionally pass item price and name to display immediately
                pricePerDay: car.pricePerDay,
                name: car.name,
            }
        });
    };

    useEffect(() => {
        if (items && items.length > 0) {
            const currentItem = items.find((item) => item._id === id);
            setCar(currentItem);

            if (currentItem) {
                // Step 1: Find items with the same type and brand
                let recommended = items.filter(
                    (item) =>
                        item._id !== currentItem._id &&
                        item.type === currentItem.type &&
                        item.brand === currentItem.brand
                );

                // Step 2: If we have fewer than RECOMMENDED_COUNT, broaden to all items of the same type
                if (recommended.length < RECOMMENDED_COUNT) {
                    const typeItems = items.filter(
                        (item) =>
                            item._id !== currentItem._id &&
                            item.type === currentItem.type
                    );
                    // Use a Set to ensure unique items after merging
                    const uniqueItems = [...new Set([...recommended, ...typeItems])];
                    recommended = uniqueItems;
                }

                // Step 3: If we still don't have enough, fill with other items
                if (recommended.length < RECOMMENDED_COUNT) {
                    const otherItems = items.filter(
                        (item) => item._id !== currentItem._id
                    );
                    
                    let finalItems = [...recommended];
                    let i = 0;
                    while (finalItems.length < RECOMMENDED_COUNT && i < otherItems.length) {
                        // Check if the item is already in the list before pushing
                        if (!finalItems.some(recItem => recItem._id === otherItems[i]._id)) {
                             finalItems.push(otherItems[i]);
                        }
                       i++;
                    }
                    setRelatedItems(finalItems);
                } else {
                    // Truncate to the recommended count if we gathered more than needed in step 1/2
                    setRelatedItems(recommended.slice(0, RECOMMENDED_COUNT));
                }
            }
        }
    }, [items, id]);

    // Helper function to get details based on item type (unchanged)
    const getItemDetails = (item) => {
        switch (item.type) {
            case 'Car':
                return [
                    { icon: assets.users_icon, text: item.seating_capacity ? `${item.seating_capacity} Seats` : '' },
                    { icon: assets.fuel_icon, text: item.fuel_type || '' },
                    { icon: assets.car_icon, text: item.transmission || '' },
                    { icon: assets.location_icon, text: item.location || '' },
                ];
            case 'Bike':
                return [
                    { icon: assets.fuel_icon, text: item.fuel_type || '' },
                    { icon: assets.users_icon, text: item.seating_capacity ? `${item.seating_capacity} Seats` : '' },
                    { icon: assets.location_icon, text: item.location || '' },
                ];
            case 'House':
                return [
                    { icon: assets.rooms_icon, text: item.rooms ? `${item.rooms} Rooms` : '' },
                    { icon: assets.build_icon, text: item.year ? `Built in ${item.year}` : '' },
                    { icon: assets.location_icon, text: item.location || '' },
                ];
            case 'Furniture':
                return [
                    { icon: assets.furniture_icon, text: item.category || '' },
                    { icon: assets.location_icon, text: item.location || '' },
                ];
            case 'Electronics':
                return [
                    { icon: assets.electronics_icon, text: item.category || '' },
                    { icon: assets.location_icon, text: item.location || '' },
                ];
            case 'Instruments':
                return [
                    { icon: assets.instrument_icon, text: item.category || '' },
                    { icon: assets.location_icon, text: item.location || '' },
                ];
            default:
                return [];
        }
    };

    const detailsToDisplay = car ? getItemDetails(car) : [];
    const filteredDetails = detailsToDisplay.filter(detail => detail.text);

    return car ? (
        <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 pt-15'>
            <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
                <img src={assets.arrow_icon} alt='' className='rotate-180 opacity-65' />
                Back to all services
            </button>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
                {/* Left: item image & details (Content remains the same) */}
                <motion.div initial={{y: 30, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.6}} className='lg:col-span-2'>
                    
                    <motion.img initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{duration: 0.5}} src={car.image} alt='' className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md' />
                    
                    <motion.div className='space-y-6' initial={{ opacity: 0}} animate={{ opacity: 1}} transition={{duration: 0.3, delay: 0.2 }}>
                        <div>
                            <h1 className='text-3xl font-bold'>
                                {car.name || (car.brand && car.model ? `${car.brand} ${car.model}` : car.brand) || ''}
                            </h1>
                            <p className='text-gray-500 text-lg'>
                                {car.location || ''} {car.year ? ` . ${car.year}` : ''}
                            </p>
                        </div>
                        <hr className='border-borderColor my-6' />

                        {filteredDetails.length > 0 && (
                            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                                {filteredDetails.map(({ icon, text }) => (
                                    <motion.div initial={{y: 10, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.4}} key={text} className='flex-col items-center bg-light p-4 rounded-lg'>
                                        <img src={icon} alt='' className='h-5 mb-2' />
                                        {text}
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        <div>
                            <h1 className='text-xl font-medium mb-3'>Description</h1>
                            <p className='text-gray-500'>{car.description}</p>
                        </div>

                        {car.features && (
                            <div>
                                <h1 className='text-xl font-medium mb-3'>Features</h1>
                                <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                                    {car.features.map((feature) => (
                                        <li key={feature} className='flex items-center text-gray-500'>
                                            <img src={assets.check_icon} className='h-4 mr-2' alt='' />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                </motion.div>

                {/* Right: Booking Form (Form content remains the same) */}
                <motion.form 
                    initial={{y: 30, opacity: 0}} 
                    animate={{y: 0, opacity: 1}} 
                    transition={{duration: 0.6, delay: 0.3 }} 
                    onSubmit={handleSubmit} // This now redirects!
                    className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'
                >
                    <p className='flex items-center justify-between text-2xl text-gary-800 font-semibold'>
                        {currency}
                        {car.pricePerDay}
                        <span className='text-base text-gray-400 font-normal'>per day</span>
                    </p>

                    <hr className='border-borderColor my-6' />

                    <div className='flex flex-col gap-2'>
                        <label htmlFor='pickup-date'>Pickup Date</label>
                        <input
                            value={pickupDate || ''}
                            onChange={(e) => setPickupDate(e.target.value)}
                            type='date'
                            className='border border-borderColor px-3 py-2 rounded-lg'
                            required
                            id='pickup-date'
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor='return-date'>Return Date</label>
                        <input
                            value={returnDate || ''}
                            onChange={(e) => setReturnDate(e.target.value)}
                            type='date'
                            className='border border-borderColor px-3 py-2 rounded-lg'
                            required
                            id='return-date'
                        />
                    </div>

                    <button 
                        type="submit" // Ensure button is type="submit"
                        className='w-full bg-primary hover:bg-primary-dull trasition-all py-3 font-medium text-white rounded-xl cursor-pointer'
                    >
                        Proceed to Booking
                    </button>

                    <p className='text-center text-sm'>NO credit card is required to reserve</p>
                </motion.form>
            </div>
            
            {/* Related Items Section (Unchanged) */}
            {relatedItems.length > 0 && (
                <div className='my-16'>
                    <h2 className='text-2xl font-bold mb-6 text-center md:text-left'>You might also like...</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
                        {relatedItems.map(item => (
                            <CarCard key={item._id} item={item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    ) : (
        <Loader />
    );
};

export default CarDetails;















// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { assets } from '../assets/assets';
// import Loader from '../components/Loader';
// import { useAppContext } from '../context/AppContext';
// import toast from 'react-hot-toast';
// import CarCard from '../components/CarCard';
// import {motion} from 'motion/react'

// const CarDetails = () => {
//     const { id } = useParams();
//     const { items, axios, pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext();
//     const navigate = useNavigate();
//     const [car, setCar] = useState(null);
//     const [relatedItems, setRelatedItems] = useState([]);
//     const currency = import.meta.env.VITE_CURRENCY;

//     const RECOMMENDED_COUNT = 4; // Adjust this number as needed

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const { data } = await axios.post('/api/bookings/create', {
//                 car: id,
//                 pickupDate,
//                 returnDate,
//             });

//             if (data.success) {
//                 toast.success(data.message);
//                 navigate('/my-bookings');
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     };

//     useEffect(() => {
//         if (items && items.length > 0) {
//             const currentItem = items.find((item) => item._id === id);
//             setCar(currentItem);

//             if (currentItem) {
//                 // Step 1: Find items with the same type and brand
//                 let recommended = items.filter(
//                     (item) =>
//                         item._id !== currentItem._id &&
//                         item.type === currentItem.type &&
//                         item.brand === currentItem.brand
//                 );

//                 // Step 2: If we have fewer than RECOMMENDED_COUNT, broaden to all items of the same type
//                 if (recommended.length < RECOMMENDED_COUNT) {
//                     const typeItems = items.filter(
//                         (item) =>
//                             item._id !== currentItem._id &&
//                             item.type === currentItem.type
//                     );
//                     recommended = [...new Set([...recommended, ...typeItems])];
//                 }

//                 // Step 3: If we still don't have enough, fill with other items
//                 if (recommended.length < RECOMMENDED_COUNT) {
//                     const otherItems = items.filter(
//                         (item) => item._id !== currentItem._id
//                     );
                    
//                     // Add other items until the count is reached or no more items are left
//                     let finalItems = [...recommended];
//                     let i = 0;
//                     while (finalItems.length < RECOMMENDED_COUNT && i < otherItems.length) {
//                         if (!finalItems.some(recItem => recItem._id === otherItems[i]._id)) {
//                              finalItems.push(otherItems[i]);
//                         }
//                        i++;
//                     }
//                     setRelatedItems(finalItems);
//                 } else {
//                     setRelatedItems(recommended);
//                 }
//             }
//         }
//     }, [items, id]);

//     // Helper function to get details based on item type
//     const getItemDetails = (item) => {
//         switch (item.type) {
//             case 'Car':
//                 return [
//                     { icon: assets.users_icon, text: item.seating_capacity ? `${item.seating_capacity} Seats` : '' },
//                     { icon: assets.fuel_icon, text: item.fuel_type || '' },
//                     { icon: assets.car_icon, text: item.transmission || '' },
//                     { icon: assets.location_icon, text: item.location || '' },
//                 ];
//             case 'Bike':
//                 return [
//                     { icon: assets.fuel_icon, text: item.fuel_type || '' },
//                     { icon: assets.users_icon, text: item.seating_capacity ? `${item.seating_capacity} Seats` : '' },
//                     { icon: assets.location_icon, text: item.location || '' },
//                 ];
//             case 'House':
//                 return [
//                     { icon: assets.rooms_icon, text: item.rooms ? `${item.rooms} Rooms` : '' },
//                     { icon: assets.build_icon, text: item.year ? `Built in ${item.year}` : '' },
//                     { icon: assets.location_icon, text: item.location || '' },
//                 ];
//             case 'Furniture':
//                 return [
//                     { icon: assets.furniture_icon, text: item.category || '' },
//                    // { icon: assets.build_icon, text: item.features || '' },
//                     { icon: assets.location_icon, text: item.location || '' },
//                 ];
//             case 'Electronics':
//                 return [
//                     { icon: assets.electronics_icon, text: item.category || '' },
//                     //{ icon: assets.build_icon, text: item.features || '' },
//                     { icon: assets.location_icon, text: item.location || '' },
//                 ];
//             case 'Instruments':
//                 return [
//                     { icon: assets.instrument_icon, text: item.category || '' },
//                     //{ icon: assets.build_icon, text: item.features || '' },
//                     { icon: assets.location_icon, text: item.location || '' },
//                 ];
//             default:
//                 return [];
//         }
//     };

//     const detailsToDisplay = car ? getItemDetails(car) : [];
//     const filteredDetails = detailsToDisplay.filter(detail => detail.text);

//     return car ? (
//         <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
//             <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
//                 <img src={assets.arrow_icon} alt='' className='rotate-180 opacity-65' />
//                 Back to all services
//             </button>

//             <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
//                 {/* Left: item image & details */}
//                 <motion.div initial={{y: 30, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.6}} className='lg:col-span-2'>
                    
//                     <motion.img initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{duration: 0.5}} src={car.image} alt='' className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md' />
                    
//                     <motion.div className='space-y-6' initial={{ opacity: 0}} animate={{ opacity: 1}} transition={{duration: 0., delay: 0.2 }}>
//                         <div>
//                             <h1 className='text-3xl font-bold'>
//                                 {car.name || (car.brand && car.model ? `${car.brand} ${car.model}` : car.brand) || ''}
//                             </h1>
//                             <p className='text-gray-500 text-lg'>
//                                 {car.location || ''} {car.year ? ` . ${car.year}` : ''}
//                             </p>
//                         </div>
//                         <hr className='border-borderColor my-6' />

//                         {filteredDetails.length > 0 && (
//                             <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
//                                 {filteredDetails.map(({ icon, text }) => (
//                                     <motion.div initial={{y: 10, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.4}} key={text} className='flex-col items-center bg-light p-4 rounded-lg'>
//                                         <img src={icon} alt='' className='h-5 mb-2' />
//                                         {text}
//                                     </motion.div>
//                                 ))}
//                             </div>
//                         )}

//                         <div>
//                             <h1 className='text-xl font-medium mb-3'>Description</h1>
//                             <p className='text-gray-500'>{car.description}</p>
//                         </div>

//                         {car.features && (
//                             <div>
//                                 <h1 className='text-xl font-medium mb-3'>Features</h1>
//                                 <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
//                                     {car.features.map((feature) => (
//                                         <li key={feature} className='flex items-center text-gray-500'>
//                                             <img src={assets.check_icon} className='h-4 mr-2' alt='' />
//                                             {feature}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         )}
//                     </motion.div>
//                 </motion.div>

//                 {/* Right: Booking Form */}
//                 <motion.form initial={{y: 30, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.6, delay: 0.3 }} onSubmit={handleSubmit} className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'>
//                     <p className='flex items-center justify-between text-2xl text-gary-800 font-semibold'>
//                         {currency}
//                         {car.pricePerDay}
//                         <span className='text-base text-gray-400 font-normal'>per day</span>
//                     </p>

//                     <hr className='border-borderColor my-6' />

//                     <div className='flex flex-col gap-2'>
//                         <label htmlFor='pickup-date'>Pickup Date</label>
//                         <input
//                             value={pickupDate || ''}
//                             onChange={(e) => setPickupDate(e.target.value)}
//                             type='date'
//                             className='border border-borderColor px-3 py-2 rounded-lg'
//                             required
//                             id='pickup-date'
//                             min={new Date().toISOString().split('T')[0]}
//                         />
//                     </div>

//                     <div className='flex flex-col gap-2'>
//                         <label htmlFor='return-date'>Return Date</label>
//                         <input
//                             value={returnDate || ''}
//                             onChange={(e) => setReturnDate(e.target.value)}
//                             type='date'
//                             className='border border-borderColor px-3 py-2 rounded-lg'
//                             required
//                             id='return-date'
//                         />
//                     </div>

//                     <button className='w-full bg-primary hover:bg-primary-dull trasition-all py-3 font-medium text-white rounded-xl cursor-pointer'>
//                         Book Now
//                     </button>

//                     <p className='text-center text-sm'>NO credit card is required to reserve</p>
//                 </motion.form>
//             </div>
            
//             {/* Related Items Section */}
//             {relatedItems.length > 0 && (
//                 <div className='my-16'>
//                     <h2 className='text-2xl font-bold mb-6 text-center md:text-left'>You might also like...</h2>
//                     <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
//                         {relatedItems.map(item => (
//                             <CarCard key={item._id} item={item} />
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     ) : (
//         <Loader />
//     );
// };

// export default CarDetails;