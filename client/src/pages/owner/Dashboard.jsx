// import React, { useEffect, useState } from 'react';
// import { assets } from '../../assets/assets';
// import { useAppContext } from '../../context/AppContext';
// import toast from 'react-hot-toast';
// import Loader from '../../components/Loader';

// const Dashboard = () => {
//     const { axios, isOwner, currency } = useAppContext();
//     const [loading, setLoading] = useState(true);

//     const [data, setData] = useState({
//         totalItems: 0,
//         totalBookings: 0,
//         pendingBookings: 0,
//         confirmedBookings: 0,
//         recentBookings: [],
//         monthlyRevenue: 0,
//     });

//     const DashboardCards = [
//         { title: "Total Items", value: data.totalItems, icon: assets.itemIconColored },
//         { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
//         { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored },
//         { title: "Confirmed", value: data.confirmedBookings, icon: assets.listIconColored },
//     ];

//     const fetchDashboardData = async () => {
//         try {
//             const response = await axios.get('/api/owner/dashboard');
//             if (response.data.success) {
//                 setData(response.data.dashboardData);
//                 toast.success("Dashboard data loaded successfully.");
//             } else {
//                 toast.error(response.data.message || "Failed to fetch dashboard data. Please check your backend.");
//             }
//         } catch (error) {
//             toast.error("Failed to fetch dashboard data. Please check your backend.");
//         } finally {
//             setLoading(false);
//         }
//     };

       
//     // Function to handle status changes and refresh the dashboard
//     const handleChangeStatus = async (bookingId, newStatus) => {
//         setMessage('');
//         try {
//             const response = await mockApi.post('/api/owner/change-status', { bookingId, status: newStatus });
//             if (response.data.success) {
//                 setMessage("Booking status updated successfully!");
//                 // Crucial step: Re-fetch the data to update the dashboard
//                 await fetchDashboardData();
//             } else {
//                 setMessage(response.data.message || "Failed to update booking status.");
//             }
//         } catch (error) {
//             setMessage("Failed to update booking status.");
//         }
//     };

//     useEffect(() => {
//         if (isOwner) {
//             fetchDashboardData();
//         } else {
//             setLoading(false);
//         }
//     }, [isOwner, axios]);

//     if (loading) {
//         return <Loader />;
//     }

//     return (
//         <div className='flex-1 p-6 md:p-10 bg-gray-100 font-sans text-gray-800 min-h-screen'>
//             {/* Header Section */}
//             <header className='mb-10'>
//                 <h1 className='text-3xl font-bold'>Dashboard</h1>
//             </header>

//             {/* Dashboard Cards Section */}
//             <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
//                 {DashboardCards.map((card, index) => (
//                     <div key={index} className='bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center'>
//                         <div className='flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3'>
//                             <img src={card.icon} alt={card.title} className='h-6 w-6 text-blue-500' />
//                         </div>
//                         <h2 className='text-lg font-semibold text-gray-600'>{card.title}</h2>
//                         <p className='text-3xl font-bold text-gray-900 mt-1'>{card.value}</p>
//                     </div>
//                 ))}
//             </section>

//             {/* Recent Bookings and Monthly Revenue Section */}
//             <section className='flex flex-col lg:flex-row gap-6'>
//                 {/* Recent Bookings Table */}
//                 <div className='bg-white rounded-xl shadow-md p-6 flex-1'>
//                     <h2 className='text-xl font-bold mb-4'>Recent Bookings</h2>
//                     <div className='overflow-x-auto'>
//                         <table className='min-w-full divide-y divide-gray-200'>
//                             <thead className='bg-gray-50'>
//                                 <tr>
//                                     <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Item</th>
//                                     <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Date</th>
//                                     <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Amount</th>
//                                     <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
//                                     <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className='bg-white divide-y divide-gray-200'>
//                                 {data.recentBookings.length > 0 ? data.recentBookings.map((booking, index) => (
//                                     <tr key={index}>
//                                         <td className='px-6 py-4 whitespace-nowrap'>{booking.car?.brand} {booking.car?.model}</td>
//                                         <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{new Date(booking.createdAt).toLocaleDateString()}</td>
//                                         <td className='px-6 py-4 whitespace-nowrap font-medium text-gray-900'>{currency}{booking.price}</td>
//                                         <td className='px-6 py-4 whitespace-nowrap'>
//                                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                                                 {booking.status}
//                                             </span>
//                                         </td>
//                                          <td className='px-6 py-4 whitespace-nowrap'>
//                                             {booking.status !== 'confirmed' && (
//                                                 <button
//                                                     onClick={() => handleChangeStatus(booking._id, 'confirmed')}
//                                                     className='text-blue-600 hover:text-blue-900 font-bold'
//                                                 >
//                                                     Confirm
//                                                 </button>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 )) : (
//                                     <tr>
//                                         <td colSpan="4" className='px-6 py-4 text-center text-gray-500'>No recent bookings.</td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* Monthly Revenue Card */}
//                 <div className='bg-white rounded-xl shadow-md p-6 w-full lg:w-1/3 flex flex-col justify-between'>
//                     <div>
//                         <h2 className='text-xl font-bold mb-2'>Monthly Revenue</h2>
//                         <p className='text-gray-500 text-sm'>Revenue for the current month</p>
//                     </div>
//                     <div className='text-center'>
//                         <p className='text-5xl font-extrabold text-blue-600 mt-6'>{currency}{data.monthlyRevenue}</p>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// };

// export default Dashboard;



















import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { motion } from 'motion/react';

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext();
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    totalItems: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const DashboardCards = [
    { title: "Total Items", value: data.totalItems, icon: assets.itemIconColored, color: 'bg-blue-500/10 text-blue-600' },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored, color: 'bg-green-500/10 text-green-600' },
    { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored, color: 'bg-yellow-500/10 text-yellow-600' },
    { title: "Confirmed", value: data.confirmedBookings, icon: assets.listIconColored, color: 'bg-purple-500/10 text-purple-600' },
  ];

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/owner/dashboard');
      if (response.data.success) {
        setData(response.data.dashboardData);
      } else {
        toast.error(response.data.message || "Failed to fetch dashboard data.");
      }
    } catch (error) {
      toast.error("Error loading dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (bookingId, newStatus) => {
    try {
      const response = await axios.post('/api/owner/change-status', { bookingId, status: newStatus });
      if (response.data.success) {
        toast.success("Booking status updated!");
        fetchDashboardData();
      } else {
        toast.error(response.data.message || "Failed to update booking status.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    if (isOwner) fetchDashboardData();
    else setLoading(false);
  }, [isOwner]);

  if (loading) return <Loader />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      className='flex-1 p-6 md:p-10 bg-gray-50 text-gray-800 min-h-screen'
    >
        <div className="card p-6 rounded-xl shadow-md">
      {/* Header */}
      <header className='mb-10 text-center md:text-left'>
        <h1 className='text-3xl font-bold text-gray-800'>Owner Dashboard</h1>
        <p className='text-gray-500 mt-1'>Manage your rentals, bookings, and revenue</p>
      </header>

      {/* Dashboard Cards */}
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
        {DashboardCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className='bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 flex flex-col items-center text-center'
          >
            <div className={`flex items-center justify-center w-14 h-14 rounded-full ${card.color} mb-3`}>
              <img src={card.icon} alt={card.title} className='h-7 w-7' />
            </div>
            <h2 className='text-lg font-semibold text-gray-600'>{card.title}</h2>
            <p className='text-3xl font-extrabold text-gray-900 mt-1'>{card.value}</p>
          </motion.div>
        ))}
      </section>

      {/* Recent Bookings + Revenue */}
      <section className='flex flex-col lg:flex-row gap-6'>
        {/* Recent Bookings */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className='bg-white rounded-2xl shadow-md p-6 flex-1'
        >
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-bold'>Recent Bookings</h2>
            <span className='text-sm text-gray-500'>Latest 5 bookings</span>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Item</th>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Date</th>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Amount</th>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Status</th>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {data.recentBookings.length > 0 ? (
                  data.recentBookings.map((booking, i) => (
                    <tr key={i} className='hover:bg-gray-50 transition'>
                      <td className='px-6 py-4 font-medium text-gray-800'>{booking.car?.brand} {booking.car?.model}</td>
                      <td className='px-6 py-4 text-gray-600 text-sm'>{new Date(booking.createdAt).toLocaleDateString()}</td>
                      <td className='px-6 py-4 text-gray-800 font-semibold'>{currency}{booking.price}</td>
                      <td className='px-6 py-4'>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        {booking.status !== 'confirmed' && (
                          <button
                            onClick={() => handleChangeStatus(booking._id, 'confirmed')}
                            className='text-blue-600 font-semibold hover:text-blue-800 transition'
                          >
                            Confirm
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className='text-center text-gray-500 py-6'>
                      No recent bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Revenue Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
          className='bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg p-6 w-full lg:w-1/3 flex flex-col justify-between'
        >
          <div>
            <h2 className='text-2xl font-bold'>Monthly Revenue</h2>
            <p className='text-blue-100 text-sm mt-1'>Your total earnings this month</p>
          </div>
          <div className='text-center mt-6'>
            <motion.p 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
              className='text-5xl font-extrabold'
            >
              {currency}{data.monthlyRevenue}
            </motion.p>
          </div>
        </motion.div>
      </section>
      </div>
    </motion.div>
  );
};

export default Dashboard;
