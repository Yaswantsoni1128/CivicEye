import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchUserComplaints } from "../../lib/api.js"; // your API function
import toast, { Toaster } from "react-hot-toast";

export default function MyComplaintsSection() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserComplaints()
      .then((res) => {
        console.log(res.data);
        setComplaints(res.data.complaints || []);
      })
      .catch((err) => {
        console.error("Failed to fetch complaints:", err);
        toast.error("Failed to load your complaints.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
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
            My Complaints
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-600 max-w-xl mx-auto"
          >
            View and manage all your submitted complaints and their current status
          </motion.p>
        </div>

        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading your complaints...</p>
          </motion.div>
        ) : complaints.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No complaints yet</h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
              You haven't submitted any complaints yet. Start by reporting an issue in your community.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Report Your First Issue
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {complaints.map((complaint, index) => (
              <motion.div
                key={complaint._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Header */}
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
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        complaint.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {complaint.status || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Original Complaint Photo */}
                  {complaint.photoUrl && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-2 font-medium">Original Complaint Photo</p>
                      <img
                        src={complaint.photoUrl}
                        alt="Complaint evidence"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}

                  {/* Proof Photo (if resolved) */}
                  {complaint.proofPhotoUrl && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-2 font-medium flex items-center gap-1">
                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Resolution Proof Photo
                      </p>
                      <img
                        src={complaint.proofPhotoUrl}
                        alt="Resolution proof"
                        className="w-full h-48 object-cover rounded-lg border-2 border-green-200 shadow-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Work completed by {complaint.assignedTo?.name || 'worker'}
                        {complaint.resolvedAt && ` on ${new Date(complaint.resolvedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
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

                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Type</p>
                        <p className="text-xs font-medium text-gray-900">
                          {complaint.type || "General"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Complaint ID */}
                  <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-600">Complaint ID</span>
                    <span className="font-mono text-xs font-semibold text-gray-700">
                      #{complaint._id?.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  {/* Assigned Worker */}
                  {complaint.assignedTo ? (
                    <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            {complaint.assignedTo.name?.charAt(0) || "W"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Assigned Worker</p>
                          <p className="text-xs text-gray-600">{complaint.assignedTo.name}</p>
                          <p className="text-xs text-gray-500">{complaint.assignedTo.phone}</p>
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
                      No worker assigned yet. We will update this once it is assigned.
                    </div>
                  )}

                  {/* Priority */}
                  {complaint.priority && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-2">
                        <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-xs font-medium text-yellow-800">
                          Priority: {complaint.priority}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
}
