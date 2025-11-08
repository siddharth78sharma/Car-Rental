import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Services from './pages/Services';
import MyBookings from './pages/MyBookings';
import Layout from './pages/owner/Layout';
import Dashboard from './pages/owner/Dashboard';
import AddCar from './pages/owner/AddCar';
import ManageCars from './pages/owner/ManageCars';
import ManageBookings from './pages/owner/ManageBookings';
import Login from './components/Login';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';
import AboutUs from './pages/AboutUs';
import Help from './pages/Help';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/Policy';
import ContactUs from './pages/ContactUs';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ViewItem from './pages/owner/ViewItem';
import EditItem from './pages/owner/EditItem';
import AdminLayout from './components/admin/AdminLayout'; // FIX: Corrected path
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminItems from './pages/admin/AdminItems'; // New Admin Routes
import AdminOrders from './pages/admin/AdminOrders'; 
import AdminUsers from './pages/admin/AdminUsers';
import AdminVendors from './pages/admin/AdminVendors';
import AdminSettings from './pages/admin/AdminSettings';
import Profile from './pages/Profile';
import VendorSettings from './pages/owner/VendorSettings';
import AdminReports from './pages/admin/AdminReports';
import BookingDetails from './pages/BookingDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import BookingDetail from './pages/owner/BookingDetails';


// Component to scroll to the top of the page on route change.
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

const App = () => {
    // We only need showLogin from the context
    const { showLogin } = useAppContext();
    const location = useLocation();

    // Check if the current path is for an owner or admin
    const isDashboardPath = location.pathname.startsWith('/owner') || location.pathname.startsWith('/admin');

    return (
        <>
            <ScrollToTop />
            <Toaster />

            {/* Render Login modal if showLogin is true */}
            {showLogin && <Login />}

            {/* Hide Navbar and Footer on admin and owner dashboard paths */}
            {!isDashboardPath && <Navbar />}

            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/car-details/:id' element={<CarDetails />} />
                <Route path='/Services' element={<Services />} />
                <Route path='/my-bookings' element={<MyBookings />} />
                <Route path='/about' element={<AboutUs />} />
                <Route path='/help' element={<Help />} />
                <Route path='/terms' element={<Terms />} />
                <Route path='/privacy' element={<PrivacyPolicy />} />
                <Route path='/contact-us' element={<ContactUs />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/booking-details/:itemId" element={<BookingDetails />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/login" element={<Login />} />




                {/* Owner Dashboard Routes */}
                <Route path='/owner' element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="add-items" element={<AddCar />} />
                    <Route path="manage-items" element={<ManageCars />} />
                    <Route path="items/view/:itemId" element={<ViewItem />} />
                    <Route path="items/edit/:itemId" element={<EditItem />} />
                    <Route path="manage-bookings" element={<ManageBookings />} />
                    <Route path='settings' element={<VendorSettings />} />
                    <Route path="bookings/view/:id" element={<BookingDetail />} />

                </Route>

                {/* Admin Dashboard Routes */}
                <Route path='/admin' element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="items" element={<AdminItems />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="vendors" element={<AdminVendors />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="reports" element={<AdminReports />} />
                    {/* Add more routes for other admin pages here */}
                </Route>
            
            </Routes>

            {!isDashboardPath && <Footer />}
        </>
    );
};

export default App;