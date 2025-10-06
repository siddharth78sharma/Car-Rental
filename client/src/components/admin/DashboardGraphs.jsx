import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// FIX: API URL uses '/api/user/' prefix to match server mounting: /api/user/admin/dashboard-graphs
const GRAPHS_API_URL = 'http://localhost:3000/api/user/admin/dashboard-graphs';

const DashboardGraphs = () => {
    // ... (State variables remain the same)
    const [graphData, setGraphData] = React.useState([]);
    const [recentUsers, setRecentUsers] = React.useState([]);
    const [topVendors, setTopVendors] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // Function to handle API fetching for all graph and table data
    const fetchDashboardData = async (retries = 3) => {
        setLoading(true);
        setError(null);

        // Retrieve the JWT Token from Local Storage
        const token = localStorage.getItem('token'); 

        if (!token) {
            setError('Authentication token missing. Please log in as admin.');
            setLoading(false);
            return;
        }

        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                // --- REAL API FETCH START ---
                const response = await fetch(GRAPHS_API_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                        // NEW: Use the standard Bearer format:
                       // 'Authorization': `Bearer ${token}` 
                    },
                });

                if (response.status === 401 || response.status === 403) {
                    throw new Error('Unauthorized access. Token might be invalid or expired.');
                }
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // CRITICAL CHECK: Ensure the response is JSON before parsing
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    const text = await response.text(); 
                    console.error("Non-JSON Response received:", text);
                    throw new Error("Server did not return JSON. Received HTML or plain text instead.");
                }

                const data = await response.json(); 
                
                setGraphData(data.monthlyData || []);
                setRecentUsers(data.recentUsers || []);
                setTopVendors(data.topVendors || []);
                setLoading(false);
                return; // Exit successfully
                // --- REAL API FETCH END ---

            } catch (err) {
                console.error(`Fetch attempt ${attempt + 1} failed for graphs:`, err.message);
                if (attempt === retries - 1) {
                    setError('Could not connect to the backend to load graphs and tables: ' + err.message);
                    setLoading(false);
                } else {
                    // Exponential backoff: Wait 1s, 2s, 4s... before retrying
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
                }
            }
        }
    };

    React.useEffect(() => {
        fetchDashboardData();
    }, []);
    
    // ... (Rest of the component's rendering logic remains the same)

    if (loading) {
        return <div className="text-center p-8 text-indigo-500 font-semibold">Loading Graphs and Tables...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500 font-semibold">Error: {error}</div>;
    }


    return (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-1 gap-6 items-stretch">
            
            {/* Graph Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Users & Vendors</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={graphData} 
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Users" fill="#8884d8" />
                            <Bar dataKey="Vendors" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tables Section */}
            <div className="flex flex-col gap-6 h-full">
                
                {/* Recent Users Table */}
                <div className="bg-white p-6 rounded-xl shadow-lg flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Users</h2>
                    <div className="overflow-x-auto flex-grow max-h-full overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentUsers.map((user, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Vendors Table */}
                <div className="bg-white p-6 rounded-xl shadow-lg flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Top Vendors</h2>
                    <div className="overflow-x-auto flex-grow max-h-full overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Sold</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {topVendors.map((vendor, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.itemsSold}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardGraphs;

















// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const GRAPHS_API_URL = '/api/user/admin/dashboard-graphs';

// const DashboardGraphs = () => {
//     // ... (State variables remain the same)
//     const [graphData, setGraphData] = React.useState([]);
//     const [recentUsers, setRecentUsers] = React.useState([]);
//     const [topVendors, setTopVendors] = React.useState([]);
//     const [loading, setLoading] = React.useState(true);
//     const [error, setError] = React.useState(null);

    

//     // Function to handle API fetching for all graph and table data
//     const fetchDashboardData = async (retries = 3) => {
//         setLoading(true);
//         setError(null);

//         // Retrieve the JWT Token from Local Storage
//         const token = localStorage.getItem('token'); 

//         if (!token) {
//             setError('Authentication token missing. Please log in as admin.');
//             setLoading(false);
//             return;
//         }

//         for (let attempt = 0; attempt < retries; attempt++) {
//             try {
//                 // --- REAL API FETCH START ---
//                 const response = await fetch(GRAPHS_API_URL, {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         // 🔑 ADD AUTHORIZATION HEADER HERE
//                         'Authorization': `Bearer ${token}` 
//                     },
//                 });

//                 if (response.status === 401 || response.status === 403) {
//                     throw new Error('Unauthorized access. Token might be invalid or expired.');
//                 }
                
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }

//                  // 💡 CRITICAL CHECK: Ensure the response is JSON before parsing
//             const contentType = response.headers.get("content-type");
//             if (!contentType || !contentType.includes("application/json")) {
//                 // If it's not JSON, assume it's the HTML error/redirect page
//                 const text = await response.text(); 
//                 console.error("Non-JSON Response received:", text);
//                 throw new Error("Server did not return JSON. Received HTML or plain text instead.");
//             }
                
//                 const data = await response.json(); 
                
//                 setGraphData(data.monthlyData || []);
//                 setRecentUsers(data.recentUsers || []);
//                 setTopVendors(data.topVendors || []);
//                 setLoading(false);
//                 return; // Exit successfully
//                 // --- REAL API FETCH END ---

//             } catch (err) {
//                 console.error(`Fetch attempt ${attempt + 1} failed for graphs:`, err.message);
//                 if (attempt === retries - 1) {
//                     setError('Could not connect to the backend to load graphs and tables: ' + err.message);
//                     setLoading(false);
//                 } else {
//                     await new Promise(resolve => setTimeout(resolve, 1000));
//                 }
//             }
//         }
//     };

//     React.useEffect(() => {
//         fetchDashboardData();
//     }, []);
    
//     // ... (Rest of the component's rendering logic remains the same)

//     if (loading) {
//         return <div className="text-center p-8 text-indigo-500 font-semibold">Loading Graphs and Tables...</div>;
//     }

//     if (error) {
//         return <div className="text-center p-8 text-red-500 font-semibold">Error: {error}</div>;
//     }


//     return (
//         <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
//             {/* Graph Card */}
//             <div className="bg-white p-6 rounded-xl shadow-lg">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Users & Vendors</h2>
//                 <div className="h-80">
//                     <ResponsiveContainer width="100%" height="100%">
//                         <BarChart
//                             data={graphData} 
//                             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                         >
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="name" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="Users" fill="#8884d8" />
//                             <Bar dataKey="Vendors" fill="#82ca9d" />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>

//             {/* Tables Section */}
//             <div className="flex flex-col gap-6 h-full">
                
//                 {/* Recent Users Table */}
//                 <div className="bg-white p-6 rounded-xl shadow-lg flex-1 flex flex-col">
//                     <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Users</h2>
//                     <div className="overflow-x-auto flex-grow max-h-full overflow-y-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50 sticky top-0">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {recentUsers.map((user, index) => (
//                                     <tr key={index}>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* Top Vendors Table */}
//                 <div className="bg-white p-6 rounded-xl shadow-lg flex-1 flex flex-col">
//                     <h2 className="text-xl font-bold text-gray-800 mb-4">Top Vendors</h2>
//                     <div className="overflow-x-auto flex-grow max-h-full overflow-y-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50 sticky top-0">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Sold</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {topVendors.map((vendor, index) => (
//                                     <tr key={index}>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.name}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.itemsSold}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DashboardGraphs;

















// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const data = [
//     { name: 'Jan', Users: 400, Vendors: 240 },
//     { name: 'Feb', Users: 300, Vendors: 139 },
//     { name: 'Mar', Users: 200, Vendors: 980 },
//     { name: 'Apr', Users: 278, Vendors: 390 },
//     { name: 'May', Users: 189, Vendors: 480 },
//     { name: 'Jun', Users: 239, Vendors: 380 },
//     { name: 'Jul', Users: 349, Vendors: 430 },
// ];

// const recentUsers = [
//     { name: 'John Doe', email: 'john@example.com', registrationDate: '2023-01-15' },
//     { name: 'Jane Smith', email: 'jane@example.com', registrationDate: '2023-01-18' },
//     { name: 'Sam Wilson', email: 'sam@example.com', registrationDate: '2023-01-20' },
// ];

// const topVendors = [
//     { name: 'Tech Solutions Inc.', itemsSold: 120, revenue: '$15,000' },
//     { name: 'Gadget Gurus', itemsSold: 95, revenue: '$12,500' },
//     { name: 'Quick Fix Repairs', itemsSold: 80, revenue: '$9,800' },
// ];

// const DashboardGraphs = () => {
//     return (
//         <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Graph Card */}
//             <div className="bg-white p-6 rounded-xl shadow-lg">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Users & Vendors</h2>
//                 <div className="h-80">
//                     <ResponsiveContainer width="100%" height="100%">
//                         <BarChart
//                             data={data}
//                             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                         >
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="name" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="Users" fill="#8884d8" />
//                             <Bar dataKey="Vendors" fill="#82ca9d" />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>

//             {/* Tables Section */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 {/* Recent Users Table */}
//                 <div className="bg-white p-6 rounded-xl shadow-lg">
//                     <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Users</h2>
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {recentUsers.map((user, index) => (
//                                     <tr key={index}>
//                                         <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* Top Vendors Table */}
//                 <div className="bg-white p-6 rounded-xl shadow-lg">
//                     <h2 className="text-xl font-bold text-gray-800 mb-4">Top Vendors</h2>
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Sold</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {topVendors.map((vendor, index) => (
//                                     <tr key={index}>
//                                         <td className="px-6 py-4 whitespace-nowrap">{vendor.name}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap">{vendor.itemsSold}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DashboardGraphs;