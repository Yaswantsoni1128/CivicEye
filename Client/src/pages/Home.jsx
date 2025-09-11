import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
    const navigation = useNavigate();
  navigation("/login");
  }, []);
  return (
    <div>
      Home Page
    </div>
  )
}

export default Home
