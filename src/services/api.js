import axios from "axios";

const API = axios.create({
  baseURL: 'https://seoul-brew-cafe-backend.onrender.com/api', 
});

export const getMenu = async () => {
  const res = await API.get("/menu");
  return res.data;
};

export default API;