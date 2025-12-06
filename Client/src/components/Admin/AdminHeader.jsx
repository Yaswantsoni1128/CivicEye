import React from 'react';
import { motion } from 'framer-motion';
import { Bell, User } from 'lucide-react';

const AdminHeader = ({ user }) => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50"
    >
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="/fix_my_locality.png"
            alt="Fix My Locality Logo"
            className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 rounded-full shadow-lg mb-3 sm:mb-4 border-2 sm:border-4 border-green-400 bg-white"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Fix My Locality Management System</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </motion.button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <User className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminHeader;
