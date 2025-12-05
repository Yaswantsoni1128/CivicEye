import React, { useState, useEffect, useMemo } from 'react';
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
  RefreshCw,
  ClipboardList,
  Sparkles,
  ArrowUpRight,
  Loader2,
  TrendingUp,
  Users,
  X,
  User,
  Calendar,
  FileImage,
  Zap,
  Star
} from 'lucide-react';
import { fetchAllComplaints, assignComplaint, updateComplaint, fetchWorkers } from '../../lib/api';
import toast from 'react-hot-toast';

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    priority: ''
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [assignData, setAssignData] = useState({ workerId: '' });
  const [updateData, setUpdateData] = useState({ status: '', priority: '', type: '' });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchComplaints();
    fetchWorkersList();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [complaints, searchTerm, filters]);

  const fetchComplaints = async () => {
    try {
      if (complaints.length === 0) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      const response = await fetchAllComplaints(filters);
      if (response?.data?.complaints) {
        setComplaints(response.data.complaints);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchWorkersList = async () => {
    try {
      setLoadingWorkers(true);
      const response = await fetchWorkers();
      if (response?.data?.workers) {
        setWorkers(response.data.workers);
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
      toast.error('Failed to load workers');
    } finally {
      setLoadingWorkers(false);
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
    if (!assignData.workerId) {
      toast.error('Please select a worker');
      return;
    }
    try {
      await assignComplaint(selectedComplaint._id, assignData);
      toast.success('Complaint assigned successfully');
      setShowAssignModal(false);
      setAssignData({ workerId: '' });
      fetchComplaints();
    } catch (error) {
      console.error('Error assigning complaint:', error);
      toast.error(error?.message || 'Failed to assign complaint');
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
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const stats = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const inProgress = complaints.filter(c => c.status === 'in_progress').length;
    const pending = complaints.filter(c => c.status === 'received').length;
    const assigned = complaints.filter(c => c.assignedTo).length;
    const unassigned = total - assigned;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return {
      total,
      resolved,
      inProgress,
      pending,
      assigned,
      unassigned,
      resolutionRate
    };
  }, [complaints]);

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-3xl mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-green-600 text-white px-8 py-10 shadow-2xl"
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_transparent_55%)]" />
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/20 blur-3xl rounded-full" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/15 backdrop-blur text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 mr-2" />
              Complaint Control Center
            </div>
            <div>
              <h1 className="text-4xl font-bold leading-tight">Complaint Management Hub</h1>
              <p className="text-white/80 mt-3 text-lg">
                Monitor, assign, and track all citizen complaints in real-time.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 rounded-2xl px-4 py-3">
                <p className="text-sm text-white/70">Total complaints</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-white/10 rounded-2xl px-4 py-3">
                <p className="text-sm text-white/70">Resolution rate</p>
                <p className="text-3xl font-bold">{stats.resolutionRate}%</p>
              </div>
              <div className="bg-white/10 rounded-2xl px-4 py-3">
                <p className="text-sm text-white/70">Pending review</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchComplaints}
              className="inline-flex items-center px-6 py-3 rounded-2xl bg-white/15 backdrop-blur border border-white/20 font-semibold hover:bg-white/25 transition"
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Sync data
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5 bg-green-50 border border-green-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-green-600 font-medium">Total Complaints</p>
            <ClipboardList className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-2">All time complaints</p>
        </div>

        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 font-medium">Resolved</p>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.resolved}</p>
          <div className="mt-3">
            <div className="flex items-center text-xs uppercase tracking-wide text-gray-400">
              <span className="w-24">Progress</span>
              <span>{stats.resolutionRate}%</span>
            </div>
            <div className="mt-2 h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${stats.resolutionRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 font-medium">In Progress</p>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.inProgress}</p>
          <p className="text-xs text-gray-500 mt-2">Being worked on</p>
        </div>

        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 font-medium">Unassigned</p>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.unassigned}</p>
          <p className="text-xs text-gray-500 mt-2">Need assignment</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, description, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilters({ ...filters, status: '' })}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition border ${
                !filters.status
                  ? 'bg-green-50 text-green-700 border-green-100'
                  : 'text-gray-500 border-transparent hover:bg-gray-50'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setFilters({ ...filters, status: 'received' })}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition border ${
                filters.status === 'received'
                  ? 'bg-red-50 text-red-700 border-red-100'
                  : 'text-gray-500 border-transparent hover:bg-gray-50'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilters({ ...filters, status: 'in_progress' })}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition border ${
                filters.status === 'in_progress'
                  ? 'bg-yellow-50 text-yellow-700 border-yellow-100'
                  : 'text-gray-500 border-transparent hover:bg-gray-50'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilters({ ...filters, status: 'resolved' })}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition border ${
                filters.status === 'resolved'
                  ? 'bg-green-50 text-green-700 border-green-100'
                  : 'text-gray-500 border-transparent hover:bg-gray-50'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <ArrowUpRight className="w-4 h-4 text-green-500" />
          Viewing {filteredComplaints.length} complaint{filteredComplaints.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 backdrop-blur">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Complaint
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ETA
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 mx-auto mb-4 animate-spin text-green-500" />
                    Loading complaints...
                  </td>
                </tr>
              ) : filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                    <ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No complaints found</p>
                    <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((complaint, index) => (
                  <motion.tr
                    key={complaint._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-gray-50/70"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {complaint.title || complaint.type || 'Untitled Complaint'}
                        </p>
                        {complaint.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-xs">
                            {complaint.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {complaint.type || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(complaint.status)}
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {complaint.status?.replace('_', ' ') || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {complaint.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {complaint.assignedTo.name}
                            </span>
                            {complaint.assignedTo.averageRating > 0 && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs text-gray-600">
                                  {complaint.assignedTo.averageRating.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {complaint.estimatedResolutionDate ? (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(complaint.estimatedResolutionDate)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(complaint.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setAssignData({ workerId: complaint.assignedTo?._id || '' });
                            setShowAssignModal(true);
                          }}
                          className="inline-flex items-center px-3 py-1.5 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                          title="Assign Complaint"
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Assign
                        </button>
                        <button
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setUpdateData({
                              status: complaint.status || '',
                              priority: complaint.priority || '',
                              type: complaint.type || ''
                            });
                            setShowUpdateModal(true);
                          }}
                          className="inline-flex items-center px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
                          title="Update Complaint"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setShowDetailsModal(true);
                          }}
                          className="inline-flex items-center px-3 py-1.5 rounded-xl border border-green-200 text-green-600 hover:bg-green-50 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Assign Complaint</h3>
              {selectedComplaint && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    Assigning: <span className="font-medium text-gray-900">{selectedComplaint.title || selectedComplaint.type || 'Complaint'}</span>
                  </p>
                  {selectedComplaint.estimatedResolutionDate && (
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      ETA: <span className="font-medium text-gray-900">{formatDate(selectedComplaint.estimatedResolutionDate)}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Worker
                </label>
                {loadingWorkers ? (
                  <div className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-500 text-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading workers...
                  </div>
                ) : (
                  <select
                    value={assignData.workerId}
                    onChange={(e) => setAssignData({ ...assignData, workerId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a worker</option>
                    {workers
                      .filter(worker => worker.status !== 'inactive')
                      .map((worker) => (
                        <option key={worker._id} value={worker._id}>
                          {worker.name} {worker.phone ? `(${worker.phone})` : ''}
                          {worker.assignedCount > 0 ? ` - ${worker.assignedCount} assigned` : ''}
                        </option>
                      ))}
                  </select>
                )}
                {workers.filter(w => w.status !== 'inactive').length === 0 && !loadingWorkers && (
                  <p className="text-sm text-amber-600 mt-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    No active workers available. Please create workers first.
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setAssignData({ workerId: '' });
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!assignData.workerId || loadingWorkers}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Update Complaint</h3>
              {selectedComplaint && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    Updating: <span className="font-medium text-gray-900">{selectedComplaint.title || selectedComplaint.type || 'Complaint'}</span>
                  </p>
                  {selectedComplaint.estimatedResolutionDate && (
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      ETA: <span className="font-medium text-gray-900">{formatDate(selectedComplaint.estimatedResolutionDate)}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                >
                  Update
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Timeline Details Modal */}
      {showDetailsModal && selectedComplaint && (
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
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-sm text-gray-500">
                      ID: #{selectedComplaint._id?.slice(-6).toUpperCase()}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(selectedComplaint.priority)}`}>
                      {selectedComplaint.priority || '—'}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {selectedComplaint.status?.replace('_', ' ') || '—'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
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
                            {timelineStatus.days < 0 && ` by ${Math.abs(timelineStatus.days)} day${Math.abs(timelineStatus.days) > 1 ? 's' : ''}`}
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
                        {selectedComplaint.description && (
                          <p className="text-sm text-gray-600 mt-2">{selectedComplaint.description}</p>
                        )}
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
                                {selectedComplaint.assignedTo.email && (
                                  <p className="text-xs text-gray-600">{selectedComplaint.assignedTo.email}</p>
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
                </div>
              </div>

              {/* Rating Section */}
              {selectedComplaint.status === "resolved" && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Customer Rating
                  </h4>
                  {selectedComplaint.rating ? (
                    <div className="flex items-center gap-3">
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
                      <span className="text-lg font-semibold text-gray-900">
                        {selectedComplaint.rating}/5
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Customer has not rated this complaint yet</p>
                  )}
                </div>
              )}

              {/* Original Complaint Photo */}
              {selectedComplaint.photoUrl && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Original Complaint Photo</h4>
                  <img
                    src={selectedComplaint.photoUrl}
                    alt="Complaint evidence"
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}

              <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ComplaintManagement;

