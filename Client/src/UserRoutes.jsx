import React from 'react'
import {Routes , Route} from 'react-router-dom'

const UserRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/profile" element={<UserProfile />} />
      </Routes>
    </div>
  )
}

export default UserRoutes;