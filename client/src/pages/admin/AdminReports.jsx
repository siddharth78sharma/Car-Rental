import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { BiUser, BiWallet, BiCar, BiHourglass, BiCheckCircle } from "react-icons/bi";
import toast from 'react-hot-toast';

// Helper component for Report Cards
const StatCard = ({ icon: Icon, title, value, colorClass }) => (
    <div className={`p-6 rounded-xl shadow-lg flex items-center justify-between ${colorClass} text-white`}>
        <div className="flex flex-col">
            <h3 className="text-sm font-semibold opacity-80">{title}</h3>
            <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <Icon size={40} className="opacity-70" />
    </div>
);

const AdminReports = () => {
    const { axios, currency, getAdminDashboardStats, getAdminDashboardGraphs } = useAppContext();
    const [stats, setStats] = useState({});
    const [graphsData, setGraphsData] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch all necessary data for the report
    const fetchReportData = async () => {
        setLoading(true);
        try {
            // Fetch Statistics (e.g., total counts)
            const statsResponse = await axios.get('/api/user/admin/dashboard/stats');
            if (statsResponse.data.success) {
                setStats(statsResponse.data);
            } else {
                toast.error("Failed to fetch statistics.");
            }

            // Fetch Graphs/Table Data (e.g., monthly trends, top vendors)
            const graphsResponse = await axios.get('/api/user/admin/dashboard/graphs');
            if (graphsResponse.data.success) {
                setGraphsData(graphsResponse.data);
            } else {
                toast.error("Failed to fetch graph data.");
            }

        } catch (error) {
            console.error("Report Data Error:", error);
            toast.error("Error fetching admin reports data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div className="p-8 text-center text-lg">Loading Reports...</div>;
    }

    // Destructure data for easy access
    const { totalUsers, totalVendors, totalItems, totalRevenue, totalBookings, pendingBookings, confirmedBookings } = stats;
    const { monthlyData = [], recentUsers = [], topVendors = [] } = graphsData;

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8 print:hidden">
                <h1 className="text-4xl font-extrabold text-gray-900">Admin Reports</h1>
                {/* <button
                    onClick={handlePrint}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                    <BiFileText className="inline mr-2" size={20} /> Generate PDF/Print
                </button> */}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-2xl space-y-10">
                <div className="text-center pb-4 border-b print:block hidden">
                    <h2 className="text-3xl font-bold">Rental Service Report - {new Date().toLocaleDateString()}</h2>
                </div>

                {/* Report Section 1: Key Performance Indicators (KPIs) */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">1. Key Statistics Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                            icon={BiWallet} 
                            title="Total Revenue" 
                            value={`${currency}${totalRevenue?.toLocaleString() || 0}`} 
                            colorClass="bg-green-600" 
                        />
                        <StatCard 
                            icon={BiCar} 
                            title="Total Items" 
                            value={totalItems?.toLocaleString() || 0} 
                            colorClass="bg-purple-600" 
                        />
                        <StatCard 
                            icon={BiUser} 
                            title="Total Users" 
                            value={totalUsers?.toLocaleString() || 0} 
                            colorClass="bg-indigo-600" 
                        />
                        <StatCard 
                            icon={BiUser} 
                            title="Total Vendors" 
                            value={totalVendors?.toLocaleString() || 0} 
                            colorClass="bg-orange-600" 
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                        <StatCard 
                            icon={BiHourglass} 
                            title="Pending Bookings" 
                            value={pendingBookings?.toLocaleString() || 0} 
                            colorClass="bg-yellow-600" 
                        />
                        <StatCard 
                            icon={BiCheckCircle} 
                            title="Confirmed/Completed Bookings" 
                            value={confirmedBookings?.toLocaleString() || 0} 
                            colorClass="bg-blue-600" 
                        />
                    </div>
                </section>

                {/* Report Section 2: User/Vendor Trend */}
                <section className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">2. Monthly User & Vendor Growth</h2>
                    {monthlyData.length > 0 ? (
                        <div className="p-4 border rounded-lg bg-gray-50 text-center">
                            <p className="font-medium text-lg text-gray-700 mb-2">User/Vendor Count by Month (Last 12 Months)</p>
                            {/* In a real app, you would render a BarChart component here */}
                            <div className="h-64 flex items-end justify-around p-2">
                                {monthlyData.map(data => (
                                    <div key={data.name} className="flex flex-col items-center mx-2 h-full justify-end">
                                        <div 
                                            style={{ height: `${data.Users * 10}%` }} 
                                            className="w-8 bg-indigo-400 opacity-70 rounded-t-sm" 
                                            title={`Users: ${data.Users}`}
                                        ></div>
                                        <div 
                                            style={{ height: `${data.Vendors * 10}%` }} 
                                            className="w-8 bg-orange-400 mt-1 rounded-t-sm"
                                            title={`Vendors: ${data.Vendors}`}
                                        ></div>
                                        <span className="text-xs mt-1 text-gray-600">{data.name}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-4">
                                (Visual representation of Monthly User and Vendor sign-ups. Users max height: 
                                <span className="text-indigo-600"> Indigo</span>, Vendors max height: 
                                <span className="text-orange-600"> Orange</span>)
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-500">No monthly user data available for charting.</p>
                    )}
                </section>

                {/* Report Section 3: Tables (Recent Activity & Top Vendors) */}
                <section className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">3. Activity and Performance Tables</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Recent Users Table */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3">Recent User Registrations</h3>
                            {recentUsers.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentUsers.map((user, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.registrationDate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-500">No recent users found.</p>
                            )}
                        </div>

                        {/* Top Vendors Table */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3">Top Performing Vendors (By Items Listed)</h3>
                            {topVendors.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items Listed</th>
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
                            ) : (
                                <p className="text-gray-500">No top vendors found.</p>
                            )}
                        </div>
                    </div>
                </section>
                
                {/* Print Footer */}
                <footer className="text-center text-xs text-gray-500 pt-8 print:block hidden">
                    <p>Report generated on {new Date().toLocaleString()} by the Rental Service Admin System.</p>
                </footer>

            </div>
        </div>
    );
};

export default AdminReports;