import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { fetchReports } from '../../lib/api';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    total: 0,
    resolved: 0,
    inProgress: 0,
    pending: 0,
    byType: [],
    byPriority: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetchReports();
      if (response?.data) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const getCompletionRate = () => {
    return analytics.total > 0 ? ((analytics.resolved / analytics.total) * 100).toFixed(1) : 0;
  };

  const getAverageResolutionTime = () => {
    // Mock data - replace with actual calculation
    return '2.3 days';
  };

  const getTrendData = () => {
    // Mock trend data - replace with actual API call
    return {
      complaints: [
        { day: 'Mon', count: 12 },
        { day: 'Tue', count: 19 },
        { day: 'Wed', count: 15 },
        { day: 'Thu', count: 22 },
        { day: 'Fri', count: 18 },
        { day: 'Sat', count: 8 },
        { day: 'Sun', count: 5 }
      ],
      resolution: [
        { day: 'Mon', count: 8 },
        { day: 'Tue', count: 12 },
        { day: 'Wed', count: 10 },
        { day: 'Thu', count: 15 },
        { day: 'Fri', count: 11 },
        { day: 'Sat', count: 6 },
        { day: 'Sun', count: 3 }
      ]
    };
  };

  const trendData = getTrendData();

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.total}</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12% from last week</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                <p className="text-3xl font-bold text-green-600">{getCompletionRate()}%</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+5% from last week</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Resolution Time</p>
                <p className="text-3xl font-bold text-blue-600">{getAverageResolutionTime()}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-4 flex items-center">
              <ArrowDownIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">-0.5 days from last week</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Complaints</p>
                <p className="text-3xl font-bold text-red-600">{analytics.pending}</p>
              </div>
              <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
            </div>
            <div className="mt-4 flex items-center">
              <ArrowDownIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">-8% from last week</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Complaints Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints Trend</h3>
            <div className="space-y-3">
              {trendData.complaints.map((item, index) => (
                <div key={item.day} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.day}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(item.count / 25) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Resolution Trend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution Trend</h3>
            <div className="space-y-3">
              {trendData.resolution.map((item, index) => (
                <div key={item.day} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.day}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(item.count / 20) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Complaints by Type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints by Type</h3>
            <div className="space-y-4">
              {analytics.byType.map((type, index) => (
                <div key={type._id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{type._id}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(type.count / Math.max(...analytics.byType.map(t => t.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{type.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Complaints by Priority */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints by Priority</h3>
            <div className="space-y-4">
              {analytics.byPriority.map((priority, index) => (
                <div key={priority._id} className="flex items-center justify-between">
                  <span className={`text-sm font-medium capitalize ${
                    priority._id === 'high' ? 'text-red-600' :
                    priority._id === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {priority._id}
                  </span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className={`h-2 rounded-full ${
                          priority._id === 'high' ? 'bg-red-500' :
                          priority._id === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(priority.count / Math.max(...analytics.byPriority.map(p => p.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{priority.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
