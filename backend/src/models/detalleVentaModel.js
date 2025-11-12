const database = require("../config/database");

class DetalleVentaModel {
  constructor() {
    this.table = "detalle_venta";
  }

  /**
   * Registrar detalle de venta
   * @param {object} datosDetalle
   */
  async registrarDetalleVenta(datosDetalle) {
    const pool = database.getPool();
    try {
      const {
        id_venta,
        id_producto,
        cantidad,
        precio_unitario,
        subtotal
      } = datosDetalle;

      const query = `INSERT INTO ${this.table}
        (id_venta, id_producto, cantidad, precio_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?)`;

      const [resultado] = await pool.query(query, [
        id_venta,
        id_producto,
        cantidad,
        precio_unitario,
        subtotal
      ]);
      
      return resultado;
    } catch (error) {
      throw new Error("Error al registrar detalle de venta: " + error.message);
    }
  }

  /**
   * Obtener detalles por venta
   * @param {number} idVenta 
   * @returns {Promise<Array<Object>>} 
   */
  async getDetallesPorVenta(idVenta) {
    const pool = database.getPool();
    try {
      const query = `
        SELECT 
          dv.id_detalle, 
          p.nombre AS nombre_producto,
          dv.cantidad, 
          dv.precio_unitario,
          dv.fecha_creacion,
          dv.fecha_actualizacion,
          (dv.cantidad * dv.precio_unitario) AS subtotal
        FROM detalle_venta dv
        JOIN producto p ON dv.id_producto = p.id_producto
        WHERE dv.id_venta = ?
      `;
      
      const [rows] = await pool.query(query, [idVenta]);
      return rows;
    } catch (error) {
      console.error("Error en el Modelo al obtener detalles por venta:", error);
      throw error; 
    }
  }
}

module.exports = DetalleVentaModel;