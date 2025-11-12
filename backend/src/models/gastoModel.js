const { getPool } = require('../config/database.js');
const pool = getPool();

class gastosModel {

  async obtenerGastos({ page = 1, limit = 100 } = {}) {
    try {
      const MAX_LIMIT = 100; 
      // evita sobrecargar la base de datos
      limit = Math.min(limit, MAX_LIMIT); 
      
      const offset = (page - 1) * limit;
      const [gastos] = await pool.query(`
        SELECT g.id_gasto, g.descripcion, g.monto, g.metodo_pago, tg.nombre
        AS tipo_gasto FROM gastos g
        LEFT JOIN tipo_gasto tg 
        ON g.id_tipo_gasto = tg.id_tipo_gasto
        WHERE g.estado = 1
        ORDER BY g.fecha_creacion DESC 
        LIMIT ? OFFSET ?
      `, [limit, offset]);
      // total de gastos en la tabla
      const [[{ total }]] = await pool.query(`
        SELECT COUNT(1) as total FROM gastos WHERE estado = 1`);
      // calcula el total de páginas
      const pages = Math.ceil(total / limit);
      return { gastos, totalGastos: total, totalPaginas: pages, paginaActual: page };
    } catch (error) {
      return { error };
    }
  }

  async obtenerGasto(id_gasto) {
    try {
      const [gasto] = await pool.query(`
        SELECT g.id_gasto, g.descripcion, g.monto, g.metodo_pago,
               g.id_tipo_gasto, tg.nombre AS tipo_gasto_nombre,
               g.id_usuario, u.nombre_usuario,
               g.fecha_creacion, g.fecha_actualizacion
        FROM gastos g
        LEFT JOIN tipo_gasto tg
        ON g.id_tipo_gasto = tg.id_tipo_gasto
        LEFT JOIN usuarios u 
        ON g.id_usuario = u.id_usuario
        WHERE g.id_gasto = ? AND g.estado = 1
        LIMIT 1
      `, [id_gasto]);
      return gasto[0] || null;
    } catch (error) {
      return { error };
    }
  }

  async actualizarGasto(id_gasto, { descripcion, monto, id_tipo_gasto, metodo_pago }) {
    try {
      const [actualizar] = await pool.query(`
        UPDATE gastos 
        SET descripcion = ?, monto = ?, id_tipo_gasto = ?, metodo_pago = ?
        WHERE id_gasto = ? AND estado = 1
      `, [descripcion, monto, id_tipo_gasto, metodo_pago, id_gasto]);
      if (actualizar.affectedRows === 0) return null;
      return this.obtenerGasto(id_gasto);
    } catch (error) {
      return { error };
    }
  }

  // soft delete: marcar el gasto como eliminado
  async eliminarGasto(id_gasto) {
    try {
      const [eliminar] = await pool.query(`
        UPDATE gastos
        SET estado = 0
        WHERE id_gasto = ?
      `, [id_gasto]);
      return eliminar.affectedRows > 0;
    } catch (error) {
      return { error };
    }
  }

  async crearGasto({ descripcion, monto, id_tipo_gasto, metodo_pago, id_usuario }) {
    try {
      const [crear] = await pool.query(`
        INSERT INTO gastos (descripcion, monto, id_tipo_gasto, metodo_pago, id_usuario)
        VALUES (?, ?, ?, ?, ?)
      `, [descripcion, monto, id_tipo_gasto, metodo_pago, id_usuario]);
      return crear.insertId; // solo devolvemos el id
    } catch (error) {
      return { error };
    }
  }

  async obtenerTiposGasto() {
    try {
      const [tipos] = await pool.query(`
        SELECT id_tipo_gasto, nombre, descripcion
        FROM tipo_gasto
        ORDER BY nombre ASC
      `);
      return tipos;
    } catch (error) {
      return { error };
    }
  }

  async crearTipoGasto({ nombre, descripcion }) {
    try {
      const [crear] = await pool.query(`
        INSERT INTO tipo_gasto (nombre, descripcion)
        VALUES (?, ?)
      `, [nombre, descripcion]);
      return crear.insertId; // devolver id generaod
    } catch (error) {
      return { error };
    }
  }
}

module.exports = new gastosModel();
