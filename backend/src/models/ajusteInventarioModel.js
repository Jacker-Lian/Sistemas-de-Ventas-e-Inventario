const database = require('../config/database');

class AjusteInventarioModel {
  constructor() {
    this.table = 'ajustes_inventario';
  }

  async crearAjuste(ajusteData) {
    try {
      const pool = database.getPool();
      const [result] = await pool.query(
        `INSERT INTO ${this.table} 
        (id_producto, cantidad_anterior, cantidad_nueva, tipo_ajuste, motivo, id_usuario_ajuste, fecha_ajuste) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
          ajusteData.id_producto,
          ajusteData.cantidad_anterior,
          ajusteData.cantidad_nueva,
          ajusteData.tipo_ajuste,
          ajusteData.motivo,
          ajusteData.id_usuario_ajuste
        ]
      );

      // Actualizar la cantidad en la tabla de productos
      await pool.query(
        'UPDATE productos SET stock = ? WHERE id_producto = ?',
        [ajusteData.cantidad_nueva, ajusteData.id_producto]
      );

      return result.insertId;
    } catch (error) {
      throw new Error('Error al crear ajuste de inventario: ' + error.message);
    }
  }

  async obtenerAjustes(filtros = {}) {
    try {
      const pool = database.getPool();
      let query = `
        SELECT 
          ai.*,
          p.nombre_producto,
          u.nombre_usuario
        FROM ${this.table} ai
        JOIN productos p ON ai.id_producto = p.id_producto
        JOIN usuarios u ON ai.id_usuario_ajuste = u.id_usuario
        WHERE 1=1
      `;
      const params = [];

      if (filtros.fecha_inicio) {
        query += ' AND ai.fecha_ajuste >= ?';
        params.push(filtros.fecha_inicio);
      }

      if (filtros.fecha_fin) {
        query += ' AND ai.fecha_ajuste <= ?';
        params.push(filtros.fecha_fin);
      }

      if (filtros.id_producto) {
        query += ' AND ai.id_producto = ?';
        params.push(filtros.id_producto);
      }

      query += ' ORDER BY ai.fecha_ajuste DESC';

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Error al obtener ajustes de inventario: ' + error.message);
    }
  }
}

module.exports = AjusteInventarioModel;