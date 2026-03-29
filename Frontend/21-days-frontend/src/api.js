import axios from "axios";
import { toast } from "react-toastify";

const isProduction = import.meta.env.MODE === "production";
const envApiUrl = import.meta.env.VITE_API_URL;

// Prevent using localhost in production even if it's accidentally baked into .env
const baseURL = (isProduction && envApiUrl?.includes("localhost")) 
  ? "https://two1-days-rlrw.onrender.com/api" 
  : (envApiUrl || "https://two1-days-rlrw.onrender.com/api");

const api = axios.create({
  baseURL,
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
