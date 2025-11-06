const { getPool } = require('../config/database.js');
const pool = getPool();

class gastosModel {

  async obtenerGastos({ page = 1, limit = 20 } = {}) {
    try {
      const MAX_LIMIT = 20; 
      // evita sobrecargar la base de datos
      limit = Math.min(limit, MAX_LIMIT); 
      
      const offset = (page - 1) * limit;
      const [gastos] = await pool.query(`
        SELECT id_gasto, descripcion, monto, tipo_gasto, metodo_pago 
        FROM gastos
        WHERE estado = 1
        ORDER BY fecha_creacion DESC 
        LIMIT ? OFFSET ?
      `, [limit, offset]);
      // total de gastos en la tabla
      const [[{ total }]] = await pool.query("SELECT COUNT(*) as total FROM gastos WHERE estado = 1");
      // calcula el total de páginas
      const pages = Math.ceil(total / limit);
      return { gastos, totalGastos: total, totalPaginas: pages, paginaActual: page };
    } catch (error) {
      console.error("Error en obtenerGastos:", error);
      throw new Error("Error no se pudieron obtener los gastos.");
    }
  }

  async obtenerGasto(id_gasto) {
    
    try {
      const [gasto] = await pool.query(
       `SELECT id_gasto, descripcion, monto, tipo_gasto, metodo_pago, fecha_creacion, fecha_actualizacion
       FROM gastos 
       WHERE id_gasto = ? AND estado = 1 
       LIMIT 1`,
       [id_gasto]
      );
      return gasto[0] || null;
    } catch (error) {
      console.error("Error en obtenerGasto:", error);
      throw new Error("Error al obtener gasto: " + error.message);
    }
  }

  async actualizarGasto(id_gasto, { descripcion, monto, tipo_gasto, metodo_pago }) {
    try {
      const [actualizar] = await pool.query(
        `UPDATE gastos 
        SET descripcion = ?, monto = ?, tipo_gasto = ?, metodo_pago = ? 
        WHERE id_gasto = ? AND estado = 1`,
        [descripcion, monto, tipo_gasto, metodo_pago, id_gasto]
      );
      if (actualizar.affectedRows === 0) return null;
      return this.obtenerGasto(id_gasto);
    } catch (error) {
      console.error("Error en actualizarGasto:", error);
      throw new Error("Error al actualizar gasto.");
    }
  }
  // soft delete: marcar el gasto como eliminado
  async eliminarGasto(id_gasto) {
    const [eliminar] = await pool.query(
      `UPDATE gastos
       SET estado = 0
       WHERE id_gasto = ?`,
      [id_gasto]
    );
    return eliminar.affectedRows > 0;
  }

  async crearGasto({ descripcion, monto, tipo_gasto, metodo_pago, id_usuario }) {
    const [crear] = await pool.query(
      `INSERT INTO gastos (descripcion, monto, tipo_gasto, metodo_pago, id_usuario)
       VALUES (?, ?, ?, ?, ?)`,
      [descripcion, monto, tipo_gasto, metodo_pago, id_usuario]
    );

    return crear.insertId; // solo devolvemos el id insertado
  }
}

module.exports = new gastosModel();