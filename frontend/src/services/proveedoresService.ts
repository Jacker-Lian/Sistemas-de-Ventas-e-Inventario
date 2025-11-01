import axios from "axios";

const API_URL = "http://localhost:3000/proveedores"; // Ajusta al puerto de tu backend

export const getProveedores = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createProveedor = async (proveedor: any) => {
  const res = await axios.post(API_URL, proveedor);
  return res.data;
};

export const updateProveedor = async (id: number, proveedor: any) => {
  const res = await axios.put(`${API_URL}/${id}`, proveedor);
  return res.data;
};

export const deleteProveedor = async (id: number) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
