import api from "./axios";

export const login = async (data) => {
  try {
    const response = await api.post("/auth/login", data);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const requestOtp = async (data) => {
  try {
    const response = await api.post("/otp/send-otp", data);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const verifyOtp = async (data) => {
  try {
    const response = await api.post("/otp/verify-otp", data);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const signup = async (data) => {
  try {
    const response = await api.post("/auth/signup", data);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response;
  } catch (error) {
    console.log(error);
  }
}

