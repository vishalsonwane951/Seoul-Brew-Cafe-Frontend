import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Derives upload base from the same env var — no duplication
export const UPLOAD_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
  .replace("/api", "");

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("Session expired or unauthorized:", err.response?.data);
    }
    return Promise.reject(err);
  }
);

export default API;