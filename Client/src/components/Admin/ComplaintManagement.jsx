import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye, 
  UserPlus,
  Pencil,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { fetchAllComplaints, assignComplaint, updateComplaint } from '../../lib/api';
import toast from 'react-hot-toast';

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    priority: ''
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [assignData, setAssignData] = useState({ workerId: '' });
  const [updateData, setUpdateData] = useState({ status: '', priority: '', type: '' });

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [complaints, searchTerm, filters]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetchAllComplaints(filters);
      if (response?.data?.complaints) {
        setComplaints(response.data.complaints);
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

    if (filters.status) {
      filtered = filtered.filter(complaint => complaint.status === filters.status);
    }

    if (filters.type) {
      filtered = filtered.filter(complaint => complaint.type === filters.type);
    }

    if (filters.priority) {
      filtered = filtered.filter(complaint => complaint.priority === filters.priority);
    }

    setFilteredComplaints(filtered);
  };

  const handleAssign = async () => {
    try {
      await assignComplaint(selectedComplaint._id, assignData);
      toast.success('Complaint assigned successfully');
      setShowAssignModal(false);
      fetchComplaints();
    } catch (error) {
      console.error('Error assigning complaint:', error);
      toast.error('Failed to assign complaint');
    }
  };

  const handleUpdate = async () => {
    try {
      await updateComplaint(selectedComplaint._id, updateData);
      toast.success('Complaint updated successfully');
      setShowUpdateModal(false);
      fetchComplaints();
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('Failed to update complaint');
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
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Complaint Management</h1>
          <button
            onClick={fetchComplaints}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
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
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="received">Received</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Types</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="sanitation">Sanitation</option>
                <option value="traffic">Traffic</option>
                <option value="other">Other</option>
              </select>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
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
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
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
                          {complaint.title || complaint.type || 'Untitled Complaint'}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {complaint.assignedTo?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setShowAssignModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Assign Complaint"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setShowUpdateModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Update Complaint"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
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
        </div>

        {/* Assign Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">Assign Complaint</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Worker
                  </label>
                  <select
                    value={assignData.workerId}
                    onChange={(e) => setAssignData({ ...assignData, workerId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select a worker</option>
                    <option value="worker1">Worker 1</option>
                    <option value="worker2">Worker 2</option>
                    <option value="worker3">Worker 3</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssign}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Update Modal */}
        {showUpdateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">Update Complaint</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={updateData.status}
                    onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select status</option>
                    <option value="received">Received</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={updateData.priority}
                    onChange={(e) => setUpdateData({ ...updateData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Update
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

export default ComplaintManagement;
