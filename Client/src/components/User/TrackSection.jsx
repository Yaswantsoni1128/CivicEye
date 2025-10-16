import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, CheckCircle, AlertCircle, XCircle, Search } from "lucide-react";
import { fetchUserComplaints } from "../../lib/api.js";
import toast from "react-hot-toast";

export default function TrackSection() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchUserComplaints()
      .then((res) => {
        if (res && res.data) {
          setComplaints(res.data.complaints || []);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch complaints:", err);
        toast.error("Failed to load complaints");
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          complaint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || complaint.status?.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading complaints...</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          Track Your Issues
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-600 max-w-xl mx-auto"
        >
          Monitor the status of your complaints and stay updated on progress
        </motion.p>
      </div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg p-4 shadow-md border border-gray-100"
      >
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search complaints by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </motion.div>

      {filteredComplaints.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {searchTerm || filterStatus !== "all" ? "No complaints found" : "No complaints yet"}
          </h3>
          <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
            {searchTerm || filterStatus !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Submit your first complaint to start tracking issues in your area"
            }
          </p>
          {!searchTerm && filterStatus === "all" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Report Your First Issue
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredComplaints.map((complaint, index) => (
            console.log(complaint),
            <motion.div
              key={complaint._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Header with status */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      {complaint.title || complaint.type || "Untitled Complaint"}
                    </h3>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {complaint.description || "No description provided"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(complaint.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                      {complaint.status || "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Location</p>
                      <p className="text-xs font-medium text-gray-900">
                        {complaint.location?.coordinates?.length === 2
                          ? `${complaint.location.coordinates[1].toFixed(4)}, ${complaint.location.coordinates[0].toFixed(4)}`
                          : "Not available"
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Submitted</p>
                      <p className="text-xs font-medium text-gray-900">
                        {complaint.createdAt 
                          ? new Date(complaint.createdAt).toLocaleDateString()
                          : "Not available"
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Complaint ID */}
                <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-500">Complaint ID</span>
                  <span className="font-mono text-xs font-semibold text-gray-700">
                    #{complaint._id?.slice(-6).toUpperCase()}
                  </span>
                </div>

                {/* Photo */}
                {complaint.photoUrl && (
                  <div className="mb-3">
                    <img
                      src={complaint.photoUrl}
                      alt="Complaint evidence"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {/* Assigned Worker */}
                {complaint.assignedTo && (
                  <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {complaint.assignedTo.name?.charAt(0) || "W"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{complaint.assignedTo.name}</p>
                        <p className="text-xs text-gray-600">{complaint.assignedTo.phone}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

