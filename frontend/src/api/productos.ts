import api from './axios';

export const obtenerProductos = async (query?: string) => {
  const params = query ? { action: 'search', query } : {};
  const response = await api.get('/productos/obtenerProductos', { params });
  return response.data;
};

export const obtenerProductoPorId = async (id: number) => {
  const response = await api.get(`/productos/obtenerProducto/${id}`);
  return response.data;
};

export const obtenerProductosPorCategoria = async (idCategoria: number) => {
  const response = await api.get(`/productos/obtenerProductosPorCategoria/${idCategoria}`);
  return response.data;
};

export const crearProducto = async (producto: any) => {
  const response = await api.post('/productos/crearProducto', producto);
  return response.data;
};

export const actualizarProducto = async (producto: any) => {
  const response = await api.put('/productos/actualizarProducto', producto);
  return response.data;
};

export const desactivarProducto = async (id: number) => {
  const response = await api.put('/productos/desactivarProducto', { id });
  return response.data;
};