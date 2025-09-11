import React from 'react'
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PublicRoutes from './PublicRoutes.jsx';
import UserRoutes from './UserRoutes.jsx';
import WorkerRoutes from './WorkerRoutes.jsx';
import AdminRoutes from './AdminRoutes.jsx';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/user/*' element={<UserRoutes />} />
        <Route path='/worker/*' element={<WorkerRoutes />} />
        <Route path='/admin/*' element={<AdminRoutes />} />
        <Route path='/*' element={<PublicRoutes />} />
      </Routes>
    </Router>
  )
}

export default App

