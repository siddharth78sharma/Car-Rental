import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'; // 👈 Imported icons for pagination

const AdminUsers = () => {
    const { axios } = useAppContext();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // 💡 PAGINATION STATE 💡
    const [currentPage, setCurrentPage] = useState(1);
    const USERS_PER_PAGE = 10; // Set the limit to 10

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // NOTE: We fetch all users and handle paging on the frontend for simplicity here.
            const response = await axios.get('/api/user/admin/users');
            if (response.data.success) {
                setUsers(response.data.users || []);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await axios.post(`/api/user/admin/users/role`, {
                userId,
                role: newRole
            });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchUsers(); // Re-fetch the list to show the updated role
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to update user role.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Reset page to 1 whenever search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // 1. FILTER USERS BASED ON SEARCH TERM
    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. CALCULATE PAGINATION VALUES
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const indexOfLastUser = currentPage * USERS_PER_PAGE;
    const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;

    // 3. SLICE THE ARRAY FOR THE CURRENT PAGE
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // 4. PAGINATION HANDLERS
    const goToNextPage = () => {
        setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    };

    const goToPrevPage = () => {
        setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    };


    if (loading) {
        return <div className="p-8 text-center">Loading users...</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h1>
            
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* Map over the paged array: currentUsers */}
                            {currentUsers.length > 0 ? (
                                currentUsers.map(user => (
                                    <tr key={user._id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' :
                                                user.role === 'owner' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <select 
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                value={user.role}
                                                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            >
                                                <option value="user">User</option>
                                                <option value="owner">Owner</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No users match your search or current page.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 💡 PAGINATION CONTROLS 💡 */}
            {filteredUsers.length > 0 && totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of <span className="font-medium">{filteredUsers.length}</span> results
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

export default AdminUsers;















// import React, { useState, useEffect } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import toast from 'react-hot-toast';

// const AdminUsers = () => {
//     const { axios } = useAppContext();
//     const [users, setUsers] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [loading, setLoading] = useState(true);

//     const fetchUsers = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get('/api/user/admin/users');
//             if (response.data.success) {
//                 setUsers(response.data.users);
//             } else {
//                 toast.error(response.data.message);
//             }
//         } catch (error) {
//             toast.error("Failed to fetch users.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleRoleChange = async (userId, newRole) => {
//         try {
//             const response = await axios.post(`/api/user/admin/users/role`, {
//                 userId,
//                 role: newRole
//             });
//             if (response.data.success) {
//                 toast.success(response.data.message);
//                 fetchUsers(); // Re-fetch the list to show the updated role
//             } else {
//                 toast.error(response.data.message);
//             }
//         } catch (error) {
//             toast.error("Failed to update user role.");
//         }
//     };

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const filteredUsers = users.filter(user =>
//         user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     if (loading) {
//         return <div className="p-8 text-center">Loading users...</div>;
//     }

//     return (
//         <div className="p-4 sm:p-6 lg:p-8">
//             <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h1>
            
//             <div className="mb-6">
//                 <input
//                     type="text"
//                     placeholder="Search users by name or email..."
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
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {filteredUsers.length > 0 ? (
//                                 filteredUsers.map(user => (
//                                     <tr key={user._id}>
//                                         <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                                                 ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' :
//                                                 user.role === 'owner' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
//                                                 {user.role}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                             <select 
//                                                 onChange={(e) => handleRoleChange(user._id, e.target.value)}
//                                                 value={user.role}
//                                                 className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                                             >
//                                                 <option value="user">User</option>
//                                                 <option value="owner">Owner</option>
//                                                 <option value="admin">Admin</option>
//                                             </select>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
//                                         No users found.
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

// export default AdminUsers;