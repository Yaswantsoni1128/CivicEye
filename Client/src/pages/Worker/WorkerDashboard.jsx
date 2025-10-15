import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  Home,
  ClipboardList,
  User,
  Menu,
  X,
  Loader2,
  LogOut,
  Bell,
  Settings,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { logout } from '../../lib/api.js';

import WorkerOverview from '../../components/Worker/WorkerOverview';
import AssignedComplaints from '../../components/Worker/AssignedComplaints';
import WorkerProfile from '../../components/Worker/WorkerProfile';

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState(null);

  const menuItems = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: <Home size={20} />, 
      path: '/worker/dashboard',
      description: 'Overview and performance'
    },
    { 
      id: 'complaints', 
      label: 'My Complaints', 
      icon: <ClipboardList size={20} />, 
      path: '/worker/dashboard',
      description: 'Manage assigned complaints'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: <User size={20} />, 
      path: '/worker/dashboard',
      description: 'Manage your account'
    },
  ];

  // Initialize user data and active section from URL
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Get current section from URL
    const currentPath = location.pathname;
    const currentSection = menuItems.find(item => item.path === currentPath);
    if (currentSection) {
      setActive(currentSection.id);
    } else {
      // Default to overview if no specific section
      navigate('/worker/dashboard');
      setActive('overview');
    }
  }, [location.pathname, navigate]);

  // Save active section to localStorage
  useEffect(() => {
    localStorage.setItem('lastActiveSection', active);
  }, [active]);

  // Navigation handler
  const handleNavigation = (item) => {
    setActive(item.id);
    navigate(item.path);
    setSidebarOpen(false);
  };

  // ------------------ LOGOUT HANDLER ------------------
  const logoutHandler = () => {
    setLoggingOut(true);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastActiveSection');

    logout()
      .then(() => {
        toast.success('Logged out successfully!');
        setTimeout(() => {
          window.location.href = '/login';
        }, 800);
      })
      .catch((err) => {
        console.error('Logout failed:', err);
        toast.error('Logout failed. Please try again.');
      })
      .finally(() => {
        setLoggingOut(false);
      });
  };

  const renderActiveSection = () => {
    switch (active) {
      case 'overview':
        return <WorkerOverview />;
      case 'complaints':
        return <AssignedComplaints />;
      case 'profile':
        return <WorkerProfile />;
      default:
        return <WorkerOverview />;
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col bg-white shadow-2xl w-80 h-screen fixed z-20 border-r border-gray-200">
          {/* Sidebar Header */}
          <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">CivicEye</h2>
                <p className="text-green-100 text-sm">Worker Panel</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name || 'Worker'}</h3>
                  <p className="text-sm text-gray-600">Field Worker</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-6 py-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                  ${active === item.id 
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25" 
                    : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${active === item.id ? "bg-white/20" : "bg-gray-100 group-hover:bg-gray-200"}`}>
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className={`text-xs ${active === item.id ? "text-green-100" : "text-gray-500"}`}>
                      {item.description}
                    </div>
                  </div>
                </div>
                {active === item.id && (
                  <ChevronRight className="w-5 h-5" />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={logoutHandler}
              disabled={loggingOut}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200
                ${loggingOut
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/25"
                }`}
            >
              {loggingOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <motion.aside
          initial={{ x: -320 }}
          animate={{ x: sidebarOpen ? 0 : -320 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed lg:hidden z-30 bg-white w-80 h-full shadow-2xl"
        >
          {/* Mobile Sidebar Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">CivicEye</h2>
                  <p className="text-green-100 text-xs">Worker Panel</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                  ${active === item.id 
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg" 
                    : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${active === item.id ? "bg-white/20" : "bg-gray-100"}`}>
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className={`text-xs ${active === item.id ? "text-green-100" : "text-gray-500"}`}>
                      {item.description}
                    </div>
                  </div>
                </div>
                {active === item.id && (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            ))}
          </nav>

          {/* Mobile Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logoutHandler}
              disabled={loggingOut}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200
                ${loggingOut
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
                }`}
            >
              {loggingOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </>
              )}
            </button>
          </div>
        </motion.aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-80">
          {/* Header */}
          <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button 
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {menuItems.find((i) => i.id === active)?.label}
                </h1>
                <p className="text-sm text-gray-600">
                  {menuItems.find((i) => i.id === active)?.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow-xl rounded-2xl p-6 lg:p-8 min-h-[600px]"
              >
                {renderActiveSection()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
};

export default WorkerDashboard;
