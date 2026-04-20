// import axios from "axios";

// const API = axios.create({        
//   baseURL: "http://localhost:5000/api",
//   // baseURL: "https://seoul-brew-cafe-backend.onrender.com/api",
//   // baseURL: "https://seoul-brew-cafe-backend-1.onrender.com/api",
//   // baseURL: "http://3.109.183.192:5000/api",
//   // baseURL: "https://ec2-3-109-183-192.ap-south-1.compute.amazonaws.com:5000/api",
//   //  3.109.183.192    

// });

// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Derives upload base from the same env var — no duplication
// export const UPLOAD_BASE = (import.meta.env.VITE_API_URL || "http://locahost:500/api")
//   .replace("/api", "");

// API.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       console.warn("Session expired or unauthorized:", err.response?.data);
//     }
//     return Promise.reject(err);
//   }
// );

// export default API;




import axios from "axios";

const VITE_API_URL = 'https://seoul-brew-cafe-backend-1.onrender.com/api'

const API = axios.create({        
  baseURL: VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export const UPLOAD_BASE = (VITE_API_URL || "http://localhost:5000/api")
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