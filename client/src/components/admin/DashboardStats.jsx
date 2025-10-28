import React from 'react';
// Removed dependency on 'lucide-react' by using inline SVG icons instead.

// FIX: API URL uses '/api/user/' prefix to match server mounting: /api/user/admin/dashboard-stats
const STATS_API_URL = 'http://localhost:3000/api/user/admin/dashboard-stats';

const DashboardStats = () => {
    const [stats, setStats] = React.useState({
        totalUsers: 0,
        totalVendors: 0,
        totalItems: 0,
        totalRevenue: 0,
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
    });
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // Function to handle API fetching with exponential backoff
    const fetchDashboardStats = async (retries = 3) => {
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
                const response = await fetch(STATS_API_URL, {
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
                    // This error indicates a server routing or authentication fallback issue
                    throw new Error("Server did not return JSON. Received HTML or plain text instead.");
                }

                const data = await response.json(); 
                
                setStats(data);
                setLoading(false);
                return; // Exit successfully

            } catch (err) {
                console.error(`Fetch attempt ${attempt + 1} failed for stats:`, err.message);
                if (attempt === retries - 1) {
                    setError('Could not connect to the backend to load statistics: ' + err.message);
                    setLoading(false);
                } else {
                    // Exponential backoff: Wait 1s, 2s, 4s... before retrying
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
                }
            }
        }
    };

    React.useEffect(() => {
        fetchDashboardStats();
    }, []);
    
    // Icon components defined using inline SVGs to avoid package dependency
    const UserIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    );

    const StoreIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.24 2h9.52a2 2 0 0 1 1.83.59L22 7"/><path d="M12 22V7"/><path d="M5 22h14"/><path d="M10 11H8V7h2"/><path d="M16 11h-2V7h2"/><path d="M22 7H2"/><path d="M2 17h20"/><path d="M2 12h20"/></svg>
    );

    const PackageIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="m7.5 19.73 9-5.15"/><path d="M3.5 14.07V5.93"/><path d="M12 21.94V12.06"/><path d="M20.5 14.07V5.93"/><path d="m12 21.94-9-5.15"/><path d="m12 12.06 9 5.15"/><path d="m12 12.06-9-5.15"/><path d="m12 2.06 9 5.15"/></svg>
    );

    const DollarSignIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    );

    const ShoppingCartIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.58L23 6H6"/></svg>
    );

    const ClockIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    );

    const CheckCircleIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
    );


    const StatCard = ({ title, value, icon: Icon, gradientClass }) => (
        <div className={`
            flex items-center justify-between p-6 rounded-xl shadow-lg 
            text-white transform transition-transform duration-300 hover:scale-105
            ${gradientClass}
        `}>
            <div>
                <p className="text-sm font-semibold opacity-80">{title}</p>
                {/* Format revenue with a dollar sign */}
                <h3 className="text-3xl font-bold mt-1">{title.includes("Revenue") ? `₹${value.toLocaleString()}` : value.toLocaleString()}</h3>
            </div>
            {/* Render the icon component */}
            <div className="text-white text-4xl opacity-70">
                <Icon />
            </div>
        </div>
    );

    if (loading) {
        return <div className="text-center p-8 text-indigo-500 font-semibold">Loading Dashboard Statistics...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500 font-semibold">Error: {error}</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <StatCard 
                title="Total Users" 
                value={stats.totalUsers} 
                icon={UserIcon} // Updated to use inline SVG component
                gradientClass="bg-gradient-to-br from-indigo-500 to-indigo-700"
            />
            <StatCard 
                title="Total Vendors" 
                value={stats.totalVendors} 
                icon={StoreIcon} // Updated to use inline SVG component
                gradientClass="bg-gradient-to-br from-orange-500 to-orange-700"
            />
            <StatCard 
                title="Total Items" 
                value={stats.totalItems} 
                icon={PackageIcon} // Updated to use inline SVG component
                gradientClass="bg-gradient-to-br from-teal-500 to-teal-700"
            />
            <StatCard 
                title="Total Revenue" 
                value={stats.totalRevenue} 
                icon={DollarSignIcon} // Updated to use inline SVG component
                gradientClass="bg-gradient-to-br from-purple-500 to-purple-700"
            />
            <StatCard 
                title="Total Bookings" 
                value={stats.totalBookings} 
                icon={ShoppingCartIcon} // Updated to use inline SVG component
                gradientClass="bg-gradient-to-br from-pink-500 to-pink-700"
            />
            <StatCard 
                title="Pending Bookings" 
                value={stats.pendingBookings} 
                icon={ClockIcon} // Updated to use inline SVG component
                gradientClass="bg-gradient-to-br from-red-500 to-red-700"
            />
            <StatCard 
                title="Confirmed Bookings" 
                value={stats.confirmedBookings} 
                icon={CheckCircleIcon} // Updated to use inline SVG component
                gradientClass="bg-gradient-to-br from-emerald-500 to-emerald-700"
            />
        </div>
    );
};

export default DashboardStats;


















// import React from 'react';
// import { BiSolidUser, BiSolidPackage, BiDollarCircle } from "react-icons/bi";
// import { MdOutlineStoreMallDirectory, MdOutlineLocalShipping, MdOutlinePending, MdCheckCircleOutline } from "react-icons/md";

// const STATS_API_URL = '/api/user/admin/dashboard-stats';

// const DashboardStats = () => {
//     // ... (State variables remain the same)
//     const [stats, setStats] = React.useState({
//         totalUsers: 0,
//         totalVendors: 0,
//         totalItems: 0,
//         totalRevenue: 0,
//         totalBookings: 0,
//         pendingBookings: 0,
//         confirmedBookings: 0,
//     });
//     const [loading, setLoading] = React.useState(true);
//     const [error, setError] = React.useState(null);

//     // Function to handle API fetching with a simple retry mechanism
//     const fetchDashboardStats = async (retries = 3) => {
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
//                 // Replace the mock simulation with a real fetch call
//                 const response = await fetch(STATS_API_URL, {
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

//                 const data = await response.json(); 
                
//                 setStats(data);
//                 setLoading(false);
//                 return; // Exit successfully
//                 // --- REAL API FETCH END ---

//             } catch (err) {
//                 console.error(`Fetch attempt ${attempt + 1} failed for stats:`, err.message);
//                 if (attempt === retries - 1) {
//                     setError('Could not connect to the backend to load statistics: ' + err.message);
//                     setLoading(false);
//                 } else {
//                     await new Promise(resolve => setTimeout(resolve, 1000));
//                 }
//             }
//         }
//     };

//     React.useEffect(() => {
//         fetchDashboardStats();
//     }, []);
    
//     // ... (Rest of the component's rendering logic remains the same)

//     const StatCard = ({ title, value, icon, gradientClass }) => (
//         <div className={`
//             flex items-center justify-between p-6 rounded-xl shadow-lg 
//             text-white transform transition-transform duration-300 hover:scale-105
//             ${gradientClass}
//         `}>
//             <div>
//                 <p className="text-sm font-semibold opacity-80">{title}</p>
//                 {/* Format revenue with a dollar sign */}
//                 <h3 className="text-3xl font-bold mt-1">{title.includes("Revenue") ? `$${value.toLocaleString()}` : value.toLocaleString()}</h3>
//             </div>
//             <div className="text-white text-4xl opacity-70">
//                 {icon}
//             </div>
//         </div>
//     );

//     if (loading) {
//         return <div className="text-center p-8 text-indigo-500 font-semibold">Loading Dashboard Statistics...</div>;
//     }

//     if (error) {
//         return <div className="text-center p-8 text-red-500 font-semibold">Error: {error}</div>;
//     }

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             <StatCard 
//                 title="Total Users" 
//                 value={stats.totalUsers} 
//                 icon={<BiSolidUser />} 
//                 gradientClass="bg-gradient-to-br from-indigo-500 to-indigo-700"
//             />
//             <StatCard 
//                 title="Total Vendors" 
//                 value={stats.totalVendors} 
//                 icon={<MdOutlineStoreMallDirectory />} 
//                 gradientClass="bg-gradient-to-br from-orange-500 to-orange-700"
//             />
//             <StatCard 
//                 title="Total Items" 
//                 value={stats.totalItems} 
//                 icon={<BiSolidPackage />} 
//                 gradientClass="bg-gradient-to-br from-teal-500 to-teal-700"
//             />
//             <StatCard 
//                 title="Total Revenue" 
//                 value={stats.totalRevenue} 
//                 icon={<BiDollarCircle />} 
//                 gradientClass="bg-gradient-to-br from-purple-500 to-purple-700"
//             />
//             <StatCard 
//                 title="Total Bookings" 
//                 value={stats.totalBookings} 
//                 icon={<MdOutlineLocalShipping />} 
//                 gradientClass="bg-gradient-to-br from-pink-500 to-pink-700"
//             />
//             <StatCard 
//                 title="Pending Bookings" 
//                 value={stats.pendingBookings} 
//                 icon={<MdOutlinePending />} 
//                 gradientClass="bg-gradient-to-br from-red-500 to-red-700"
//             />
//             <StatCard 
//                 title="Confirmed Bookings" 
//                 value={stats.confirmedBookings} 
//                 icon={<MdCheckCircleOutline />} 
//                 gradientClass="bg-gradient-to-br from-emerald-500 to-emerald-700"
//             />
//         </div>
//     );
// };

// export default DashboardStats;














// import React from 'react';
// import { BiSolidUser, BiSolidPackage, BiDollarCircle } from "react-icons/bi";
// import { MdOutlineStoreMallDirectory, MdOutlineLocalShipping, MdOutlinePending, MdCheckCircleOutline } from "react-icons/md";
// import { useAppContext } from '../../context/AppContext';

// const DashboardStats = () => {
//     // You'll fetch the data and set these states from your backend
//     const [stats, setStats] = React.useState({
//         totalUsers: 0,
//         totalVendors: 0,
//         totalItems: 0,
//         totalRevenue: 0,
//         totalBookings: 0,
//         pendingBookings: 0,
//         confirmedBookings: 0,
//     });

//     const fetchDashboardStats = async () => {
//         // You would make an API call here to get the data
//     };

//     React.useEffect(() => {
//         fetchDashboardStats();
//     }, []);

//     const StatCard = ({ title, value, icon, gradientClass }) => (
//         <div className={`
//             flex items-center justify-between p-6 rounded-xl shadow-lg 
//             text-white transform transition-transform duration-300 hover:scale-105
//             ${gradientClass}
//         `}>
//             <div>
//                 <p className="text-sm font-semibold opacity-80">{title}</p>
//                 <h3 className="text-3xl font-bold mt-1">{value}</h3>
//             </div>
//             <div className="text-white text-4xl opacity-70">
//                 {icon}
//             </div>
//         </div>
//     );

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             <StatCard 
//                 title="Total Users" 
//                 value={stats.totalUsers} 
//                 icon={<BiSolidUser />} 
//                 gradientClass="bg-gradient-to-br from-indigo-500 to-indigo-700"
//             />
//             <StatCard 
//                 title="Total Vendors" 
//                 value={stats.totalVendors} 
//                 icon={<MdOutlineStoreMallDirectory />} 
//                 gradientClass="bg-gradient-to-br from-orange-500 to-orange-700"
//             />
//             <StatCard 
//                 title="Total Items" 
//                 value={stats.totalItems} 
//                 icon={<BiSolidPackage />} 
//                 gradientClass="bg-gradient-to-br from-teal-500 to-teal-700"
//             />
//             <StatCard 
//                 title="Total Revenue" 
//                 value={`$${stats.totalRevenue}`} 
//                 icon={<BiDollarCircle />} 
//                 gradientClass="bg-gradient-to-br from-purple-500 to-purple-700"
//             />
//             <StatCard 
//                 title="Total Bookings" 
//                 value={stats.totalBookings} 
//                 icon={<MdOutlineLocalShipping />} 
//                 gradientClass="bg-gradient-to-br from-pink-500 to-pink-700"
//             />
//             <StatCard 
//                 title="Pending Bookings" 
//                 value={stats.pendingBookings} 
//                 icon={<MdOutlinePending />} 
//                 gradientClass="bg-gradient-to-br from-red-500 to-red-700"
//             />
//             <StatCard 
//                 title="Confirmed Bookings" 
//                 value={stats.confirmedBookings} 
//                 icon={<MdCheckCircleOutline />} 
//                 gradientClass="bg-gradient-to-br from-emerald-500 to-emerald-700"
//             />
//         </div>
//     );
// };

// export default DashboardStats;