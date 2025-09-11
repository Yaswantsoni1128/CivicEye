import React from 'react'
import { BrowserRouter as Router} from 'react-router-dom'
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from './AppRoutes';


const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 bg-gray-100">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

