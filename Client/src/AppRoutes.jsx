import React from 'react'
import { BrowserRouter as Router , Route , Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ReportComplain from './pages/ReportComplain'
import Complain from './pages/Complain'

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/reportComplain" element={<ReportComplain/>} />
        <Route path="/complain/:id" element={<Complain />} />
      </Routes>
  )
}

export default AppRoutes