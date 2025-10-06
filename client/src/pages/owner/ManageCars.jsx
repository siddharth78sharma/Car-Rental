import React, { useEffect, useState, useCallback } from 'react';
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ManageItems = () => {
    const { isOwner, axios, currency } = useAppContext();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // ⭐ NEW PAGINATION STATES ⭐
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10; // Fixed limit as requested

    // Define the categories for the filter buttons
    const categories = ['All', 'Bike', 'Sedan', 'SUV', 'Gitar', 'House'];
    
    // Convert fetchOwnerItems to a useCallback for better dependency management
    const fetchOwnerItems = useCallback(async (page = 1) => {
        try {
            // Pass the current page and limit to the backend API
            const { data } = await axios.get(`/api/owner/items?page=${page}&limit=${limit}`);

            if (data.success) {
                setItems(data.items);
                // ⭐ UPDATE PAGINATION STATES FROM RESPONSE ⭐
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch items.");
            console.error(error);
        }
    }, [axios, limit]); // axios and limit are stable dependencies

    const deleteItem = async (itemId) => {
        toast.promise(
            axios.post('/api/owner/delete-item', { itemId }),
            {
                loading: 'Deleting item...',
                success: (response) => {
                    // Refresh the items on the current page after deletion
                    fetchOwnerItems(currentPage);
                    return response.data.message;
                },
                error: (error) => error.response?.data?.message || error.message,
            }
        );
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to page 1 on new search
    };
    
    const handleCategoryChange = (category) => {
        setCategoryFilter(category);
        setCurrentPage(1); // Reset to page 1 on new filter
    };
    
    // Function to handle page clicks
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            fetchOwnerItems(page);
        }
    };

    const handleViewClick = (item) => {
         navigate(`/owner/items/view/${item._id}`);
    };

      const handleEditClick = (item) => {
        navigate(`/owner/items/edit/${item._id}`);
    };

    const handleAddItemClick = () => {
        // Corrected the navigation path to match the route in your App.jsx
        navigate('/owner/add-items');
    };

    // Initial data fetch and refetch when category/search changes
    useEffect(() => {
        if (isOwner) {
            // Fetch items when isOwner changes, or when search/category filters change
            // NOTE: We are intentionally NOT using search or category in the API for simplicity here. 
            // If the backend handles search/category, you should pass them here and add them to dependencies.
            // Since the current component filters locally, we only fetch page data.
            fetchOwnerItems(currentPage); 
        }
    }, [isOwner, fetchOwnerItems, currentPage]); // Re-run when page changes

    // ⭐ LOCAL FILTERING LOGIC (Applied to the 10 items fetched) ⭐
    // NOTE: For true scalability, search/filter should be done on the backend.
    const filteredItems = items.filter(item =>
        (categoryFilter === 'All' || item.category === categoryFilter) &&
        (item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.model?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Generate page numbers array for rendering buttons
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className='p-6 md:p-10 bg-gray-50 min-h-screen font-sans'>
            <Title 
                title="Manage Items" 
            />
            
            <div className="w-full max-w-7xl mx-auto mt-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                {/* Search Input and Category Filter remain the same */}
                <input
                    type="text"
                    placeholder="Search for items..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="flex-grow p-4 rounded-xl border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />

                <select
                    value={categoryFilter}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer text-gray-700"
                >
                    {categories.map(category => (
                        // Changed 'Category' to 'All' to match state default
                        <option key={category} value={category === 'Category' ? 'All' : category}> 
                            {category === 'Category' ? 'All' : category}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleAddItemClick}
                    className="w-full md:w-auto px-6 py-4 rounded-xl bg-gray-50 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-colors shadow-lg border border-blue-600"
                >
                    + Add New Item
                </button>
            </div>

            {/* Table Display remains the same, but uses filteredItems */}
            <div className='w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg mt-6 overflow-hidden'>
                <table className='w-full table-auto text-left'>
                    {/* ... Thead remains the same ... */}
                    <thead className='bg-gray-100 text-gray-600 uppercase text-sm font-semibold tracking-wider'>
                        <tr>
                            <th className='p-4'>Items</th>
                            <th className='p-4 hidden md:table-cell'>Category</th>
                            <th className='p-4'>Price</th>
                            <th className='p-4 hidden md:table-cell'>Status</th>
                            <th className='p-4 text-right'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item, index) => (
                                // ... Table row content remains the same ...
                                <tr key={index} className='border-t border-gray-200 hover:bg-blue-50 transition-colors duration-200'>
                                    <td className='p-4 flex items-center gap-4'>
                                        <img src={item.image} alt="" className='h-14 w-14 rounded-lg object-cover shadow-sm'/>
                                        <div>
                                            <p className='font-bold text-gray-900'>{item.brand} {item.model}</p>
                                            <p className='text-xs text-gray-500'>{item.seating_capacity} Seats | {item.transmission}</p>
                                        </div>
                                    </td>
                                    <td className='p-4 text-gray-700 hidden md:table-cell'>{item.category}</td>
                                    <td className='p-4 font-semibold text-gray-900'>{currency}{item.pricePerDay}/day</td>
                                    <td className='p-4 hidden md:table-cell'>
                                        <span className={`px-4 py-2 rounded-full text-xs font-semibold
                                            ${item.isAvaliable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`
                                        }>
                                            {item.isAvaliable ? "Available" : "Unavailable"}
                                        </span>
                                    </td>
                                    <td className='p-4 flex items-center gap-4 justify-end'>
                                        <button onClick={() => handleViewClick(item)} className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                                            <img src={assets.eye_icon} alt="View" className='h-5 w-5' />
                                        </button>
                                        <button onClick={() => handleEditClick(item)} className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                                            <img src={assets.edit_icon} alt="Edit" className='h-5 w-5' />
                                        </button>
                                        <button onClick={() => deleteItem(item._id)} className="text-red-500 hover:text-red-700 transition-colors duration-200">
                                            <img src={assets.delete_icon} alt="Delete" className='h-5 w-5' />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className='p-6 text-center text-gray-500'>No items found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ⭐ NEW PAGINATION CONTROLS ⭐ */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                        Previous
                    </button>

                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors 
                                ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 hover:bg-gray-100 border-gray-300'}`
                            }
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ManageItems;













// import React, { useEffect, useState } from 'react';
// import { assets } from '../../assets/assets';
// import Title from '../../components/owner/Title';
// import { useAppContext } from '../../context/AppContext';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// const ManageItems = () => {
//     const { isOwner, axios, currency } = useAppContext();
//     const navigate = useNavigate();

//     const [items, setItems] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [categoryFilter, setCategoryFilter] = useState('All');

//     // Define the categories for the filter buttons
//     const categories = ['Category', 'Bike', 'Sedan', 'SUV', 'gitar'];

//     const fetchOwnerItems = async () => {
//         try {
//             const { data } = await axios.get('/api/owner/items');
//             if (data.success) {
//                 setItems(data.items);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     };

//     const deleteItem = async (itemId) => {
//         toast.promise(
//             axios.post('/api/owner/delete-item', { itemId }),
//             {
//                 loading: 'Deleting item...',
//                 success: (response) => {
//                     fetchOwnerItems();
//                     return response.data.message;
//                 },
//                 error: (error) => error.response?.data?.message || error.message,
//             }
//         );
//     };

//     const handleSearchChange = (event) => {
//         setSearchQuery(event.target.value);
//     };
    
//     // Function to handle category button clicks
//     const handleCategoryChange = (category) => {
//         setCategoryFilter(category);
//     };

//     const handleViewClick = (item) => {
//         navigate(`/owner/items/view/${item._id}`);
//     };

//     const handleEditClick = (item) => {
//         navigate(`/owner/items/edit/${item._id}`);
//     };

//     const handleAddItemClick = () => {
//         // Corrected the navigation path to match the route in your App.jsx
//         navigate('/owner/add-items');
//     };

//     useEffect(() => {
//         isOwner && fetchOwnerItems();
//     }, [isOwner, axios]);

//     // Filter items based on both the search query and the selected category
//     const filteredItems = items.filter(item =>
//         (categoryFilter === 'All' || item.category === categoryFilter) &&
//         (item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) || 
//         item.model?.toLowerCase().includes(searchQuery.toLowerCase()))
//     );

//     return (
//         <div className='p-6 md:p-10 bg-gray-50 min-h-screen font-sans'>
//             <Title 
//                 title="Manage Items" 
//                 // subTitle="View all listed items, update their details, or remove them from the booking platform."
//             />
            
//             <div className="w-full max-w-7xl mx-auto mt-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
//                 <input
//                     type="text"
//                     placeholder="Search for items..."
//                     value={searchQuery}
//                     onChange={handleSearchChange}
//                     className="flex-grow p-4 rounded-xl border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 />

//                 {/* Replaced category filter buttons with a select dropdown */}
//                 <select
//                     value={categoryFilter}
//                     onChange={(e) => handleCategoryChange(e.target.value)}
//                     className="px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer text-gray-700"
//                 >
//                     {categories.map(category => (
//                         <option key={category} value={category}>
//                             {category}
//                         </option>
//                     ))}
//                 </select>

//                 <button
//                     onClick={handleAddItemClick}
//                     className="w-full md:w-auto px-6 py-4 rounded-xl bg-gray-50 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-colors shadow-lg border border-blue-600"
//                 >
//                     + Add New Item
//                 </button>
//             </div>

//             <div className='w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg mt-6 overflow-hidden'>
//                 <table className='w-full table-auto text-left'>
//                     <thead className='bg-gray-100 text-gray-600 uppercase text-sm font-semibold tracking-wider'>
//                         <tr>
//                             <th className='p-4'>Items</th>
//                             <th className='p-4 hidden md:table-cell'>Category</th>
//                             <th className='p-4'>Price</th>
//                             <th className='p-4 hidden md:table-cell'>Status</th>
//                             <th className='p-4 text-right'>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredItems.length > 0 ? (
//                             filteredItems.map((item, index) => (
//                                 <tr key={index} className='border-t border-gray-200 hover:bg-blue-50 transition-colors duration-200'>
//                                     <td className='p-4 flex items-center gap-4'>
//                                         <img src={item.image} alt="" className='h-14 w-14 rounded-lg object-cover shadow-sm'/>
//                                         <div>
//                                             <p className='font-bold text-gray-900'>{item.brand} {item.model}</p>
//                                             <p className='text-xs text-gray-500'>{item.seating_capacity} Seats | {item.transmission}</p>
//                                         </div>
//                                     </td>
//                                     <td className='p-4 text-gray-700 hidden md:table-cell'>{item.category}</td>
//                                     <td className='p-4 font-semibold text-gray-900'>{currency}{item.pricePerDay}/day</td>
//                                     <td className='p-4 hidden md:table-cell'>
//                                         <span className={`px-4 py-2 rounded-full text-xs font-semibold
//                                             ${item.isAvaliable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`
//                                         }>
//                                             {item.isAvaliable ? "Available" : "Unavailable"}
//                                         </span>
//                                     </td>
//                                     <td className='p-4 flex items-center gap-4 justify-end'>
//                                         {/* Updated the eye icon to be the "View Item" button and removed the old one */}
//                                         <button onClick={() => handleViewClick(item)} className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
//                                             <img src={assets.eye_icon} alt="View" className='h-5 w-5' />
//                                         </button>
//                                         {/* Edit Item button */}
//                                         <button onClick={() => handleEditClick(item)} className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
//                                             <img src={assets.edit_icon} alt="Edit" className='h-5 w-5' />
//                                         </button>
//                                         {/* Delete button */}
//                                         <button onClick={() => deleteItem(item._id)} className="text-red-500 hover:text-red-700 transition-colors duration-200">
//                                             <img src={assets.delete_icon} alt="Delete" className='h-5 w-5' />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="5" className='p-6 text-center text-gray-500'>No items found.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default ManageItems;
