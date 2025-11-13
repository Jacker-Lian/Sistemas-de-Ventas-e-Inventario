import axios from "axios";
import type { Caja, MovimientoCaja, AbrirCajaResponse } from "../types/caja";

// Usamos VITE_SERVER_URL que apunta a la raíz del backend (http://38.250.161.15:3000)
const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/caja`; 

const cajaApi = axios.create({
  baseURL: API_URL,
});

// IMPORTANTE: Replicamos el interceptor de 'axios.ts' para asegurar la autenticación
// en todas las peticiones de este módulo.
cajaApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


 //* Busca las cajas que coincidan con el estado.
 
export const fetchCajasPorEstado = (estado: 'ABIERTA' | 'CERRADA') => {
  return cajaApi.get<Caja[]>(`/listar?estado=${estado}`);
};


 // Obtiene los datos de una caja abierta específica por su ID.
 
export const fetchCajaAbiertaPorId = (idCaja: number) => {
  // Este es el endpoint que acabamos de crear en el backend
  return cajaApi.get<Caja>(`/${idCaja}`);
};

/**
 * Abre una nueva caja para un usuario y sucursal.
 * @param idUsuario ID del usuario
 * @param idSucursal ID de la sucursal
 */
export const abrirCaja = (idUsuario: number, idSucursal: number | null) => {
  return cajaApi.post<AbrirCajaResponse>('/abrir', { id_usuario: idUsuario, id_sucursal: idSucursal });
};

/**
 * Cierra una caja existente.
 * @param idCaja ID de la caja a cerrar
 */
export const cerrarCaja = (idCaja: number) => {
  return cajaApi.put(`/cerrar/${idCaja}`);
};

/**
 * Registra un movimiento (ingreso o egreso) en una caja.
 * @param movimiento Objeto con { id_caja, tipo, monto }
 */
export const registrarMovimiento = (movimiento: MovimientoCaja) => {
  return cajaApi.post('/movimiento', movimiento);
};