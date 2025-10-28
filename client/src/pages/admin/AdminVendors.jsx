import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'; // Import icons for pagination

const AdminVendors = () => {
    const { axios } = useAppContext();
    const [vendors, setVendors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // 💡 PAGINATION STATE 💡
    const [currentPage, setCurrentPage] = useState(1);
    const VENDORS_PER_PAGE = 10; // Set the limit

    const fetchVendors = async () => {
        try {
            setLoading(true);
            // NOTE: For true scalability, the backend should handle paging.
            // For now, we fetch all vendors and handle paging on the frontend.
            const response = await axios.get('/api/user/admin/vendors');
            if (response.data.success) {
                setVendors(response.data.vendors || []);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch vendors.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (vendorId, newStatus) => {
        try {
            const response = await axios.post(`/api/user/admin/vendors/status`, {
                vendorId,
                status: newStatus // newStatus is already a boolean
            });
            
            if (response.data.success) {
                toast.success(response.data.message);
                
                // ⭐ GUARANTEED FIX: Update local state directly and immediately.
                setVendors(prevVendors => 
                    prevVendors.map(vendor => {
                        if (vendor._id === vendorId) {
                            // Return a brand new object to ensure React detects the change and re-renders.
                            return { ...vendor, isVerified: newStatus };
                        }
                        return vendor;
                    })
                );
                
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to update vendor status.");
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    // Reset page to 1 whenever search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // 1. FILTER VENDORS BASED ON SEARCH TERM
    const filteredVendors = vendors.filter(vendor =>
        vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. CALCULATE PAGINATION VALUES
    const totalPages = Math.ceil(filteredVendors.length / VENDORS_PER_PAGE);
    const indexOfLastVendor = currentPage * VENDORS_PER_PAGE;
    const indexOfFirstVendor = indexOfLastVendor - VENDORS_PER_PAGE;

    // 3. SLICE THE ARRAY FOR THE CURRENT PAGE
    const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);

    // 4. PAGINATION HANDLERS
    const goToNextPage = () => {
        setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    };

    const goToPrevPage = () => {
        setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    };

    if (loading) {
        return <div className="p-8 text-center">Loading vendors...</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Vendors</h1>
            
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search vendors by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            {/* Table Headers remain the same */}
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* Map over the paged array: currentVendors */}
                            {currentVendors.length > 0 ? (
                                currentVendors.map(vendor => (
                                    <tr key={vendor._id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{vendor.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vendor.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 

                                           
                                             ${vendor.isVerified ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {/* Adjusted logic to show correct badge */}
{/*                                                 {vendor.isVerified ? 'Verified' : 'Unverified'} */}
                                                  {vendor.isVerified ? 'Unverified' : 'Verified'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <select 
                                                // Ensure the selected value is based on the current vendor's status, converted to string

                                               // value={vendor.isVerified ? 'true' : 'false'}
                                                value={vendor.isVerified ? 'false' : 'true'}

                                                // Convert the string value back to boolean for the API call
                                                onChange={(e) => handleStatusChange(vendor._id, e.target.value === 'true')}
                                                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            >
                                                <option value="true">Verify</option>
                                                <option value="false">Unverify</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No vendors match your search or current page.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 💡 PAGINATION CONTROLS 💡 */}
            {filteredVendors.length > 0 && totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstVendor + 1}</span> to <span className="font-medium">{Math.min(indexOfLastVendor, filteredVendors.length)}</span> of <span className="font-medium">{filteredVendors.length}</span> results
                    </p>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            <BiChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        
                        <div className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-600 text-white text-sm font-medium">
                            {currentPage} / {totalPages}
                        </div>

                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            <BiChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default AdminVendors;






















// import React, { useState, useEffect } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import toast from 'react-hot-toast';

// const AdminVendors = () => {
//     const { axios } = useAppContext();
//     const [vendors, setVendors] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [loading, setLoading] = useState(true);

//     const fetchVendors = async () => {
//         try {
//             setLoading(true);
//             // New backend endpoint to fetch vendors
//             const response = await axios.get('/api/user/admin/vendors');
//             if (response.data.success) {
//                 setVendors(response.data.vendors);
//             } else {
//                 toast.error(response.data.message);
//             }
//         } catch (error) {
//             toast.error("Failed to fetch vendors.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleStatusChange = async (vendorId, newStatus) => {
//         try {
//             const response = await axios.post(`/api/user/admin/vendors/status`, {
//                 vendorId,
//                 status: newStatus
//             });
//             if (response.data.success) {
//                 toast.success(response.data.message);
//                 fetchVendors(); // Re-fetch list to show updated status
//             } else {
//                 toast.error(response.data.message);
//             }
//         } catch (error) {
//             toast.error("Failed to update vendor status.");
//         }
//     };

//     useEffect(() => {
//         fetchVendors();
//     }, []);

//     const filteredVendors = vendors.filter(vendor =>
//         vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     if (loading) {
//         return <div className="p-8 text-center">Loading vendors...</div>;
//     }

//     return (
//         <div className="p-4 sm:p-6 lg:p-8">
//             <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Vendors</h1>
            
//             <div className="mb-6">
//                 <input
//                     type="text"
//                     placeholder="Search vendors by name or email..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-colors"
//                 />
//             </div>

//             <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {filteredVendors.length > 0 ? (
//                                 filteredVendors.map(vendor => (
//                                     <tr key={vendor._id}>
//                                         <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{vendor.name}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vendor.email}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                                                 ${vendor.isVerified ?  'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
//                                                 {vendor.isVerified ? 'UnVerified' : 'Verified'}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                             <select 
//                                                 onChange={(e) => handleStatusChange(vendor._id, e.target.value === 'true')}
//                                                 value={vendor.isVerified ? 'false' : 'true'}
//                                                 className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                                             >
//                                                 <option value="true">Verify</option>
//                                                 <option value="false">Unverify</option>
//                                             </select>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
//                                         No vendors found.
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

// export default AdminVendors;