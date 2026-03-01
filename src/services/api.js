import axios from "axios";

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const UPLOAD_BASE = 'http://localhost:5000';

export const getMenu = async () => {
  const res = await API.get("/menu");
  return res.data;
};

export default API;