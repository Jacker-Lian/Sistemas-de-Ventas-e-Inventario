export interface Producto {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    estado?: number | string;
    descripcion?: string | null;
    id_categoria?: number;
    id_proveedor?: number;
}

export interface AjusteFormData {
    id_producto: number | '';
    cantidad_ajustada: number;
    tipo_ajuste: 'AUMENTO' | 'DISMINUCION';
    id_usuario: number | ''; // Necesitas un ID de usuario logueado
    observaciones: string; // En lugar de 'motivo'
}