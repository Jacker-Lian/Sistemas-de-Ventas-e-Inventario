import axios from "axios";
import type { Gasto, TipoGasto } from "../types/gastos";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
    : "http://38.250.161.15:3000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getGastos = async (page = 1, limit = 20) => {
  const { data } = await api.get(`/gastos?page=${page}&limit=${limit}`);
  return data;
};

export const getGasto = async (id: number) => {
  const { data } = await api.get(`/gastos/${id}`);
  return data;
};

export const crearGasto = async (gasto: Partial<Gasto>) => {
  const { data } = await api.post("/gastos", gasto);
  return data;
};

export const actualizarGasto = async (id: number, gasto: Partial<Gasto>) => {
  const { data } = await api.put(`/gastos/${id}`, gasto);
  return data;
};

export const eliminarGasto = async (id: number) => {
  const { data } = await api.patch(`/gastos/${id}`);
  return data;
};

export const getTiposGasto = async () => {
  const { data } = await api.get("/gastos/tipos");
  return data;
};

export const crearTipoGasto = async (tipo: Partial<TipoGasto>) => {
  const { data } = await api.post("/gastos/tipo", tipo);
  return data;
};
