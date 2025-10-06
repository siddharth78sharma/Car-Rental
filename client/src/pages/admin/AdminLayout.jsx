import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
