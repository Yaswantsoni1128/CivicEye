import api from "./axios";

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
    return { error: true, message, status: error.response.status };
  } else if (error.request) {
    // Request was made but no response received
    return { error: true, message: 'Network error. Please check your connection.', status: 0 };
  } else {
    // Something else happened
    return { error: true, message: error.message || 'An unexpected error occurred', status: 0 };
  }
};

export const login = async (data) => {
  try {
    const response = await api.post("/auth/login", data);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw handleApiError(error);
  }
}

export const requestOtp = async (data) => {
  try {
    const response = await api.post("/otp/send-otp", data);
    return response;
  } catch (error) {
    console.error("OTP request error:", error);
    throw handleApiError(error);
  }
}

export const verifyOtp = async (data) => {
  try {
    const response = await api.post("/otp/verify-otp", data);
    return response;
  } catch (error) {
    console.error("OTP verification error:", error);
    throw handleApiError(error);
  }
}

export const signup = async (data) => {
  try {
    const response = await api.post("/auth/signup", data);
    return response;
  } catch (error) {
    console.error("Signup error:", error);
    throw handleApiError(error);
  }
}

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    throw handleApiError(error);
  }
}

export const reportComplaint = async (data) => {
  try {
    const response = await api.post("/complain", data);
    return response;
  } catch (error) {
    console.error("Report complaint error:", error);
    throw handleApiError(error);
  }
}

export const fetchUserComplaints = async () => {
  try {
    const response = await api.get("/complain/my-complaints");
    return response;
  } catch (error) {
    console.error("Fetch complaints error:", error);
    throw handleApiError(error);
  }
}

// Auth Routes - Admin/Worker Creation
export const createWorker = async (data) => {
  try {
    const response = await api.post("/auth/create-worker", data);
    return response;
  } catch (error) {
    console.error("Create worker error:", error);
    throw handleApiError(error);
  }
}

export const createAdmin = async (data) => {
  try {
    const response = await api.post("/auth/create-admin", data);
    return response;
  } catch (error) {
    console.error("Create admin error:", error);
    throw handleApiError(error);
  }
}

// Complaint Routes - Citizen
export const fetchComplaintById = async (id) => {
  try {
    const response = await api.get(`/complain/${id}`);
    return response;
  } catch (error) {
    console.error("Fetch complaint by ID error:", error);
    throw handleApiError(error);
  }
}

export const submitFeedback = async (id, data) => {
  try {
    const response = await api.post(`/complain/${id}/feedback`, data);
    return response;
  } catch (error) {
    console.error("Submit feedback error:", error);
    throw handleApiError(error);
  }
}

// Admin Routes
export const fetchAllComplaints = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    
    const queryString = params.toString();
    const url = queryString ? `/admin/complaints?${queryString}` : '/admin/complaints';
    const response = await api.get(url);
    return response;
  } catch (error) {
    console.error("Fetch all complaints error:", error);
    throw handleApiError(error);
  }
}

export const assignComplaint = async (complaintId, data) => {
  try {
    const response = await api.put(`/admin/complaints/${complaintId}/assign`, data);
    return response;
  } catch (error) {
    console.error("Assign complaint error:", error);
    throw handleApiError(error);
  }
}

export const updateComplaint = async (complaintId, data) => {
  try {
    const response = await api.put(`/admin/complaints/updateComplain/${complaintId}`, data);
    return response;
  } catch (error) {
    console.error("Update complaint error:", error);
    throw handleApiError(error);
  }
}

export const fetchReports = async () => {
  try {
    const response = await api.get("/admin/reports");
    return response;
  } catch (error) {
    console.error("Fetch reports error:", error);
    throw handleApiError(error);
  }
}

// Worker Routes
export const fetchAssignedComplaints = async () => {
  try {
    const response = await api.get("/worker/assigned");
    return response;
  } catch (error) {
    console.error("Fetch assigned complaints error:", error);
    throw handleApiError(error);
  }
}

export const startComplaint = async (complaintId) => {
  try {
    const response = await api.patch(`/worker/${complaintId}/start`);
    return response;
  } catch (error) {
    console.error("Start complaint error:", error);
    throw handleApiError(error);
  }
}

export const resolveComplaint = async (complaintId, data) => {
  try {
    const response = await api.patch(`/worker/${complaintId}/resolve`, data);
    return response;
  } catch (error) {
    console.error("Resolve complaint error:", error);
    throw handleApiError(error);
  }
}

export const fetchWorkerPerformance = async () => {
  try {
    const response = await api.get("/worker/performance");
    return response;
  } catch (error) {
    console.error("Fetch worker performance error:", error);
    throw handleApiError(error);
  }
}