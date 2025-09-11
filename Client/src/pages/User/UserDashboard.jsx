import React, { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Home,
  MapPin,
  FileText,
  ClipboardList,
  Menu,
  User,
  X,
  Loader2, // spinner icon
} from "lucide-react";
import { logout } from "../../lib/api.js";

import HomeSection from "../../components/User/HomeSection.jsx";
import TrackSection from "../../components/User/TrackSection.jsx";
import ReportComplaintSection from "../../components/User/ReportComplaintSection.jsx";
import MyComplaintsSection from "../../components/User/MyComplaintsSection.jsx";
import ProfileSection from "../../components/User/ProfileSection.jsx";

export const UserDashboard = () => {
  const [active, setActive] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const menuItems = [
    { id: "home", label: "Home", icon: <Home size={20} /> },
    { id: "track", label: "Track", icon: <MapPin size={20} /> },
    { id: "report", label: "Report Complaint", icon: <FileText size={20} /> },
    { id: "my-complaints", label: "My Complaints", icon: <ClipboardList size={20} /> },
    { id: "profile", label: "Profile", icon: <User size={20} /> },
  ];

  // ------------------ LOGOUT HANDLER ------------------
  const logoutHandler = () => {
    setLoggingOut(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    logout()
      .then(() => {
        toast.success("Logged out successfully!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 800);
      })
      .catch((err) => {
        console.error("Logout failed:", err);
        toast.error("Logout failed. Please try again.");
      })
      .finally(() => {
        setLoggingOut(false);
      });
  };

  // ------------------ JSX ------------------
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex bg-green-50">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col bg-green-700 text-white w-64 h-screen fixed z-20">
          <div className="px-6 py-4 border-b border-green-600">
            <h2 className="text-lg font-bold">User Panel</h2>
          </div>

          <nav className="p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition text-left
                  ${active === item.id ? "bg-green-600" : "hover:bg-green-600"}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          transition={{ duration: 0.25 }}
          className="fixed md:hidden z-30 bg-green-700 text-white w-64 h-full"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-green-600">
            <h2 className="text-lg font-bold">User Panel</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <nav className="p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActive(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition text-left
                  ${active === item.id ? "bg-green-600" : "hover:bg-green-600"}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </motion.aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-20 md:hidden"
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:ml-64">
          {/* Header */}
          <header className="h-16 bg-green-600 text-white flex items-center justify-between px-4 sm:px-6 md:px-8 shadow">
            <div className="flex items-center">
              <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu size={24} />
              </button>
              <h1 className="ml-4 text-xl font-semibold">
                {menuItems.find((i) => i.id === active)?.label}
              </h1>
            </div>
            <button
              className={`px-3 py-1 rounded-lg transition flex items-center gap-2
                ${loggingOut
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              onClick={logoutHandler}
              disabled={loggingOut}
            >
              {loggingOut ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Logging out...
                </>
              ) : (
                "Logout"
              )}
            </button>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 bg-green-50 overflow-y-auto">
            <div className="bg-white shadow rounded-xl p-6">
              {active === "home" && <HomeSection setActive={setActive} />}
              {active === "track" && <TrackSection />}
              {active === "report" && <ReportComplaintSection />}
              {active === "my-complaints" && <MyComplaintsSection />}
              {active === "profile" && <ProfileSection />}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
