// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Smart Complaint System</h1>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/reportComplain">Report</Link>
        <Link to="/track">Track</Link>
        <Link to="/notifications">Notifications</Link>
      </div>
    </nav>
  );
}
