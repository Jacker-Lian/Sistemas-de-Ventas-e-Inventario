export interface Producto {
    id_producto: number;
    nombre: string;
    stock: number; // El stock actual del producto
    // Otros campos que tu tabla 'producto' pueda tener
}

export interface AjusteFormData {
    id_producto: number | '';
    cantidad_ajustada: number;
    tipo_ajuste: 'AUMENTO' | 'DISMINUCION';
    id_usuario: number | ''; // Necesitas un ID de usuario logueado
    observaciones: string; // En lugar de 'motivo'
    id_sucursal: number | '';
}

export interface AjusteRegistro {
    id_ajuste: number;
    cantidad_ajustada: number;
    tipo_ajuste: 'AUMENTO' | 'DISMINUCION';
    stock_nuevo: number;
    observaciones: string;
    fecha_creacion: string; // La fecha viene como string del backend
    nombre_producto: string; // Viene del JOIN
    nombre_usuario: string;  // Viene del JOIN
    nombre_sucursal: string; // Viene del JOIN
}