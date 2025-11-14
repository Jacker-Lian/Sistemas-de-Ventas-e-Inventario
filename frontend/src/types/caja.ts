export interface Caja {
  id_caja: number;
  fecha_apertura: string;
  fecha_cierre?: string | null;
  total_ingresos: number | string; // El backend usa decimal, puede venir como string
  total_egresos: number | string;
  estado_caja: 'ABIERTA' | 'CERRADA';
  id_usuario: number;
  id_sucursal?: number | null;
  estado: number;
  fecha_creacion: string;
  fecha_actualizacion?: string;
}

// Para el formulario de movimiento
export interface MovimientoCaja {
  id_caja: number;
  tipo: 'INGRESO' | 'EGRESO';
  monto: number;
}

// Para la respuesta de abrir caja
export interface AbrirCajaResponse {
  id_caja: number;
}