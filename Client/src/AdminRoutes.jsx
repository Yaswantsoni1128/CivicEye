import React from 'react'
import {Routes , Route} from 'react-router-dom'

const AdminRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Routes>
    </div>
  )
}

export default AdminRoutes;
