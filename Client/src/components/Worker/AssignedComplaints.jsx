import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Eye, 
  Play,
  CheckCircle,
  Clock,
  AlertTriangle,
  Camera,
  RefreshCw,
  Upload,
  X
} from 'lucide-react';
import { fetchAssignedComplaints, startComplaint, resolveComplaint, setEstimatedResolutionDate } from '../../lib/api';
import toast from 'react-hot-toast';
import axios from 'axios';

const AssignedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveData, setResolveData] = useState({ proofPhotoUrl: '' });
  const [proofPhotoFile, setProofPhotoFile] = useState(null);
  const [proofPhotoPreview, setProofPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showEtaModal, setShowEtaModal] = useState(false);
  const [etaDate, setEtaDate] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [complaints, searchTerm, statusFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetchAssignedComplaints();
      if (response?.data?.complaints) {
        setComplaints(response.data.complaints);
      } else {
        setComplaints([]); // ensure empty array if none
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = complaints;

    if (searchTerm) {
      filtered = filtered.filter(complaint => 
        complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(complaint => complaint.status === statusFilter);
    }

    setFilteredComplaints(filtered);
  };

  const handleStartComplaint = async (complaintId) => {
    try {
      await startComplaint(complaintId);
      toast.success('Complaint started successfully');
      fetchComplaints();
    } catch (error) {
      console.error('Error starting complaint:', error);
      toast.error('Failed to start complaint');
    }
  };

  const handleResolveComplaint = async () => {
    if (!proofPhotoFile) {
      toast.error('Please upload a proof photo');
      return;
    }

    try {
      setUploadingPhoto(true);
      
      // Step 1: Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", proofPhotoFile);
      formData.append("upload_preset", "civicEye_uploads");

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
        formData
      );

      const proofPhotoUrl = uploadRes.data.secure_url;

      // Step 2: Resolve complaint with the uploaded photo URL
      await resolveComplaint(selectedComplaint._id, { proofPhotoUrl });
      toast.success('Complaint resolved successfully');
      setShowResolveModal(false);
      setResolveData({ proofPhotoUrl: '' });
      setProofPhotoFile(null);
      setProofPhotoPreview(null);
      fetchComplaints();
    } catch (error) {
      console.error('Error resolving complaint:', error);
      toast.error(error?.response?.data?.message || 'Failed to resolve complaint');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleProofPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }

      setProofPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProofPhoto = () => {
    setProofPhotoFile(null);
    setProofPhotoPreview(null);
  };

  const handleSaveEta = async () => {
    if (!selectedComplaint) return;
    if (!etaDate) {
      toast.error('Please select a date');
      return;
    }
    try {
      await setEstimatedResolutionDate(selectedComplaint._id, etaDate);
      toast.success('Estimated date saved');
      setShowEtaModal(false);
      setEtaDate('');
      fetchComplaints();
    } catch (error) {
      console.error('Error saving ETA:', error);
      toast.error(error?.message || 'Failed to save estimated date');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'received':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-20"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-full"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Assigned Complaints</h1>
          <button
            onClick={fetchComplaints}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 w-full max-w-full overflow-x-hidden">
          <div className="flex flex-col lg:flex-row gap-4 w-full">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="received">Received</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List or Empty States */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-full overflow-x-hidden">
          {/* Case: No assigned complaints at all */}
          {complaints.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No assigned complaints</h2>
              <p className="text-sm text-gray-500 mb-4">There are no complaints assigned to you right now.</p>
              <div className="flex items-center justify-center">
                <button
                  onClick={fetchComplaints}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Case: Assigned complaints exist but filters/search yield no results */}
              {filteredComplaints.length === 0 ? (
                <div className="text-center py-12">
                  <AlertTriangle className="mx-auto mb-4 w-12 h-12 text-gray-400" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">No complaints match your search</h2>
                  <p className="text-sm text-gray-500 mb-4">Try clearing the search or filters to see assigned complaints.</p>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('');
                      }}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Clear filters
                    </button>
                    <button
                      onClick={fetchComplaints}
                      className="ml-3 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Complaint
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ETA
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reporter
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredComplaints.map((complaint, index) => (
                        <motion.tr
                          key={complaint._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {complaint.title || 'Untitled Complaint'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {complaint.description?.substring(0, 50)}...
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{complaint.type}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getStatusIcon(complaint.status)}
                              <span className="ml-2 text-sm text-gray-900 capitalize">{complaint.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {complaint.estimatedResolutionDate
                              ? new Date(complaint.estimatedResolutionDate).toLocaleDateString()
                              : <span className="text-gray-500">Not set</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                              {complaint.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {complaint.user?.name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {complaint.status === 'received' && (
                                <button
                                  onClick={() => handleStartComplaint(complaint._id)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Start Complaint"
                                >
                                  <Play className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedComplaint(complaint);
                                  setEtaDate(complaint.estimatedResolutionDate ? complaint.estimatedResolutionDate.split('T')[0] : '');
                                  setShowEtaModal(true);
                                }}
                                className="text-yellow-600 hover:text-yellow-900"
                                title={complaint.estimatedResolutionDate ? "Update ETA" : "Set ETA"}
                              >
                                <Clock className="w-4 h-4" />
                              </button>
                              {complaint.status === 'in_progress' && (
                                <button
                                  onClick={() => {
                                    setSelectedComplaint(complaint);
                                    setProofPhotoFile(null);
                                    setProofPhotoPreview(null);
                                    setResolveData({ proofPhotoUrl: '' });
                                    setShowResolveModal(true);
                                  }}
                                  className="text-green-600 hover:text-green-900"
                                  title="Resolve Complaint"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button className="text-gray-600 hover:text-gray-900" title="View Details">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Resolve Modal */}
        {showResolveModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md my-auto max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg font-semibold mb-4">Resolve Complaint</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proof Photo *
                  </label>
                  
                  {proofPhotoPreview ? (
                    <div className="relative mb-2">
                      <img
                        src={proofPhotoPreview}
                        alt="Proof photo preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={handleRemoveProofPhoto}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProofPhotoChange}
                        className="hidden"
                        id="proof-photo-upload"
                      />
                      <label htmlFor="proof-photo-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <Camera className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Click to upload proof photo
                          </p>
                          <p className="text-xs text-gray-500">
                            Upload a photo showing the completed work
                          </p>
                        </div>
                      </label>
                    </div>
                  )}
                  
                  {proofPhotoFile && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selected: {proofPhotoFile.name}
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowResolveModal(false);
                      setProofPhotoFile(null);
                      setProofPhotoPreview(null);
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={uploadingPhoto}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResolveComplaint}
                    disabled={!proofPhotoFile || uploadingPhoto}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {uploadingPhoto ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Resolve
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ETA Modal */}
        {showEtaModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md my-auto max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg font-semibold mb-4">Estimated resolution date</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select date
                  </label>
                  <input
                    type="date"
                    value={etaDate}
                    onChange={(e) => setEtaDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Let the citizen know when you expect to complete this.
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowEtaModal(false);
                      setEtaDate('');
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEta}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Save ETA
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AssignedComplaints;
