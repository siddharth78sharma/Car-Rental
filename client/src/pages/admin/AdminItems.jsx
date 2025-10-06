import React, { useState, useEffect, useCallback } from 'react'; 
import { useAppContext } from '../../context/AppContext'; 
import { BiPencil, BiTrash } from "react-icons/bi"; 
import { Link } from 'react-router-dom'; 
import toast from 'react-hot-toast'; 
import { assets } from '../../assets/assets';  

// Define sample categories. You should ideally fetch this list from your backend. 
const CATEGORIES = [ 
    'Bike',  
    'House',  
    'Villa',  
    'Sofa',  
    'Sedan',  
    'Gitar',  
    'Other' 
]; 

const AdminItems = () => { 
    // ⭐ DESTUCTURE NEW CONTEXT VARIABLES ⭐ 
    const {  
        currency,  
        items,  
        axios,  
        fetchAdminItems,  
        adminCurrentPage,  
        setAdminCurrentPage,  
        adminTotalPages,  
        adminLimit  
    } = useAppContext(); 
    
    // ⭐ NEW STATE FOR SORTING AND FILTERING ⭐ 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [sortOrder, setSortOrder] = useState(''); // '' | 'price_asc' | 'price_desc' 
    const [selectedCategory, setSelectedCategory] = useState(''); // '' for all categories 

    // Wrap the fetch call in useCallback to stabilize the useEffect dependency 
    // Updated to include sortOrder and selectedCategory 
    const loadAdminItems = useCallback((page, search, sort, category) => { 
        // This function calls the context function with all parameters
        fetchAdminItems(page, search, sort, category);  
    }, [fetchAdminItems]); 

    // ⭐ useEffect to fetch data based on current page, search, sort, and category ⭐ 
    useEffect(() => { 
        // Triggers fetch whenever filters, sort, or page changes
        loadAdminItems(adminCurrentPage, searchTerm, sortOrder, selectedCategory);  
    }, [adminCurrentPage, searchTerm, sortOrder, selectedCategory, loadAdminItems]);  
    
    /** * Helper function to reset to page 1 if a filter or search changes,  
     * but only if we aren't already on page 1. 
     */ 
    const resetPageIfNecessary = (newSearchTerm = searchTerm, newSortOrder = sortOrder, newCategory = selectedCategory) => { 
        if (adminCurrentPage !== 1) { 
            setAdminCurrentPage(1); 
        } else { 
            // Manually trigger the load since currentPage didn't change 
            loadAdminItems(1, newSearchTerm, newSortOrder, newCategory); 
        } 
    }; 

    // Handler for page button clicks 
    const handlePageChange = (page) => { 
        if (page >= 1 && page <= adminTotalPages) { 
            // Always pass the current filters/sorts when changing pages 
            loadAdminItems(page, searchTerm, sortOrder, selectedCategory);  
        } 
    }; 
    
    // Handler for search input change 
    const handleSearchChange = (e) => { 
        const newSearchTerm = e.target.value; 
        setSearchTerm(newSearchTerm); 
        resetPageIfNecessary(newSearchTerm, sortOrder, selectedCategory); 
    }; 

    // ⭐ NEW HANDLER for Price Sorting ⭐ 
    const handleSortChange = (e) => { 
        const newSortOrder = e.target.value; 
        setSortOrder(newSortOrder); 
        resetPageIfNecessary(searchTerm, newSortOrder, selectedCategory); 
    }; 

    // ⭐ NEW HANDLER for Category Filtering ⭐ 
    const handleCategoryChange = (e) => { 
        const newCategory = e.target.value; 
        setSelectedCategory(newCategory); 
        // This is where the filter is applied and page reset is checked
        resetPageIfNecessary(searchTerm, sortOrder, newCategory); 
    }; 
    
    const handleDeleteItem = async (itemId) => { 
        if (window.confirm("Are you sure you want to delete this item?")) {  
            try { 
                const response = await axios.delete(`/api/user/admin/items/${itemId}`); 
                if (response.data.success) { 
                    toast.success("Item deleted successfully."); 
                    // Re-fetch the current page after deletion, maintaining all filters 
                    loadAdminItems(adminCurrentPage, searchTerm, sortOrder, selectedCategory);  
                } else { 
                    toast.error(response.data.message); 
                } 
            } catch (error) { 
                toast.error("Failed to delete item."); 
            } 
        } 
    }; 

    const displayItems = items; // Items are already filtered/paginated by the context/API 

    // Array for rendering page buttons 
    const pageNumbers = Array.from({ length: adminTotalPages }, (_, i) => i + 1); 

    return ( 
        <div className="p-4 sm:p-6 lg:p-8"> 
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Items</h1> 
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"> 
                
                {/* 1. Search Input */} 
                <input 
                    type="text" 
                    placeholder="Search by item brand or model..." 
                    value={searchTerm} 
                    onChange={handleSearchChange}  
                    className="p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-colors col-span-1" 
                /> 

                {/* 2. Price Sorting Dropdown */} 
                <select 
                    value={sortOrder} 
                    onChange={handleSortChange} 
                    className="p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-colors appearance-none bg-white col-span-1" 
                > 
                    <option value="">Sort by Price</option> 
                    <option value="price_asc">Price: Lower to Higher</option> 
                    <option value="price_desc">Price: Higher to Lower</option> 
                </select> 

                {/* 3. Category Filtering Dropdown */} 
                <select 
                    value={selectedCategory} 
                    onChange={handleCategoryChange} 
                    className="p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-colors appearance-none bg-white col-span-1" 
                > 
                    <option value="">All Categories</option> 
                    {CATEGORIES.map(category => ( 
                        <option key={category} value={category}>{category}</option> 
                    ))} 
                </select> 

            </div> 

            <div className="bg-white rounded-xl shadow-lg overflow-hidden"> 
                <div className="overflow-x-auto"> 
                    <table className="min-w-full divide-y divide-gray-200"> 
                        <thead className="bg-gray-50"> 
                            <tr> 
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th> 
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th> 
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th> 
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th> 
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Day</th> 
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> 
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> 
                            </tr> 
                        </thead> 
                        <tbody className="bg-white divide-y divide-gray-200"> 
                            {displayItems.length > 0 ? ( 
                                displayItems.map((item) => ( 
                                    <tr key={item._id}> 
                                        <td className="px-6 py-4 whitespace-nowrap"> 
                                            <img 
                                                src={item.image || assets.default_item_image} 
                                                alt={`${item.brand} ${item.model}`} 
                                                className="h-12 w-12 rounded-lg object-cover" 
                                            /> 
                                        </td> 
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900"> 
                                            {item.brand} {item.model} 
                                        </td> 
                                        {/* Item.owner is populated by the backend */} 
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.owner?.name || 'N/A'}</td> 
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.category}</td> 
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{currency}{item.pricePerDay}</td> 
                                        <td className="px-6 py-4 whitespace-nowrap"> 
                                            <span className={` 
                                                px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${item.isAvaliable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} 
                                            `}> 
                                                {item.isAvaliable ? 'Available' : 'Unavailable'} 
                                            </span> 
                                        </td> 
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"> 
                                            {/* <Link  
                                                to={`/owner/items/edit/${item._id}`}  
                                                className="text-blue-600 hover:text-blue-900 mr-4 inline-block" 
                                                aria-label={`Edit ${item.brand} ${item.model}`} 
                                            > 
                                                <BiPencil size={20} /> 
                                            </Link> */} 
                                            <button  
                                                onClick={() => handleDeleteItem(item._id)}  
                                                className="text-red-600 hover:text-red-900" 
                                                aria-label={`Delete ${item.brand} ${item.model}`} 
                                            > 
                                                <BiTrash size={20} /> 
                                            </button> 
                                        </td> 
                                    </tr> 
                                )) 
                            ) : ( 
                                <tr> 
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500"> 
                                        No items found. 
                                    </td> 
                                </tr> 
                            )} 
                        </tbody> 
                    </table> 
                </div> 
            </div> 

            {/* ⭐ PAGINATION CONTROLS ⭐ */} 
            {adminTotalPages > 1 && ( 
                <div className="flex justify-center items-center gap-2 mt-8"> 
                    <button 
                        onClick={() => handlePageChange(adminCurrentPage - 1)} 
                        disabled={adminCurrentPage === 1} 
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors" 
                    > 
                        Previous 
                    </button> 

                    {/* Display up to 5 page numbers around the current page */} 
                    {pageNumbers 
                        .filter(page =>  
                            page === 1 ||  
                            page === adminTotalPages ||  
                            (page >= adminCurrentPage - 2 && page <= adminCurrentPage + 2) 
                        ) 
                        .map((page) => ( 
                            <button 
                                key={page} 
                                onClick={() => handlePageChange(page)} 
                                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors  
                                    ${adminCurrentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 hover:bg-gray-100 border-gray-300'}` 
                                } 
                            > 
                                {page} 
                            </button> 
                        ))} 

                    <button 
                        onClick={() => handlePageChange(adminCurrentPage + 1)} 
                        disabled={adminCurrentPage === adminTotalPages} 
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors" 
                    > 
                        Next 
                    </button> 
                </div> 
            )} 
        </div> 
    ); 
}; 

export default AdminItems;
















// import React, { useState, useEffect, useCallback } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { BiPencil, BiTrash } from "react-icons/bi";
// import { Link } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { assets } from '../../assets/assets'; 

// const AdminItems = () => {
//     // ⭐ DESTUCTURE NEW CONTEXT VARIABLES ⭐
//     const { 
//         currency, 
//         items, 
//         axios, 
//         fetchAdminItems, 
//         adminCurrentPage, 
//         setAdminCurrentPage, // Need this to reset page on search
//         adminTotalPages, 
//         adminLimit 
//     } = useAppContext();
    
//     const [searchTerm, setSearchTerm] = useState('');

//     // Wrap the fetch call in useCallback to stabilize the useEffect dependency
//     const loadAdminItems = useCallback((page, search) => {
//         fetchAdminItems(page, search);
//     }, [fetchAdminItems]);

//     // ⭐ useEffect to fetch data based on current page and search term ⭐
//     useEffect(() => {
//         // Debounce is ideal here, but for simplicity, we call loadAdminItems directly.
//         // The search term should trigger a new search on page 1.
//         loadAdminItems(adminCurrentPage, searchTerm); 
//     }, [adminCurrentPage, searchTerm, loadAdminItems]); 
    
//     // Handler for page button clicks
//     const handlePageChange = (page) => {
//         if (page >= 1 && page <= adminTotalPages) {
//             // This calls setAdminCurrentPage in the Context, which triggers the useEffect above.
//             loadAdminItems(page, searchTerm); 
//         }
//     };
    
//     const handleDeleteItem = async (itemId) => {
//         if (window.confirm("Are you sure you want to delete this item?")) {
//             try {
//                 const response = await axios.delete(`/api/user/admin/items/${itemId}`);
//                 if (response.data.success) {
//                     toast.success("Item deleted successfully.");
//                     // Re-fetch the current page after deletion, maintaining search filter
//                     loadAdminItems(adminCurrentPage, searchTerm); 
//                 } else {
//                     toast.error(response.data.message);
//                 }
//             } catch (error) {
//                 toast.error("Failed to delete item.");
//             }
//         }
//     };

//     // The filter now simply renders the items fetched from the paginated API
//     // We remove the local filter since the API now handles search and pagination together.
//     // However, if the search term is used only for highlighting, you can keep the local filter.
//     // Since the backend now handles Brand/Model search, we can just use the 'items' array.
//     const displayItems = items; // Items are already filtered/paginated by the context/API

//     const handleSearchChange = (e) => {
//         const newSearchTerm = e.target.value;
//         setSearchTerm(newSearchTerm);
        
//         // ⭐ Reset to page 1 ONLY if the user starts typing a new search (and they aren't already on page 1)
//         if (adminCurrentPage !== 1) {
//             setAdminCurrentPage(1);
//         } else {
//             // Manually re-trigger the fetch if already on page 1 (since useEffect dependency didn't change page)
//             loadAdminItems(1, newSearchTerm);
//         }
//     };

//     // Array for rendering page buttons
//     const pageNumbers = Array.from({ length: adminTotalPages }, (_, i) => i + 1);

//     return (
//         <div className="p-4 sm:p-6 lg:p-8">
//             <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Items</h1>
            
//             <div className="flex flex-col sm:flex-row gap-4 mb-6">
//                 <input
//                     type="text"
//                     placeholder="Search by item brand or model..."
//                     value={searchTerm}
//                     onChange={handleSearchChange} // Use the new handler
//                     className="flex-1 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-colors"
//                 />
//             </div>

//             <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         {/* ... Table Header (thead) remains the same ... */}
//                         <thead className="bg-gray-50">
//                              {/* ... (table rows) ... */}
//                               <tr>
//                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
//                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
//                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
//                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Day</th>
//                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                                </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {displayItems.length > 0 ? (
//                                 displayItems.map((item) => (
//                                     <tr key={item._id}>
//                                         {/* ... Table Data remains the same, using item.owner?.name ... */}
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <img
//                                                 src={item.image || assets.default_item_image}
//                                                 alt={`${item.brand} ${item.model}`}
//                                                 className="h-12 w-12 rounded-lg object-cover"
//                                             />
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
//                                             {item.brand} {item.model}
//                                         </td>
//                                         {/* Item.owner is populated by the backend */}
//                                         <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.owner?.name || 'N/A'}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.category}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-gray-600">{currency}{item.pricePerDay}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span className={`
//                                                 px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                                                 ${item.isAvaliable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
//                                             `}>
//                                                 {item.isAvaliable ? 'Available' : 'Unavailable'}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                             <button onClick={() => handleDeleteItem(item._id)} className="text-red-600 hover:text-red-900">
//                                                 <BiTrash size={20} />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
//                                         No items found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* ⭐ PAGINATION CONTROLS ⭐ */}
//             {adminTotalPages > 1 && (
//                 <div className="flex justify-center items-center gap-2 mt-8">
//                     <button
//                         onClick={() => handlePageChange(adminCurrentPage - 1)}
//                         disabled={adminCurrentPage === 1}
//                         className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
//                     >
//                         Previous
//                     </button>

//                     {pageNumbers.map((page) => (
//                         <button
//                             key={page}
//                             onClick={() => handlePageChange(page)}
//                             className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors 
//                                 ${adminCurrentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 hover:bg-gray-100 border-gray-300'}`
//                             }
//                         >
//                             {page}
//                         </button>
//                     ))}

//                     <button
//                         onClick={() => handlePageChange(adminCurrentPage + 1)}
//                         disabled={adminCurrentPage === adminTotalPages}
//                         className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
//                     >
//                         Next
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdminItems;













// import React, { useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { BiPencil, BiTrash } from "react-icons/bi";
// import { Link } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { assets } from '../../assets/assets'; // Assuming you have a fallback image in your assets

// const AdminItems = () => {
//     // Correctly imported `currency`, `items`, `axios`, and `fetchAdminItems`
//     const { currency, items, axios, fetchAdminItems } = useAppContext();
//     const [searchTerm, setSearchTerm] = useState('');

//     const handleDeleteItem = async (itemId) => {
//         if (window.confirm("Are you sure you want to delete this item?")) {
//             try {
//                 // The correct backend URL for deletion
//                 const response = await axios.delete(`/api/user/admin/items/${itemId}`);
//                 if (response.data.success) {
//                     toast.success("Item deleted successfully.");
//                     // Re-fetch the entire list of items from the backend to update the UI
//                     fetchAdminItems(); 
//                 } else {
//                     toast.error(response.data.message);
//                 }
//             } catch (error) {
//                 toast.error("Failed to delete item.");
//             }
//         }
//     };
    
//     // The filter now correctly uses the 'brand' and 'model' properties
//     const filteredItems = items.filter(item =>
//         item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="p-4 sm:p-6 lg:p-8">
//             <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Items</h1>
            
//             <div className="flex flex-col sm:flex-row gap-4 mb-6">
//                 <input
//                     type="text"
//                     placeholder="Search by item, brand, model or vendor name..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="flex-1 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-colors"
//                 />
//             </div>

//             <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Day</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {filteredItems.length > 0 ? (
//                                 filteredItems.map((item) => (
//                                     <tr key={item._id}>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             {/* FIX: Use item.image and add a fallback image */}
//                                             <img
//                                                 src={item.image || assets.default_item_image}
//                                                 alt={`${item.brand} ${item.model}`}
//                                                 className="h-12 w-12 rounded-lg object-cover"
//                                             />
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
//                                             {/* FIX: Combine brand and model to form the name */}
//                                             {item.brand} {item.model}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.owner?.name || 'N/A'}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.category}</td>
//                                         {/* FIX: Correctly display the price */}
//                                         <td className="px-6 py-4 whitespace-nowrap text-gray-600">{currency}{item.pricePerDay}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span className={`
//                                                 px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                                                 ${item.isAvaliable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
//                                             `}>
//                                                 {item.isAvaliable ? 'Available' : 'Unavailable'}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                             {/* <Link to={`/admin/items/edit/${item._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
//                                                 <BiPencil size={20} />
//                                             </Link> */}
//                                             <button onClick={() => handleDeleteItem(item._id)} className="text-red-600 hover:text-red-900">
//                                                 <BiTrash size={20} />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
//                                         No items found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminItems;