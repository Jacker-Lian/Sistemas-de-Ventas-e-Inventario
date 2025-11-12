import axios from "axios";

const base = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: base,
  withCredentials: true, // enviar cookies HttpOnly al backend
});

export default api;