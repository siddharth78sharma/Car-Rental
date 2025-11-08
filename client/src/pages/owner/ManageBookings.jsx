import React, { useEffect, useState, useMemo } from 'react';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';


// Constants
const ITEMS_PER_PAGE = 10;
const ALL_STATUSES = ['All', 'pending', 'confirmed', 'cancelled'];


// Custom Confirmation Modal Component (Replaces window.confirm)
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform scale-100 transition-transform duration-300">
                <h3 className="text-xl font-bold text-red-600 mb-3">{title}</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const ManageBookings = () => {
    const { axios, currency } = useAppContext();

    const [allBookings, setAllBookings] = useState([]); // Stores all fetched bookings
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    
    // Filtering States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    
    // Delete Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);

    // ------------------- API HANDLERS -------------------
    const fetchOwnerBookings = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get('/api/bookings/owner');
            if (data.success) {
                // Assuming data.bookings is the complete list of bookings
                setAllBookings(data.bookings || []);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch bookings.");
        } finally {
            setIsLoading(false);
        }
    };


    const changeBookingStatus = async (bookingId, status) => {
        try {
            const { data } = await axios.post('/api/bookings/change-status', { bookingId, status });
            if (data.success) {
                toast.success(data.message);
                // Update local state instead of re-fetching everything
                setAllBookings(prev => prev.map(b => 
                    b._id === bookingId ? { ...b, status: status } : b
                ));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to change status.");
        }
    };
    
    // Deletion Modal Trigger (Replaced original window.confirm logic)
    const deleteBooking = (bookingId) => {
        setBookingToDelete(bookingId);
        setIsModalOpen(true);
    };
    
    // Confirmed Deletion Handler
    const confirmDelete = async () => {
        setIsModalOpen(false);
        if (!bookingToDelete) return;

        try {
           const { data } = await axios.post('/api/bookings/delete-booking', { bookingId: bookingToDelete });
            if (data.success) {
                toast.success(data.message);
                // Remove from local state and reset delete state
                setAllBookings(prev => prev.filter(b => b._id !== bookingToDelete));
                setBookingToDelete(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to delete booking.");
        }
    };

    // ------------------- FILTERING & PAGINATION LOGIC -------------------

    // Use useMemo to filter and paginate only when necessary
    const filteredBookings = useMemo(() => {
        let list = allBookings;
        const searchLower = searchQuery.toLowerCase();
        const statusLower = selectedStatus.toLowerCase();

        // 1. Status Filter
        if (selectedStatus !== 'All') {
            list = list.filter(booking => booking.status.toLowerCase() === statusLower);
        }

        // 2. Search Filter (by item brand or model)
        if (searchQuery) {
            list = list.filter(booking => 
                booking.car?.brand?.toLowerCase().includes(searchLower) || 
                booking.car?.model?.toLowerCase().includes(searchLower)
            );
        }
        
        // Reset page if filtering reduces results
        if (currentPage > Math.ceil(list.length / ITEMS_PER_PAGE) && list.length > 0) {
            setCurrentPage(1);
        }

        return list;
    }, [allBookings, searchQuery, selectedStatus]);


    // Pagination logic
    const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedBookings = filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    // ------------------- EFFECT HOOKS -------------------
    useEffect(() => {
        fetchOwnerBookings();
    }, [axios]); // Dependency kept from original code for axios

    useEffect(() => {
        // Reset to first page whenever filtering criteria changes
        setCurrentPage(1);
    }, [searchQuery, selectedStatus]);


    // ------------------- RENDER HELPERS -------------------
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        // Only show up to 5 surrounding pages for clean UI
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
                            ? 'bg-blue-600 text-white shadow-md'
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
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                {pages}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 ml-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        );
    };


    // ------------------- MAIN RENDER -------------------
    
    if (isLoading) {
        return (
             <div className='p-6 md:p-10 bg-gray-50 min-h-screen flex items-center justify-center'>
                 <div className="text-xl text-gray-600">Loading bookings...</div>
             </div>
        )
    }

    return (
        <div className='p-6 md:p-10 bg-gray-50 min-h-screen font-sans'>
            <Title 
                title="Manage Bookings" 
               // subTitle="Track all bookings, approve or cancel requests, and manage booking statuses."
            />
            
            {/* Filter and Search Bar Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 w-full max-w-7xl mx-auto">
                {/* Search Bar */}
                <div className='flex items-center bg-white px-4 py-2 flex-grow h-12 rounded-lg shadow-sm border border-gray-200'>
                    {/* Placeholder for search icon - adjust based on your actual assets structure if needed */}
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
                        className='appearance-none px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white h-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium w-full md:w-40'
                    >
                        {ALL_STATUSES.map(status => (
                            <option key={status} value={status} className="capitalize">{status} Status</option>
                        ))}
                    </select>
                    {/* Custom arrow icon for select */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.646 4.646z"/></svg>
                    </div>
                </div>
            </div>

            <div className='w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg mt-4 overflow-x-auto'>
                <table className='min-w-full table-auto text-left divide-y divide-gray-200'>
                    <thead className='bg-gray-100 text-gray-600 uppercase text-xs font-semibold tracking-wider'>
                        <tr>
                            <th className='p-4 whitespace-nowrap'>Item</th>
                            <th className='p-4 hidden md:table-cell whitespace-nowrap'>Date Range</th>
                            <th className='p-4 whitespace-nowrap'>Price</th>
                            <th className='p-4 hidden md:table-cell whitespace-nowrap'>Payment</th>
                            <th className='p-4 whitespace-nowrap'>Status</th>
                            <th className='p-4 text-right whitespace-nowrap'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                        {paginatedBookings.length > 0 ? paginatedBookings.map((booking, index) => (
                            <tr key={booking._id} className='hover:bg-blue-50 transition-colors duration-200'>
                                <td className='p-4 flex items-center gap-4 whitespace-nowrap'>
                                    <img src={booking.car?.image} alt="" className='h-14 w-14 rounded-lg object-cover shadow-sm'/>
                                    <div>
                                        <p className='font-bold text-gray-900 text-sm'>{booking.car?.brand} {booking.car?.model}</p>
                                        <p className='text-xs text-gray-500'>ID: {booking._id?.slice(-4)}</p>
                                    </div>
                                </td>
                                
                                <td className='p-4 text-gray-700 hidden md:table-cell text-sm whitespace-nowrap'>
                                    {new Date(booking.pickupDate).toLocaleDateString()}
                                    <span className='text-xs text-gray-400 block'>to</span>
                                    {new Date(booking.returnDate).toLocaleDateString()}
                                </td>

                                <td className='p-4 font-semibold text-gray-900 text-base whitespace-nowrap'>{currency}{booking.price}</td>

                                {/* <td className='p-4 text-gray-700 hidden md:table-cell text-sm whitespace-nowrap'>
                                    <span className='bg-gray-100 px-3 py-1 rounded-full text-xs font-medium'>Cash on</span>
                                </td> */}
                               
                                {/* <td className='p-4 text-gray-700 hidden md:table-cell text-sm whitespace-nowrap'>
                                  {booking.paymentMethod ? (
                                  <span
                                   className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    booking.paymentMethod.toLowerCase() === 'online'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                   }`}
                                >
                                  {booking.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}
                                 </span>
                                ) : (
                                 <span className='bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600'>
                                    Unknown
                                  </span>
                                 )}
                                </td> */}
                             {/* <td className="p-4 text-gray-700 hidden md:table-cell text-sm whitespace-nowrap">
                                  {booking.paymentMethod === "online" ? (
                                  booking.paymentStatus === "paid" ? (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Paid (Online)
                                </span>
                                ) : (
                                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                   Payment Pending
                                  </span>
                               )
                                ) : (
                               <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                   Cash on Delivery
                               </span>
                                  )}
                            </td> */}

                            <td className="p-4 text-gray-700 hidden md:table-cell text-sm whitespace-nowrap">
                              {booking.paymentMethod === "online" ? (
                                booking.paymentStatus === "paid" ? (
                               <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                   Paid
                                 </span>
                                 ) : (
                               <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    unpaid
                                 </span>
                                     )
                                ) : (
                                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Unpaid
                                     </span>
                                )}
                               </td>




                                <td className='p-4 text-sm whitespace-nowrap'>
                                    {booking.status === 'pending' ? (
                                        <select 
                                            onChange={e => changeBookingStatus(booking._id, e.target.value)} 
                                            value={booking.status} 
                                            className='px-3 py-1 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 capitalize'
                                        >
                                            <option value="pending" className="text-gray-800">Pending</option>
                                            <option value="cancelled" className="text-gray-800">Cancel</option>
                                            <option value="confirmed" className="text-gray-800">Confirm</option>
                                        </select>
                                    ) : (
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`
                                        }>
                                            {booking.status}
                                        </span>
                                    )}
                                </td>

                                <td className='p-4 text-right flex justify-end gap-3'>
                                  <button 
                                    onClick={() => navigate(`/owner/bookings/view/${booking._id}`)} 
                                    className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                                     aria-label={`View booking ${booking._id}`}
                                   >
                                 <img src={assets.eye_icon} alt="View" className='h-5 w-5' />
                                  </button>

                                  <button 
                                     onClick={() => deleteBooking(booking._id)} 
                                     className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                                     aria-label={`Delete booking ${booking._id}`}
                                   >
                                    <img src={assets.delete_icon} alt="Delete" className='h-5 w-5 inline-block'/>
                                   </button>
                                </td>

                                
                                {/* <td className='p-4 text-right'>
                                    <button 
                                        onClick={() => deleteBooking(booking._id)} 
                                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                                        aria-label={`Delete booking ${booking._id}`}
                                    >
                                        <img src={assets.delete_icon} alt="Delete" className='h-5 w-5 inline-block'/>
                                    </button>
                                </td> */}
                            </tr>
                        )) : <tr><td colSpan="6" className='p-8 text-center text-gray-500 text-lg'>No bookings match your current filter criteria.</td></tr>}
                    </tbody>
                </table>
                
                {/* Display total filtered count */}
                {filteredBookings.length > 0 && (
                     <div className='p-4 text-sm text-gray-600 border-t border-gray-200 flex justify-between items-center'>
                        <span>
                            Showing {Math.min(filteredBookings.length, startIndex + 1)} - {Math.min(filteredBookings.length, startIndex + ITEMS_PER_PAGE)} of {filteredBookings.length} results
                        </span>
                    </div>
                )}
            </div>
            
            {/* Pagination Controls */}
            {renderPagination()}

            {/* Custom Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                title="Confirm Deletion"
                message={`Are you sure you want to permanently delete booking ID: ${bookingToDelete?.slice(-4)}? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default ManageBookings;