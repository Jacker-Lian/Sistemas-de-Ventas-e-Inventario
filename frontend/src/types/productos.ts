export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  descripcion: string | null;
  estado: number;
}

export interface ProductoFormData {
  nombre: string;
  precio_venta: number;
  precio_compra: number;
  stock: number;
  descripcion: string;
  id_categoria: number;
  id_proveedor: number;
}

export interface ProductoUpdateData extends ProductoFormData {
  id: number;
}