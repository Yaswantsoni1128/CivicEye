import React from 'react'
import {Routes , Route} from 'react-router-dom'

const WorkerRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/worker/dashboard" element={<WorkerDashboard />} />
        <Route path="/worker/profile" element={<WorkerProfile />} />
      </Routes>
    </div>
  )
}

export default WorkerRoutes;