import { motion } from "framer-motion";
import { 
  MapPin, 
  FileText, 
  ClipboardList, 
  User, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Users,
  MessageSquare,
  Calendar,
  XCircle
} from "lucide-react";

export default function HomeSection({ setActive }) {
  const sections = [
    { 
      id: "track", 
      label: "Track Issues", 
      description: "Monitor complaint status",
      icon: <MapPin className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    { 
      id: "report", 
      label: "Report Issue", 
      description: "Submit new complaint",
      icon: <FileText className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    { 
      id: "my-complaints", 
      label: "My Complaints", 
      description: "View all complaints",
      icon: <ClipboardList className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    },
    { 
      id: "profile", 
      label: "Profile", 
      description: "Manage account",
      icon: <User className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
  ];

  // Mock stats data - in real app, this would come from API
  const stats = [
    { label: "Total Complaints", value: "12", icon: <BarChart3 className="w-5 h-5" />, color: "text-blue-600" },
    { label: "Resolved", value: "8", icon: <CheckCircle className="w-5 h-5" />, color: "text-green-600" },
    { label: "In Progress", value: "3", icon: <Clock className="w-5 h-5" />, color: "text-yellow-600" },
    { label: "Pending", value: "1", icon: <AlertTriangle className="w-5 h-5" />, color: "text-red-600" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Welcome Header */}
      <div className="text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          Welcome to Fix My Locality
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-600 max-w-xl mx-auto"
        >
          Your dashboard for civic engagement. Track issues, report problems, and make your community better.
        </motion.p>
      </div>

      {/* Stats Cards */}
      {/* <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div> */}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              onClick={() => setActive(section.id)}
              className={`${section.bgColor} rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all duration-300 group relative overflow-hidden`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className={`${section.textColor} mb-3 group-hover:scale-105 transition-transform duration-300`}>
                  {section.icon}
                </div>
                <h3 className={`text-base font-bold ${section.textColor} mb-1`}>
                  {section.label}
                </h3>
                <p className="text-gray-600 text-xs">
                  {section.description}
                </p>
              </div>
              
              {/* Hover arrow */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${section.color} flex items-center justify-center`}>
                  <span className="text-white text-xs">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Issues Overview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6"
      >
        {/* Left Side - This Week & This Month Issues */}
        <div className="space-y-6">
          {/* This Week Issues */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">This Week Issues</h3>
            </div>
            
            <div className="space-y-4">
              {/* Mock data for this week */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Pothole on Main Street</p>
                    <p className="text-xs text-gray-600">Submitted 2 days ago</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  In Progress
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Street Light Repair</p>
                    <p className="text-xs text-gray-600">Submitted 4 days ago</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Resolved
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Garbage Collection Issue</p>
                    <p className="text-xs text-gray-600">Submitted 5 days ago</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                  Pending
                </span>
              </div>
            </div>
          </motion.div>

          {/* This Month Issues */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">This Month Issues</h3>
            </div>
            
            <div className="space-y-4">
              {/* Mock data for this month */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Water Leakage Report</p>
                    <p className="text-xs text-gray-600">Submitted 1 week ago</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Resolved
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Traffic Signal Malfunction</p>
                    <p className="text-xs text-gray-600">Submitted 2 weeks ago</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  In Progress
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Road Repair Request</p>
                    <p className="text-xs text-gray-600">Submitted 3 weeks ago</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Resolved
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Total Complaints Count */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg border border-green-400"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-white/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Total Complaints</h3>
          </div>
          
          <div className="space-y-4">
            {/* Resolved */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-200" />
                  <span className="text-sm font-medium text-white">Resolved</span>
                </div>
                <span className="text-2xl font-bold text-white">8</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-green-200 h-2 rounded-full" style={{ width: '66.67%' }}></div>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-200" />
                  <span className="text-sm font-medium text-white">In Progress</span>
                </div>
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-yellow-200 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-200" />
                  <span className="text-sm font-medium text-white">Pending</span>
                </div>
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-orange-200 h-2 rounded-full" style={{ width: '8.33%' }}></div>
              </div>
            </div>

            {/* Rejected */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-200" />
                  <span className="text-sm font-medium text-white">Rejected</span>
                </div>
                <span className="text-2xl font-bold text-white">0</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-red-200 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>

          {/* Total Count */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <p className="text-sm text-green-100 mb-1">Total</p>
              <p className="text-4xl font-bold text-white">12</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
