import axios from "axios";

// Usar la URL del backend configurada en Vite (VITE_API_URL) si existe
const BACKEND = (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${BACKEND}/api/usuario`,
  withCredentials: true, // enviar cookies en cada petición por defecto
});

// No añadimos Authorization desde localStorage: el backend usa cookies HttpOnly
export default api;
