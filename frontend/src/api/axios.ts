import axios from "axios";

// Usar variable de entorno VITE_API_URL si existe, si no usar fallback local
const BACKEND = (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";

// Instancia axios apuntando al prefijo /api y enviando cookies HttpOnly
const api = axios.create({
  baseURL: `${BACKEND}/api`,
  withCredentials: true,
});

// No agregamos Authorization desde localStorage: el backend gestiona la sesión por cookie HttpOnly.
export default api;