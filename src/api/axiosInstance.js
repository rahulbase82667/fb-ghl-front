import axios from "axios";
import CONFIG from "../constants/config";

const axiosInstance = axios.create({
  baseURL: CONFIG.BASE_URL,
});

// Attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handler (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: handle logout globally
      localStorage.removeItem(CONFIG.TOKEN_KEY);
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
