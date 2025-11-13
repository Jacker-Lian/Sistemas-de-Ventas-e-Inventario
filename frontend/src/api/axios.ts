import axios from "axios";

// Añadimos BACKEND como fallback seguro sin alterar la instancia `api` ya existente.
const BACKEND = (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // enviar cookies HttpOnly al backend si corresponde
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;