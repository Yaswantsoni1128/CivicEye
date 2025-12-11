import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Trash2,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  createWorker,
  deleteWorker,
  fetchWorkers,
  updateWorker,
} from '../../lib/api';

const initialFormState = {
  name: '',
  phone: '',
  email: '',
  password: '',
  status: 'active',
};

const getInitials = (name = '') => {
  const parts = name.trim().split(' ');
  if (!parts.length) return 'W';
  return parts.map((p) => p[0]).slice(0, 2).join('').toUpperCase();
};

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const WorkerManagement = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create | edit
  const [formValues, setFormValues] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      if (workers.length === 0) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      const { data } = await fetchWorkers();
      setWorkers(data?.workers || []);
    } catch (error) {
      toast.error(error?.message || 'Failed to load workers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredWorkers = useMemo(() => {
    return workers
      .filter((worker) => {
        const target = `${worker.name} ${worker.email} ${worker.phone}`.toLowerCase();
        return target.includes(searchTerm.toLowerCase());
      })
      .filter((worker) => {
        if (statusFilter === 'all') return true;
        return worker.status === statusFilter;
      });
  }, [workers, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const assigned = workers.reduce(
      (sum, worker) => sum + (worker.assignedCount || 0),
      0
    );
    const completed = workers.reduce(
      (sum, worker) => sum + (worker.completedCount || 0),
      0
    );
    const active = workers.filter((worker) => worker.status !== 'inactive')
      .length;

    return {
      total: workers.length,
      active,
      assigned,
      completed,
    };
  }, [workers]);

  const topPerformers = useMemo(() => {
    return [...workers]
      .sort((a, b) => (b.completedCount || 0) - (a.completedCount || 0))
      .slice(0, 4);
  }, [workers]);

  const averageCompletionRate = useMemo(() => {
    if (!workers.length) return 0;
    const assigned = workers.reduce((sum, worker) => sum + (worker.assignedCount || 0), 0);
    if (!assigned) return 0;
    const completed = workers.reduce((sum, worker) => sum + (worker.completedCount || 0), 0);
    return Math.round((completed / assigned) * 100);
  }, [workers]);

  const statusFilters = [
    { value: 'all', label: 'All workers' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const complaintsPerActive =
    stats.active > 0 ? Math.max(1, Math.round(stats.assigned / stats.active)) : 0;

  const handleOpenCreate = () => {
    setModalMode('create');
    setModalOpen(true);
    setFormValues(initialFormState);
    setFormErrors({});
    setSelectedWorkerId(null);
  };

  const handleOpenEdit = (worker) => {
    setModalMode('edit');
    setSelectedWorkerId(worker._id);
    setFormValues({
      name: worker.name || '',
      phone: worker.phone || '',
      email: worker.email || '',
      password: '',
      status: worker.status || 'active',
    });
    setModalOpen(true);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.name.trim()) errors.name = 'Name is required';
    if (!formValues.phone.trim()) errors.phone = 'Phone is required';
    if (modalMode === 'create' && !formValues.password.trim()) {
      errors.password = 'Password is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const payload = {
        name: formValues.name.trim(),
        phone: formValues.phone.trim(),
        email: formValues.email.trim() || undefined,
        status: formValues.status,
      };
      if (formValues.password.trim()) {
        payload.password = formValues.password.trim();
      }

      if (modalMode === 'create') {
        await createWorker(payload);
        toast.success('Worker created successfully');
      } else if (selectedWorkerId) {
        await updateWorker(selectedWorkerId, payload);
        toast.success('Worker updated successfully');
      }

      setModalOpen(false);
      setFormValues(initialFormState);
      await loadWorkers();
    } catch (error) {
      toast.error(error?.message || 'Failed to save worker');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (worker) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${worker.name}?`
    );
    if (!confirmed) return;

    try {
      setDeleteLoadingId(worker._id);
      await deleteWorker(worker._id);
      toast.success('Worker deleted');
      await loadWorkers();
    } catch (error) {
      toast.error(error?.message || 'Failed to delete worker');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Simplified Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Worker Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage worker accounts and monitor performance</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadWorkers}
            className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Worker
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5 bg-green-50 border border-green-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-emerald-600 font-medium">Total workers</p>
            <Users className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-2">+{stats.active} currently active</p>
        </div>
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 font-medium">Cases in queue</p>
            <ClipboardList className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.assigned}</p>
          <div className="mt-3">
            <div className="flex items-center text-xs uppercase tracking-wide text-gray-400">
              <span className="w-24">Completion</span>
              <span>{averageCompletionRate}%</span>
            </div>
            <div className="mt-2 h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${averageCompletionRate}%` }}
              />
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 font-medium">Completed cases</p>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.completed}</p>
          <p className="text-xs text-gray-500 mt-2">Resolved in recent cycles</p>
        </div>
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 font-medium">Alerts</p>
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-4xl font-bold text-gray-900">
            {stats.assigned - stats.completed}
          </p>
          <p className="text-xs text-gray-500 mt-2">Open vs. resolved load</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition border ${
                  statusFilter === filter.value
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ArrowUpRight className="w-4 h-4 text-green-500" />
          Viewing {filteredWorkers.length} worker{filteredWorkers.length === 1 ? '' : 's'} ({statusFilter === 'all' ? 'all statuses' : `${statusFilter} only`})
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full max-h-[600px] overflow-y-auto">
          <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Worker
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Workload
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <Loader2 className="w-6 h-6 mx-auto mb-4 animate-spin text-green-500" />
                        Loading workers...
                      </td>
                    </tr>
                  ) : filteredWorkers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                        No workers found
                      </td>
                    </tr>
                  ) : (
                    filteredWorkers.map((worker, index) => {
                      const assigned = worker.assignedCount || 0;
                      const completed = worker.completedCount || 0;
                      const completionRate = assigned ? Math.round((completed / assigned) * 100) : 0;
                      return (
                        <tr
                          key={worker._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 font-semibold flex items-center justify-center text-sm">
                                {getInitials(worker.name)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{worker.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <p className="text-xs text-gray-400">
                                    ID: {worker._id?.slice(-6)}
                                  </p>
                                  {worker.averageRating > 0 && (
                                    <>
                                      <span className="text-xs text-gray-400">•</span>
                                      <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-xs font-semibold text-gray-700">
                                          {worker.averageRating.toFixed(1)}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <p className="font-medium text-gray-800">{worker.phone}</p>
                            <p className="text-xs text-gray-500">{worker.email || '—'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>{completed} completed</span>
                                <span>{assigned} assigned</span>
                              </div>
                              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-green-500"
                                  style={{ width: `${completionRate}%` }}
                                />
                              </div>
                              <p className="text-xs font-semibold text-green-600">
                                {completionRate}% completion
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                worker.status === 'inactive'
                                  ? 'bg-red-50 text-red-600'
                                  : 'bg-green-50 text-green-600'
                              }`}
                            >
                              {worker.status || 'active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(worker.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleOpenEdit(worker)}
                                className="inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition text-sm"
                              >
                                <Pencil className="w-4 h-4 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(worker)}
                                disabled={deleteLoadingId === worker._id}
                                className="inline-flex items-center px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-60 text-sm"
                              >
                                {deleteLoadingId === worker._id ? (
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4 mr-1" />
                                )}
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg w-full max-w-lg shadow-2xl my-auto max-h-[90vh] overflow-y-auto"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {modalMode === 'create' ? 'Add Worker' : 'Edit Worker'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {modalMode === 'create'
                  ? 'Create a new worker account and credentials.'
                  : 'Update worker contact info or status.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formValues.name}
                  onChange={(e) =>
                    setFormValues({ ...formValues, name: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.name ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formValues.phone}
                    onChange={(e) =>
                      setFormValues({ ...formValues, phone: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                      formErrors.phone ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    value={formValues.email}
                    onChange={(e) =>
                      setFormValues({ ...formValues, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formValues.status}
                    onChange={(e) =>
                      setFormValues({ ...formValues, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {modalMode === 'create'
                      ? 'Password'
                      : 'Password (leave blank to keep current)'}
                  </label>
                  <input
                    type="password"
                    value={formValues.password}
                    onChange={(e) =>
                      setFormValues({ ...formValues, password: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                      formErrors.password ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-70"
                >
                  {submitting ? (
                    <span className="inline-flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </span>
                  ) : modalMode === 'create' ? (
                    'Create Worker'
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default WorkerManagement;

