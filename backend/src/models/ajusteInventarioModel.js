const database = require('../config/database');

class AjusteInventarioModel {
  constructor() {
    this.table = 'ajustes_inventario';
  }

  async crearAjuste(ajusteData) {
    // Usamos una transacción para asegurar que el INSERT y el UPDATE sean atómicos.
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Bloqueamos la fila del producto para evitar race conditions
      const [productRows] = await connection.query('SELECT stock FROM productos WHERE id_producto = ? FOR UPDATE', [ajusteData.id_producto]);
      if (!productRows || productRows.length === 0) {
        // No existe el producto: rollback y error controlado
        await connection.rollback();
        const err = new Error('Producto no encontrado');
        err.status = 400;
        throw err;
      }

      // Si no se proporciona cantidad_anterior, la obtenemos desde la tabla productos (ya bloqueada)
      const cantidad_anterior = (ajusteData.cantidad_anterior === undefined || ajusteData.cantidad_anterior === null)
        ? productRows[0].stock
        : ajusteData.cantidad_anterior;

      const tipoAjuste = ajusteData.tipo_ajuste || 'manual';

      const [result] = await connection.query(
        `INSERT INTO ${this.table} 
        (id_producto, cantidad_anterior, cantidad_nueva, tipo_ajuste, motivo, id_usuario_ajuste, fecha_ajuste) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
          ajusteData.id_producto,
          cantidad_anterior,
          ajusteData.cantidad_nueva,
          tipoAjuste,
          ajusteData.motivo,
          ajusteData.id_usuario_ajuste
        ]
      );

      const [updateResult] = await connection.query(
        'UPDATE productos SET stock = ? WHERE id_producto = ?',
        [ajusteData.cantidad_nueva, ajusteData.id_producto]
      );

      // Verificar que el UPDATE afectó exactamente una fila
      if (!updateResult || updateResult.affectedRows === 0) {
        await connection.rollback();
        const err = new Error('No se pudo actualizar el stock del producto');
        err.status = 500;
        throw err;
      }

      await connection.commit();
      return result.insertId;
    } catch (error) {
      // Intentamos rollback si tenemos conexión. Capturamos fallo del rollback silenciosamente.
      if (connection) {
        await connection.rollback().catch(() => {});
      }

      // Si ya viene con status, propágalo; si no, envuelve como 500
      if (!error.status) {
        const err = new Error('Error al crear ajuste de inventario: ' + error.message);
        err.status = 500;
        throw err;
      }
      throw error;
    } finally {
      connection.release();
    }
  }

  async obtenerAjustes(filtros = {}) {
    try {
      const pool = database.getPool();
      const params = [];
      let query = `SELECT
          ai.*,
          p.nombre_producto,
          u.nombre_usuario
        FROM ${this.table} ai
        JOIN productos p ON ai.id_producto = p.id_producto
        JOIN usuarios u ON ai.id_usuario_ajuste = u.id_usuario`;

      const conditions = [];
      if (filtros.fecha_inicio) {
        conditions.push('ai.fecha_ajuste >= ?');
        params.push(filtros.fecha_inicio);
      }

      if (filtros.fecha_fin) {
        conditions.push('ai.fecha_ajuste <= ?');
        params.push(filtros.fecha_fin);
      }

      if (filtros.id_producto) {
        conditions.push('ai.id_producto = ?');
        params.push(filtros.id_producto);
      }

      if (conditions.length) {
        query += ' WHERE ' + conditions.join(' AND ');
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