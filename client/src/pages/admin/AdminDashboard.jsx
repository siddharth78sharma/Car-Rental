import React from 'react';
import DashboardStats from '../../components/admin/DashboardStats';
import DashboardGraphs from '../../components/admin/DashboardGraphs';

const AdminDashboard = () => {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            
            {/* Main Stats Cards */}
            <DashboardStats />

            {/* Graphs and Tables Section */}
            <DashboardGraphs />
        </div>
    );
};

export default AdminDashboard;