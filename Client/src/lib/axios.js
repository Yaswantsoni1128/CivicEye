import axios from "axios";

// Create a reusable Axios instance
const api = axios.create({     
  baseURL: import.meta.env.VITE_BACKEND_URL, 
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
