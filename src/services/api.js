// import axios from 'axios';

// const API = axios.create({
//     baseURL: 'http://localhost:5000/api',
// });




// api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: 'https://seoul-brew-cafe-backend.onrender.com/api', // change to your real API
});

export const getMenu = async () => {
  const res = await api.get("/menu");
  return res.data;
};

export default API;