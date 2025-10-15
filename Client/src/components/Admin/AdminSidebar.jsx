import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  ClipboardDocumentListIcon, 
  UsersIcon, 
  Cog6ToothIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ activeSection, setActiveSection }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: HomeIcon },
    { id: 'complaints', label: 'Complaints', icon: ClipboardDocumentListIcon },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-16 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-40"
    >
      <div className="p-6">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;
