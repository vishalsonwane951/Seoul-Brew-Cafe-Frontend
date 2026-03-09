// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://seoul-brew-cafe-backend-9d3v.onrender.com/api",
});

// Request interceptor to attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export const UPLOAD_BASE = "https://seoul-brew-cafe-backend-9d3v.onrender.com";
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("Session expired or unauthorized:", err.response?.data);
      // Optionally: logout or redirect
    }
    return Promise.reject(err);
  }
);

export default API;