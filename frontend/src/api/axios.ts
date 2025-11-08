import axios from "axios";

const api = axios.create({
  baseURL: "http://38.250.161.15:3000/api/usuario",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
