export interface Gasto {
  id_gasto: number;
  descripcion: string;
  monto: number;
  metodo_pago: string;
  id_tipo_gasto?: number | null;
  tipo_gasto?: string;
  tipo_gasto_nombre?: string;
  id_usuario?: number;
  nombre_usuario?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface TipoGasto {
  id_tipo_gasto: number;
  nombre: string;
  descripcion?: string;
}