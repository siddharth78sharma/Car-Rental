import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader'; // Ensure this import exists

const AdminLayout = () => {
    return (
        <div className="flex bg-gray-50 min-h-screen">
            <AdminSidebar />
            <div className="flex-1 flex flex-col md:ml-64">
                <AdminHeader />
                <main className="p-6 flex-1 overflow-y-auto">
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;