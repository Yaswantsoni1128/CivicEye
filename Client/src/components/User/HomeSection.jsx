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
  MessageSquare
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
          Welcome to CivicEye
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

      {/* Recent Activity */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-lg p-4 shadow-md border border-gray-100"
      >
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Complaint #ABC123 resolved</p>
              <p className="text-xs text-gray-600">Street light repair completed</p>
            </div>
            <span className="text-xs text-gray-500">2h ago</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New complaint submitted</p>
              <p className="text-xs text-gray-600">Pothole on Main Street</p>
            </div>
            <span className="text-xs text-gray-500">1d ago</span>
          </div>
        </div>
      </motion.div> */}
    </motion.div>
  );
}
