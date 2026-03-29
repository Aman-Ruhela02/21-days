import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://two1-days-rlrw.onrender.com/api",
});

// Request Interceptor: Attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401s globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      toast.error("Session expired. Please log in again.");
      window.location.href = "/"; // Automatically redirect to Login
    }
    return Promise.reject(error);
  }
);

export default api;
