import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import {motion} from 'motion/react'

// Constants for Pagination and Service Types
const ITEMS_PER_PAGE = 15;
const CATEGORIES = ['All', 'Cars', 'Bikes', 'Villa', 'Furniture', 'Electronics', 'Instruments']; // Renamed in UI as Service Types

const Cars = () => {

    // getting search params from url
    const [searchParams, setSearchParams] = useSearchParams()
    const pickupLocation = searchParams.get('pickupLocation')
    const urlCategory = searchParams.get('category') // Read category from URL
    
    // Get 'items' from context
    const { items } = useAppContext()

    const [input, setInput] = useState('')
    const [filteredItems, setFilteredItems] = useState([])
    // Initialize selectedCategory from the URL or default to 'All'
    const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'All'); 
    const [currentPage, setCurrentPage] = useState(1); 

    // Sync state with URL parameter on mount/URL change
    useEffect(() => {
        // Ensure the category in state matches the category in the URL, 
        // using 'All' if the URL parameter is missing or invalid.
        const currentUrlCategory = urlCategory && CATEGORIES.map(c => c.toLowerCase()).includes(urlCategory.toLowerCase())
            ? urlCategory 
            : 'All';
            
        setSelectedCategory(currentUrlCategory);
    }, [urlCategory]);

    // Function to handle category change and update URL
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Always reset page on filter change
        
        // Update URL search parameters
        const newSearchParams = new URLSearchParams(searchParams);
        if (category === 'All') {
            newSearchParams.delete('category');
        } else {
            newSearchParams.set('category', category);
        }
        setSearchParams(newSearchParams, { replace: true });
    };

    // A single function to apply all filters
    const applyFilter = () => {
        if (!items) return;

        let tempItems = [...items];
        const currentCategory = selectedCategory;

        // 1. Filter by location from the home page search bar (URL)
        if (pickupLocation) {
            tempItems = tempItems.filter(item => 
                item.location && item.location.toLowerCase().includes(pickupLocation.toLowerCase())
            );
        }

        // 2. Filter by Service Type (ENHANCED LOGIC: Check item.category OR item.type)
        if (currentCategory !== 'All') {
            const selectedLower = currentCategory.toLowerCase();
            tempItems = tempItems.filter(item => 
                // Check if the selected button matches EITHER item.category OR item.type
                (item.category && item.category.toLowerCase() === selectedLower) ||
                (item.type && item.type.toLowerCase() === selectedLower)
            );
        }

        // 3. Filter by text input from the services page search bar
        if (input !== '') {
            const searchLower = input.toLowerCase();
            tempItems = tempItems.filter((item) => {
                const name = item.name ? item.name.toLowerCase() : '';
                const brand = item.brand ? item.brand.toLowerCase() : '';
                const model = item.model ? item.model.toLowerCase() : '';
                const type = item.type ? item.type.toLowerCase() : '';
                const category = item.category ? item.category.toLowerCase() : '';

                return name.includes(searchLower)
                    || brand.includes(searchLower)
                    || model.includes(searchLower)
                    || category.includes(searchLower)
                    || type.includes(searchLower);
            });
        }
        
        setFilteredItems(tempItems);
    }

    // This useEffect hook runs whenever the items or the search criteria change
    useEffect(() => {
        applyFilter();
        // Reset to the first page whenever filters (input, location, or category) change
        setCurrentPage(1);
    }, [input, items, pickupLocation, selectedCategory]);


    // Pagination Calculations
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const displayedItems = filteredItems.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // Optionally scroll to the top of the service list when changing pages
            window.scrollTo({ top: 400, behavior: 'smooth' }); 
        }
    };
    
    // Helper function to render page numbers dynamically
    const renderPageNumbers = () => {
        const pageNumbers = [];
        // Determine which page numbers to show (e.g., up to 5 surrounding pages)
        const maxVisiblePages = 5; 
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 mx-1 rounded-lg transition-all text-sm font-semibold 
                        ${i === currentPage
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };


    return (
        <div>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className='flex flex-col items-center py-20 bg-light max-md:px-4'>
                <Title title='Available Services' subTitle='Browse our selection of premium services available for your next adventure'/>
            
                {/* Search Input */}
                <motion.div initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.5, delay: 0.3 }} className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
                    <img src={assets.search_icon} alt="Search" className='w-4.5 h-4.5 mr-2'/>
                    <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Search by name, brand, model, type, or service type' className='w-full h-full outline-none text-gray-500'/>
                </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{duration: 0.5, delay: 0.6 }} className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
                <div className='max-w-7xl mx-auto'>
                    
                    {/* Service Type Filter Buttons */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8 p-4 bg-gray-50 rounded-xl shadow-inner">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)} // Now uses handleCategoryChange which updates URL
                                className={`
                                    px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out
                                    ${selectedCategory.toLowerCase() === category.toLowerCase()
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                                    }
                                `}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Service Count (Updated text) */}
                    <p className='text-gray-500 mb-4 xl:px-20'>
                        Showing {displayedItems.length} of {filteredItems.length} Services 
                        {selectedCategory !== 'All' && <span className='font-semibold text-gray-600'> ({selectedCategory} Service Type)</span>}
                    </p>

                    {/* Service Cards Container */}
                    {displayedItems.length > 0 ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20'>
                            {displayedItems.map((item, index) => (
                                <motion.div key={item.id || index} initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.4, delay: index * 0.05}}>
                                    <CarCard item={item}/>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-10 text-xl text-gray-500 border border-dashed border-gray-300 rounded-xl mx-20'>
                            No services found matching the selected criteria.
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-12 mb-8 space-x-2">
                            {/* Previous Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-3 bg-white text-blue-600 rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            
                            {/* Page Numbers */}
                            {renderPageNumbers()}

                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-3 bg-white text-blue-600 rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default Cars
















// import React, { useEffect, useState } from 'react'
// import Title from '../components/Title'
// import { assets } from '../assets/assets'
// import CarCard from '../components/CarCard'
// import { useSearchParams } from 'react-router-dom'
// import { useAppContext } from '../context/AppContext'
// import {motion} from 'motion/react'

// const Cars = () => {

//     // getting search params from url
//     const [searchParams] = useSearchParams()
//     const pickupLocation = searchParams.get('pickupLocation')
    
//     // Get 'items' from context
//     const { items } = useAppContext()

//     const [input, setInput] = useState('')
//     const [filteredItems, setFilteredItems] = useState([])

//     // A single function to apply all filters
//     const applyFilter = () => {
//         if (!items) return;

//         let tempItems = [...items];

//         // 1. Filter by location from the home page search bar (URL)
//         if (pickupLocation) {
//             tempItems = tempItems.filter(item => 
//                 item.location && item.location.toLowerCase().includes(pickupLocation.toLowerCase())
//             );
//         }

//         // 2. Filter by text input from the services page search bar
//         if (input !== '') {
//             tempItems = tempItems.filter((item) => {
//                 const name = item.name ? item.name.toLowerCase() : '';
//                 const brand = item.brand ? item.brand.toLowerCase() : '';
//                 const model = item.model ? item.model.toLowerCase() : '';
//                 const type = item.type ? item.type.toLowerCase() : '';
//                 const category = item.category ? item.category.toLowerCase() : '';

//                 return name.includes(input.toLowerCase())
//                     || brand.includes(input.toLowerCase())
//                     || model.includes(input.toLowerCase())
//                     || category.includes(input.toLowerCase())
//                     || type.includes(input.toLowerCase());
//             });
//         }
        
//         setFilteredItems(tempItems);
//     }

   
//     // This useEffect hook runs whenever the items or the search criteria change
//     useEffect(() => {
//         applyFilter();
//     }, [input, items, pickupLocation]);

//     return (
//         <div>
//             <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className='flex flex-col items-center py-20 bg-light max-md:px-4'>
//                 <Title title='Available Services' subTitle='Browse our selection of premium services available for your next adventure'/>
            
//                 <motion.div initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.5, delay: 0.3 }} className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
//                     <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2'/>
                    
//                     <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Search by make, type, feature' className='w-full h-full outline-none text-gray-500'/>
//                 </motion.div>
//             </motion.div>

//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{duration: 0.5, delay: 0.6 }} className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
//                 <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>Showing {filteredItems.length} Services</p>
                
//                 {filteredItems.length > 0 ? (
//                     <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
//                         {filteredItems.map((item, index) => (
//                             <motion.div key={index} initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.4, delay: index * 0.1}}>
//                                 <CarCard item={item}/>
//                             </motion.div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className='text-center text-gray-500'>
//                         No services found for your search criteria.
//                     </div>
//                 )}
//             </motion.div>
//         </div>
//     )
// }

// export default Cars















// import React, { useEffect, useState } from 'react'
// import Title from '../components/Title'
// import { assets } from '../assets/assets'
// import CarCard from '../components/CarCard'
// import { useSearchParams } from 'react-router-dom'
// import { useAppContext } from '../context/AppContext'

// const Cars = () => {

//   // getting search params from url
//   const [searchParams] = useSearchParams()
//   const pickupLocation = searchParams.get('pickupLocation')
//   const pickupDate = searchParams.get('pickupDate')
//   const returnDate = searchParams.get('returnDate')

//   // FIX: Get 'items' from context instead of 'cars'
//   const { items, axios } = useAppContext()

//   const [input, setInput] = useState('')

//   const isSearchData = pickupLocation && pickupDate && returnDate
//   const [filteredItems, setFilteredItems] = useState([]) // FIX: Use 'filteredItems' state

//   const applyFilter = async ()=>{
//     // FIX: Check if items array is available
//     if(!items) return;

//     if(input === ''){
//       setFilteredItems(items) // FIX: Set state to 'filteredItems'
//       return null
//     }

//     // FIX: Filter the 'items' array
//     const filtered = items.slice().filter((item)=>{
//       return item.brand.toLowerCase().includes(input.toLowerCase())
//       || item.model.toLowerCase().includes(input.toLowerCase())
//       || item.category.toLowerCase().includes(input.toLowerCase())
//       || item.type.toLowerCase().includes(input.toLowerCase())
//     })
//     setFilteredItems(filtered) // FIX: Set state to 'filteredItems'
//   }

//   const searchCarAvailability = async () =>{
//     const {data} = await axios.post('/api/bookings/check-availability',{location: pickupLocation, pickupDate, returnDate})
//     if (data.success) {
//       setFilteredItems(data.availableCars) // FIX: Set state to 'filteredItems'
//       if(data.availableCars.length === 0){
//         toast('No cars available')
//       }
//       return null
//     }
//   }

//   useEffect(()=>{
//     isSearchData && searchCarAvailability()
//   },[isSearchData, pickupLocation, pickupDate, returnDate])

//   useEffect(()=>{
//     // FIX: Use 'items' and set 'filteredItems' initially
//     if(items && !isSearchData){
//       applyFilter()
//     }
//   },[input, items])


//   return (
//     <div>
//         <div className='flex flex-col items-center py-20 bg-light max-md:px-4'>
//           <Title title='Available Services' subTitle='Browse our selection of premium services available for your next adventure'/>
//         
//         <div className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
//           <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2'/>
//           
//           <input onChange={(e)=> setInput(e.target.value)} value={input} type="text" placeholder='Search by make, type, feature' className='w-full h-full outline-none text-gray-500'/>
//           
//           <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2'/>
//          </div>
//         </div>

//         <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
//            {/* FIX: Show the count of filtered items */}
//            <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>Showing {filteredItems.length} Services</p>

//            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
//                 {/* FIX: Map over 'filteredItems' */}
//                 {filteredItems.map((item, index)=>(
//                   <div key={index}>
//                     <CarCard item={item}/>
//                   </div>
//                 ))}
//            </div>
//         </div>

//     </div>
//   )
// }

// export default Cars
