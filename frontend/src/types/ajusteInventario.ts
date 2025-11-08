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
}