// Definición de tipos para la funcionalidad de registrar ventas

export interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion?: string;
}

// Producto desde la base de datos
export interface ProductoBackend {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  descripcion?: string;
  estado: number;
}

// Producto en el carrito de venta
export interface ProductoVenta {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  stock: number;
}

export interface Producto {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
}

export interface VentaData {
  id_usuario: number;
  id_caja: number;
  id_sucursal?: number;
  tipo_cliente: "ALUMNO" | "DOCENTE" | "OTRO";
  metodo_pago: "EFECTIVO" | "YAPE" | "PLIN" | "OTROS";
  estado_venta: "COMPLETADA" | "PENDIENTE" | "CANCELADA";
  productos: Producto[];
}

export interface Venta {
  id_usuario?: number;
  id_caja?: number;
  id_sucursal?: number;
  tipo_cliente?: "ALUMNO" | "DOCENTE" | "OTRO";
  metodo_pago: string;
  estado_venta?: string;
  productos: Producto[];
}
