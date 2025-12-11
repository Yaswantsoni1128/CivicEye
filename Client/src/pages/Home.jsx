import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/login");
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Fix My Locality</h1>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  )
}

export default Home
