import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, CheckCircle, AlertCircle, XCircle, Search, X, User, Calendar, FileImage, Zap, Star } from "lucide-react";
import { fetchUserComplaints, submitRating } from "../../lib/api.js";
import toast from "react-hot-toast";

export default function TrackSection() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

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

  // Get display status based on complaint state
  const getDisplayStatus = (complaint) => {
    if (complaint.status === "resolved") {
      return "resolved";
    }
    if (complaint.assignedTo) {
      return "in_progress";
    }
    return "pending";
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          complaint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const displayStatus = getDisplayStatus(complaint);
    const matchesFilter = filterStatus === "all" || displayStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatDateTime = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getTimelineStatus = (complaint) => {
    if (!complaint.resolvedAt || !complaint.estimatedResolutionDate) {
      return null;
    }
    const resolvedDate = new Date(complaint.resolvedAt);
    const etaDate = new Date(complaint.estimatedResolutionDate);
    const diffDays = Math.floor((resolvedDate - etaDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'early', label: 'Early', color: 'green', days: Math.abs(diffDays) };
    } else if (diffDays === 0) {
      return { status: 'ontime', label: 'On Time', color: 'green', days: 0 };
    } else {
      return { status: 'late', label: 'Delayed', color: 'red', days: diffDays };
    }
  };

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowTimelineModal(true);
  };

  const handleRatingSubmit = async (rating) => {
    if (!selectedComplaint) return;
    
    try {
      setSubmittingRating(true);
      await submitRating(selectedComplaint._id, rating);
      toast.success("Rating submitted successfully!");
      
      // Update the complaint in the list
      setComplaints(prevComplaints =>
        prevComplaints.map(c =>
          c._id === selectedComplaint._id ? { ...c, rating } : c
        )
      );
      
      // Update selected complaint
      setSelectedComplaint({ ...selectedComplaint, rating });
    } catch (error) {
      toast.error(error?.message || "Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

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
            <motion.div
              key={complaint._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handleComplaintClick(complaint)}
              className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
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
                    {getStatusIcon(getDisplayStatus(complaint))}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(getDisplayStatus(complaint))}`}>
                      {getDisplayStatus(complaint) === "pending" ? "Pending" : 
                       getDisplayStatus(complaint) === "in_progress" ? "In Progress" : 
                       "Resolved"}
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

                {/* Original Complaint Photo */}
                {complaint.photoUrl && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-2 font-medium">Complaint Photo</p>
                    <img
                      src={complaint.photoUrl}
                      alt="Complaint evidence"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {/* Assigned Worker / ETA */}
                {complaint.assignedTo ? (
                  <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 space-y-2">
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
                    <div className="text-xs text-gray-700">
                      {complaint.estimatedResolutionDate ? (
                        <span>
                          Estimated resolution:{" "}
                          <span className="font-semibold">
                            {new Date(complaint.estimatedResolutionDate).toLocaleDateString()}
                          </span>
                        </span>
                      ) : (
                        <span className="text-gray-500">Worker has not provided an ETA yet.</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600">
                    No worker assigned yet. We will notify you once it is assigned.
                  </div>
                )}

                {/* Rating Section for Resolved Complaints */}
                {complaint.status === "resolved" && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    {complaint.rating ? (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-gray-900">
                          Your Rating: {complaint.rating}/5
                        </span>
                        <div className="flex gap-0.5 ml-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= complaint.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600 mb-2">
                        Rate the resolution quality
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Timeline Modal */}
      {showTimelineModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedComplaint.title || selectedComplaint.type || "Complaint Timeline"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    ID: #{selectedComplaint._id?.slice(-6).toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => setShowTimelineModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Timeline Content */}
            <div className="px-6 py-6">
              {/* Status Badge */}
              {selectedComplaint.resolvedAt && selectedComplaint.estimatedResolutionDate && (
                <div className="mb-6">
                  {(() => {
                    const timelineStatus = getTimelineStatus(selectedComplaint);
                    if (timelineStatus) {
                      return (
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                          timelineStatus.color === 'green' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          <Zap className={`w-4 h-4 ${timelineStatus.color === 'green' ? 'text-green-600' : 'text-red-600'}`} />
                          <span className="font-semibold text-sm">
                            {timelineStatus.label}
                            {timelineStatus.days > 0 && ` by ${timelineStatus.days} day${timelineStatus.days > 1 ? 's' : ''}`}
                            {timelineStatus.days < 0 && ` by ${timelineStatus.days} day${Math.abs(timelineStatus.days) > 1 ? 's' : ''}`}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}

              {/* Timeline */}
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-green-200 to-blue-200"></div>

                <div className="space-y-8">
                  {/* 1. Complaint Registered */}
                  <div className="relative flex items-start gap-4">
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">Complaint Registered</h3>
                        </div>
                        {selectedComplaint.createdAt && (() => {
                          const dt = formatDateTime(selectedComplaint.createdAt);
                          return (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{dt.date} at {dt.time}</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* 2. Assigned to Worker */}
                  {selectedComplaint.assignedTo ? (
                    <div className="relative flex items-start gap-4">
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">Assigned to Worker</h3>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-xs">
                                  {selectedComplaint.assignedTo.name?.charAt(0) || "W"}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{selectedComplaint.assignedTo.name}</p>
                                {selectedComplaint.assignedTo.phone && (
                                  <p className="text-xs text-gray-600">{selectedComplaint.assignedTo.phone}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-start gap-4 opacity-50">
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <h3 className="font-semibold text-gray-500">Not Yet Assigned</h3>
                          <p className="text-sm text-gray-400 mt-1">Waiting for assignment...</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. ETA Date Received */}
                  {selectedComplaint.estimatedResolutionDate ? (
                    <div className="relative flex items-start gap-4">
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">ETA Date Received</h3>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium text-gray-900">
                                {formatDateTime(selectedComplaint.estimatedResolutionDate)?.date}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Expected resolution date provided by worker
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-start gap-4 opacity-50">
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <h3 className="font-semibold text-gray-500">ETA Not Set</h3>
                          <p className="text-sm text-gray-400 mt-1">Worker has not provided an ETA yet</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Resolved with Photo */}
                  {selectedComplaint.resolvedAt ? (
                    <div className="relative flex items-start gap-4">
                      <div className="relative z-10 flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                          getTimelineStatus(selectedComplaint)?.color === 'red' 
                            ? 'bg-red-500' 
                            : 'bg-green-500'
                        }`}>
                          <FileImage className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <div className={`rounded-xl p-4 border ${
                          getTimelineStatus(selectedComplaint)?.color === 'red'
                            ? 'bg-red-50 border-red-100'
                            : 'bg-green-50 border-green-100'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">Resolved with Proof Photo</h3>
                          </div>
                          <div className="space-y-3">
                            {selectedComplaint.resolvedAt && (() => {
                              const dt = formatDateTime(selectedComplaint.resolvedAt);
                              return (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  <span>{dt.date} at {dt.time}</span>
                                </div>
                              );
                            })()}
                            {selectedComplaint.proofPhotoUrl && (
                              <div>
                                <img
                                  src={selectedComplaint.proofPhotoUrl}
                                  alt="Resolution proof"
                                  className="w-full h-48 object-cover rounded-lg border-2 border-green-200 shadow-sm"
                                />
                              </div>
                            )}
                            {selectedComplaint.estimatedResolutionDate && getTimelineStatus(selectedComplaint) && (
                              <div className={`text-xs px-3 py-2 rounded-lg ${
                                getTimelineStatus(selectedComplaint).color === 'red'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {getTimelineStatus(selectedComplaint).status === 'early' && (
                                  <span>✓ Completed {Math.abs(getTimelineStatus(selectedComplaint).days)} day{Math.abs(getTimelineStatus(selectedComplaint).days) > 1 ? 's' : ''} before ETA</span>
                                )}
                                {getTimelineStatus(selectedComplaint).status === 'ontime' && (
                                  <span>✓ Completed exactly on time</span>
                                )}
                                {getTimelineStatus(selectedComplaint).status === 'late' && (
                                  <span>⚠ Completed {getTimelineStatus(selectedComplaint).days} day{getTimelineStatus(selectedComplaint).days > 1 ? 's' : ''} after ETA</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-start gap-4 opacity-50">
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <FileImage className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <h3 className="font-semibold text-gray-500">Not Yet Resolved</h3>
                          <p className="text-sm text-gray-400 mt-1">Waiting for resolution...</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. Rating Section */}
                  {selectedComplaint.status === "resolved" && (
                    <div className="relative flex items-start gap-4">
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                          <Star className="w-6 h-6 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-semibold text-gray-900">Rate the Resolution</h3>
                          </div>
                          {selectedComplaint.rating ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-5 h-5 ${
                                        star <= selectedComplaint.rating
                                          ? "text-yellow-500 fill-yellow-500"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-semibold text-gray-900">
                                  {selectedComplaint.rating}/5
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">Thank you for your feedback!</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-sm text-gray-600">
                                How would you rate the quality of this resolution?
                              </p>
                              <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRatingSubmit(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    disabled={submittingRating}
                                    className="transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Star
                                      className={`w-8 h-8 transition-colors ${
                                        star <= (hoveredRating || 0)
                                          ? "text-yellow-500 fill-yellow-500"
                                          : "text-gray-300 hover:text-yellow-400"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                              {submittingRating && (
                                <p className="text-xs text-gray-500">Submitting rating...</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

