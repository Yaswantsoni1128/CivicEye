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
