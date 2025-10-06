import React, { useEffect, useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { BiPencil, BiTrash } from "react-icons/bi";
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets'; 

// Constants for filtering and pagination
const ITEMS_PER_PAGE = 10;
const ALL_STATUSES = ['All', 'confirmed', 'pending', 'cancelled'];

const AdminOrders = () => {
    const { axios, currency } = useAppContext();
    
    const [orders, setOrders] = useState([]); // Stores all fetched orders
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter and Pagination States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/user/admin/orders');
            if (data.success) {
                setOrders(data.orders);
            } else {
                toast.error("Failed to fetch orders.");
                setError("Failed to fetch orders.");
            }
        } catch (err) {
            toast.error("An error occurred while fetching orders.");
            setError("An error occurred while fetching orders.");
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const { data } = await axios.post('/api/user/admin/orders/status', {
                orderId,
                status: newStatus
            });
            if (data.success) {
                toast.success(data.message);
                // Update the status in the local state for immediate feedback
                setOrders(prevOrders => prevOrders.map(order => 
                    order._id === orderId ? { ...order, status: newStatus } : order
                ));
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Failed to update order status.");
        }
    };

    // --- Filtering and Pagination Logic ---
    const filteredAndSearchedOrders = useMemo(() => {
        let list = orders;
        const searchLower = searchQuery.toLowerCase();
        const statusLower = selectedStatus.toLowerCase();

        // 1. Status Filter
        if (selectedStatus !== 'All') {
            list = list.filter(order => order.status?.toLowerCase() === statusLower);
        }

        // 2. Search Filter (by item brand or model)
        if (searchQuery) {
            list = list.filter(order =>
                order.car?.brand?.toLowerCase().includes(searchLower) ||
                order.car?.model?.toLowerCase().includes(searchLower)
            );
        }

        // If the current page is out of bounds after filtering, reset to page 1
        const maxPages = Math.ceil(list.length / ITEMS_PER_PAGE);
        if (currentPage > maxPages && list.length > 0) {
            setCurrentPage(1);
        }

        return list;
    }, [orders, searchQuery, selectedStatus, currentPage]);

    const totalPages = Math.ceil(filteredAndSearchedOrders.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedOrders = filteredAndSearchedOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Reset page to 1 when search or status filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedStatus]);
    
    // Initial data fetch
    useEffect(() => {
        fetchOrders();
    }, []);
    // --- End Filtering and Pagination Logic ---


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5; 
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 mx-1 rounded-lg text-sm font-semibold transition-colors
                        ${i === currentPage
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex justify-center items-center mt-6 p-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 mr-2"
                    aria-label="Previous Page"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                {pages}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 ml-2"
                    aria-label="Next Page"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-gray-600 text-lg">Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Orders</h1>
            
            {/* Filter and Search Bar Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 w-full max-w-full lg:max-w-7xl mx-auto">
                {/* Search Bar */}
                <div className='flex items-center bg-white px-4 py-2 flex-grow h-12 rounded-lg shadow-sm border border-gray-200'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        value={searchQuery} 
                        type="text" 
                        placeholder='Search by item brand or model...' 
                        className='w-full h-full outline-none text-gray-600 placeholder:text-gray-400 text-base'
                    />
                </div>

                {/* Status Filter */}
                <div className='relative'>
                    <select 
                        onChange={e => setSelectedStatus(e.target.value)} 
                        value={selectedStatus} 
                        className='appearance-none px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white h-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium w-full md:w-40 capitalize'
                    >
                        {ALL_STATUSES.map(status => (
                            <option key={status} value={status} className="capitalize">{status} Orders</option>
                        ))}
                    </select>
                    {/* Custom arrow icon for select */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.646 4.646z"/></svg>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full lg:max-w-7xl mx-auto">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedOrders.length > 0 ? (
                                paginatedOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-indigo-50 transition duration-150">
                                         {/* Item Column */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="flex items-center">
                                                {/* Image placeholder removed to avoid compilation issues, assuming it's complex data */}
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{order.car?.brand}</div>
                                                    <div className="text-sm text-gray-500">{order.car?.model || 'Item ID: ' + order._id?.slice(-4)}</div>
                                                </div>
                                            </div>
                                        </td>


                                         {/* Customer Column */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{order.user?.name || 'Unknown User'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        
                                        {/* Pickup Date */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDate(order.pickupDate)}
                                        </td>
                                        
                                        {/* Return Date */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDate(order.returnDate)}
                                        </td>

                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">
                                             {currency}{order.price}
                                         </td>
                                        
                                        {/* Current Status Badge */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize
                                                ${order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                order.status === 'pending' ? 'bg-blue-100 text-blue-800' : 
                                                'bg-red-100 text-red-800'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        
                                        {/* Actions: Status Dropdown */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <select 
                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                value={order.status}
                                                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm capitalize bg-white"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500 text-lg">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer showing item count */}
                {filteredAndSearchedOrders.length > 0 && (
                     <div className='p-4 text-sm text-gray-600 border-t border-gray-200 flex justify-between items-center'>
                        <span>
                            Showing {Math.min(filteredAndSearchedOrders.length, startIndex + 1)} - {Math.min(filteredAndSearchedOrders.length, startIndex + ITEMS_PER_PAGE)} of {filteredAndSearchedOrders.length} total orders
                        </span>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {renderPagination()}
        </div>
    );
};

export default AdminOrders;














// import React, { useEffect, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { BiPencil, BiTrash } from "react-icons/bi";
// import { Link } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { assets } from '../../assets/assets'; 

// const AdminOrders = () => {
//     const { axios, currency } = useAppContext();
    
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const fetchOrders = async () => {
//         try {
//             setLoading(true);
//             const { data } = await axios.get('/api/user/admin/orders');
//             if (data.success) {
//                 setOrders(data.orders);
//             } else {
//                 toast.error("Failed to fetch orders.");
//                 setError("Failed to fetch orders.");
//             }
//         } catch (err) {
//             toast.error("An error occurred while fetching orders.");
//             setError("An error occurred while fetching orders.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateOrderStatus = async (orderId, newStatus) => {
//         try {
//             const { data } = await axios.post('/api/user/admin/orders/status', {
//                 orderId,
//                 status: newStatus
//             });
//             if (data.success) {
//                 toast.success(data.message);
//                 fetchOrders();
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (err) {
//             toast.error("Failed to update order status.");
//         }
//     };

//     useEffect(() => {
//         fetchOrders();
//     }, []);

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//         });
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <p>Loading orders...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <p className="text-red-500">{error}</p>
//             </div>
//         );
//     }

//     return (
//         <div className="p-4 sm:p-6 lg:p-8">
//             <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Orders</h1>
            
//             <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Date</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {orders.length > 0 ? (
//                                 orders.map((order) => (
//                                     <tr key={order._id}>
//                                          {/* Item Column */}
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                             <div className="flex items-center">
//                                                 {/* <div className="flex-shrink-0 h-10 w-10">
//                                                     <img className="h-10 w-10 rounded-full" src={order.car?.image  || assets.default_item_image} alt={`${order.car?.brand } ${order.car?.model }`} />
//                                                 </div> */}
//                                                 <div className="ml-4">
//                                                     <div className="text-sm font-medium text-gray-900">{order.car?.brand }</div>
//                                                     <div className="text-sm text-gray-500">{order.car?.model }</div>
//                                                 </div>
//                                             </div>
//                                         </td>


//                                         {/* Customer Column */}
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                             <div className="flex items-center">
//                                                 {/* <div className="flex-shrink-0 h-10 w-10">
//                                                     <img className="h-10 w-10 rounded-full" src={order.user?.image || assets.default_user_image} alt="Customer" />
//                                                 </div> */}
//                                                 <div className="ml-4">
//                                                     <div className="text-sm font-medium text-gray-900">{order.user?.name}</div>
//                                                 </div>
//                                             </div>
//                                         </td>
                                        
                                       
//                                       {/* Pickup Date */}
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                             {formatDate(order.pickupDate)}
//                                         </td>
                                        
//                                         {/* Return Date */}
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                             {formatDate(order.returnDate)}
//                                         </td>

//                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                             {currency}{order.price}
//                                          </td>
                                        
//                                         {/* Status */}
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                                                 ${order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                                                 order.status === 'pending' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
//                                                 {order.status}
//                                             </span>
//                                         </td>
                                        
//                                         {/* Actions */}
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                             <select 
//                                                 onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                                                 value={order.status}
//                                                 className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                                             >
//                                                 <option value="pending">Pending</option>
//                                                 <option value="confirmed">Confirmed</option>
//                                                 <option value="cancelled">Cancelled</option>
//                                             </select>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
//                                         No orders found.
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

// export default AdminOrders;













// import React, { useEffect, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { toast } from 'react-hot-toast';

// const AdminOrders = () => {
//     // Access context for currency and configured axios instance
//     const { axios, currency } = useAppContext(); 
    
//     // State to store order data, loading status, and errors
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Function to fetch all orders from the backend
//     const fetchOrders = async () => {
//         try {
//             setLoading(true);
//             const { data } = await axios.get('/api/user/admin/orders');
//             if (data.success) {
//                 setOrders(data.orders);
//             } else {
//                 toast.error("Failed to fetch orders.");
//                 setError("Failed to fetch orders.");
//             }
//         } catch (err) {
//             toast.error("An error occurred while fetching orders.");
//             setError("An error occurred while fetching orders.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Function to update an order's status via a backend API call
//     const updateOrderStatus = async (orderId, newStatus) => {
//         try {
//             const { data } = await axios.post('/api/user/admin/orders/status', {
//                 orderId,
//                 status: newStatus
//             });
//             if (data.success) {
//                 toast.success(data.message);
//                 fetchOrders(); // Re-fetch orders to show the updated status
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (err) {
//             toast.error("Failed to update order status.");
//         }
//     };

//     // Fetch orders on component mount
//     useEffect(() => {
//         fetchOrders();
//     }, []);

//     // Conditional rendering for loading and error states
//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <p>Loading orders...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <p className="text-red-500">{error}</p>
//             </div>
//         );
//     }

//  return (
//         <div className="p-4 sm:p-6 lg:p-8">
//             <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Orders</h1>
            
//             <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item(s)</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {orders.length > 0 ? (
//                                 orders.map((order) => (
//                                     <tr key={order._id}>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order._id.slice(0, 8)}...</td>
//                                         {/* CHANGE THIS LINE FROM order.items to order.car */}
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                             {order.car?.brand || 'N/A'}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.user?.name || 'N/A'}</td>
//                                         {/* The total amount is a separate property in your Booking schema, you'll need to use order.price */}
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{currency}{order.price}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                                                 ${order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                                                 order.status === 'pending' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
//                                                 {order.status}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                             <select 
//                                                 onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                                                 value={order.status}
//                                                 className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                                             >
//                                                 <option value="pending">Pending</option>
//                                                 <option value="confirmed">Confirmed</option>
//                                                 <option value="cancelled">Cancelled</option>
//                                             </select>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
//                                         No orders found.
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

// export default AdminOrders;