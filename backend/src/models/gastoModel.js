const database = require('../config/database');

class GastoModel {
  constructor() {
    this.table = 'gastos';
    this.tableTipos = 'tipos_gasto';
  }

  async obtenerTodos() {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(`
        SELECT 
          g.id_gasto,
          g.id_tipo_gasto,
          tg.nombre AS tipo_gasto,
          g.monto,
          g.descripcion,
          g.fecha_gasto,
          g.id_usuario,
          u.nombre_usuario,
          g.id_caja,
          g.estado
        FROM ${this.table} g
        LEFT JOIN ${this.tableTipos} tg ON g.id_tipo_gasto = tg.id_tipo_gasto
        LEFT JOIN usuarios u ON g.id_usuario = u.id_usuario
        WHERE g.estado = 1
        ORDER BY g.fecha_gasto DESC
      `);
      return rows;
    } catch (error) {
      throw new Error('Error al obtener gastos: ' + error.message);
    }
  }

  async obtenerPorId(id) {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(`
        SELECT 
          g.id_gasto,
          g.id_tipo_gasto,
          tg.nombre AS tipo_gasto,
          g.monto,
          g.descripcion,
          g.fecha_gasto,
          g.id_usuario,
          u.nombre_usuario,
          g.id_caja,
          g.estado
        FROM ${this.table} g
        LEFT JOIN ${this.tableTipos} tg ON g.id_tipo_gasto = tg.id_tipo_gasto
        LEFT JOIN usuarios u ON g.id_usuario = u.id_usuario
        WHERE g.id_gasto = ? AND g.estado = 1
      `, [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Error al obtener gasto: ' + error.message);
    }
  }

  async crear(datos) {
    try {
      const pool = database.getPool();
      const { id_tipo_gasto, monto, descripcion, id_usuario, id_caja } = datos;
      
      const [result] = await pool.query(
        `INSERT INTO ${this.table} 
         (id_tipo_gasto, monto, descripcion, fecha_gasto, id_usuario, id_caja) 
         VALUES (?, ?, ?, NOW(), ?, ?)`,
        [id_tipo_gasto, monto, descripcion, id_usuario, id_caja]
      );

      // Actualizar egresos en caja
      await pool.query(
        'UPDATE caja SET total_egresos = total_egresos + ? WHERE id_caja = ?',
        [monto, id_caja]
      );

      return result.insertId;
    } catch (error) {
      throw new Error('Error al crear gasto: ' + error.message);
    }
  }

  async actualizar(id, datos) {
    try {
      const pool = database.getPool();
      const { id_tipo_gasto, monto, descripcion } = datos;
      
      const updates = [];
      const values = [];

      if (id_tipo_gasto !== undefined) {
        updates.push('id_tipo_gasto = ?');
        values.push(id_tipo_gasto);
      }
      if (monto !== undefined) {
        updates.push('monto = ?');
        values.push(monto);
      }
      if (descripcion !== undefined) {
        updates.push('descripcion = ?');
        values.push(descripcion);
      }

      if (updates.length === 0) {
        return false;
      }

      values.push(id);
      
      const [result] = await pool.query(
        `UPDATE ${this.table} SET ${updates.join(', ')} WHERE id_gasto = ?`,
        values
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Error al actualizar gasto: ' + error.message);
    }
  }

  async eliminar(id) {
    try {
      const pool = database.getPool();
      const [result] = await pool.query(
        `UPDATE ${this.table} SET estado = 0 WHERE id_gasto = ?`,
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Error al eliminar gasto: ' + error.message);
    }
  }

  async obtenerTiposGasto() {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(
        `SELECT id_tipo_gasto, nombre, descripcion 
         FROM ${this.tableTipos} 
         WHERE estado = 1`
      );
      return rows;
    } catch (error) {
      throw new Error('Error al obtener tipos de gasto: ' + error.message);
    }
  }

  async crearTipoGasto(datos) {
    try {
      const pool = database.getPool();
      const { nombre, descripcion } = datos;
      
      const [result] = await pool.query(
        `INSERT INTO ${this.tableTipos} (nombre, descripcion) VALUES (?, ?)`,
        [nombre, descripcion || null]
      );

      return result.insertId;
    } catch (error) {
      throw new Error('Error al crear tipo de gasto: ' + error.message);
    }
  }
}

module.exports = GastoModel;