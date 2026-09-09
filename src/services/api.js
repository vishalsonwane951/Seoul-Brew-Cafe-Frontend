import axios from "axios";

const API_URL = "https://seoul-brew-cafe-backend-1.onrender.com/api";

const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export const UPLOAD_BASE = API_URL.replace("/api", "");

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("Session expired or unauthorized:", err.response?.data);
    }

    return Promise.reject(err);
  },
);

export default API;
