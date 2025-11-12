const db = require('../config/database');

const AjusteInventarioModel = {
  crear: async (datos) => {
    const { id_producto, cantidad_ajustada, tipo_ajuste, id_usuario, observaciones, id_sucursal } = datos;

    let connection;
    try {
      connection = await db.getPool().getConnection();
      await connection.beginTransaction();

      const [productRows] = await connection.query(
        'SELECT stock, nombre FROM producto WHERE id_producto = ? AND estado = 1 FOR UPDATE',
        [id_producto]
      );

      if (productRows.length === 0) {
        throw new Error('El producto no fue encontrado o está inactivo.');
      }

      const stock_anterior = productRows[0].stock;
      const nombre_producto = productRows[0].nombre;
      const cantidad_neta = tipo_ajuste === 'AUMENTO' ? cantidad_ajustada : -cantidad_ajustada;
      const stock_nuevo = stock_anterior + cantidad_neta;

      if (stock_nuevo < 0) {
        throw new Error('El ajuste no puede dejar el stock con valor negativo.');
      }
      
      await connection.query(
        'UPDATE producto SET stock = ? WHERE id_producto = ?',
        [stock_nuevo, id_producto]
      );

      const [resultado] = await connection.query(
        `INSERT INTO ajustes_inventario 
         (id_producto, tipo_ajuste, id_usuario, stock_nuevo, observaciones, id_sucursal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id_producto, tipo_ajuste, id_usuario, stock_nuevo, observaciones, id_sucursal]
      );

      await connection.commit();
      
      return { 
        id_ajuste: resultado.insertId,
        stock_anterior,
        stock_nuevo,
        nombre_producto,
        diferencia: stock_nuevo - stock_anterior,
        cantidad_ajustada
      };

    } catch (error) {
      if (connection) await connection.rollback();
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },

  obtenerTodos: async (filtros = {}) => {
    try {
      const pool = db.getPool();
      
      let query = `
        SELECT 
          ai.id_ajuste,
          ai.id_producto,
          p.nombre as nombre_producto,
          CASE 
            WHEN ai.tipo_ajuste = 'AUMENTO' THEN ai.stock_nuevo - COALESCE((SELECT stock FROM producto WHERE id_producto = ai.id_producto), ai.stock_nuevo)
            WHEN ai.tipo_ajuste = 'DISMINUCION' THEN COALESCE((SELECT stock FROM producto WHERE id_producto = ai.id_producto), ai.stock_nuevo) - ai.stock_nuevo
          END as cantidad_ajustada,
          ai.tipo_ajuste,
          CASE 
            WHEN ai.tipo_ajuste = 'AUMENTO' THEN ai.stock_nuevo - (ai.stock_nuevo - COALESCE((SELECT stock FROM producto WHERE id_producto = ai.id_producto), ai.stock_nuevo))
            WHEN ai.tipo_ajuste = 'DISMINUCION' THEN ai.stock_nuevo + (COALESCE((SELECT stock FROM producto WHERE id_producto = ai.id_producto), ai.stock_nuevo) - ai.stock_nuevo)
          END as stock_anterior,
          ai.stock_nuevo,
          ai.observaciones,
          ai.fecha_creacion,
          u.nombre_usuario,
          u.id_usuario,
          s.nombre as nombre_sucursal,
          s.id_sucursal,
          CASE 
            WHEN ai.tipo_ajuste = 'AUMENTO' THEN ai.stock_nuevo - COALESCE((SELECT stock FROM producto WHERE id_producto = ai.id_producto), ai.stock_nuevo)
            WHEN ai.tipo_ajuste = 'DISMINUCION' THEN ai.stock_nuevo - COALESCE((SELECT stock FROM producto WHERE id_producto = ai.id_producto), ai.stock_nuevo)
          END as diferencia
        FROM ajustes_inventario ai
        INNER JOIN producto p ON ai.id_producto = p.id_producto
        INNER JOIN usuarios u ON ai.id_usuario = u.id_usuario
        INNER JOIN sucursal s ON ai.id_sucursal = s.id_sucursal
        WHERE 1=1
      `;

      const params = [];

      if (filtros.id_producto) {
        query += ` AND ai.id_producto = ?`;
        params.push(filtros.id_producto);
      }

      if (filtros.tipo_ajuste) {
        query += ` AND ai.tipo_ajuste = ?`;
        params.push(filtros.tipo_ajuste);
      }

      if (filtros.id_sucursal) {
        query += ` AND ai.id_sucursal = ?`;
        params.push(filtros.id_sucursal);
      }

      if (filtros.id_usuario) {
        query += ` AND ai.id_usuario = ?`;
        params.push(filtros.id_usuario);
      }

      if (filtros.fecha_inicio) {
        query += ` AND DATE(ai.fecha_creacion) >= ?`;
        params.push(filtros.fecha_inicio);
      }

      if (filtros.fecha_fin) {
        query += ` AND DATE(ai.fecha_creacion) <= ?`;
        params.push(filtros.fecha_fin);
      }

      query += ` ORDER BY ai.fecha_creacion DESC`;

      if (filtros.limit) {
        const limit = parseInt(filtros.limit) || 50;
        const offset = filtros.page ? (parseInt(filtros.page) - 1) * limit : 0;
        query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);
      }

      const [ajustes] = await pool.query(query, params);
      
      let countQuery = `SELECT COUNT(*) as total FROM ajustes_inventario ai WHERE 1=1`;
      const countParams = [];
      
      if (filtros.id_producto) countParams.push(filtros.id_producto);
      if (filtros.tipo_ajuste) countParams.push(filtros.tipo_ajuste);
      if (filtros.id_sucursal) countParams.push(filtros.id_sucursal);
      if (filtros.fecha_inicio) countParams.push(filtros.fecha_inicio);
      if (filtros.fecha_fin) countParams.push(filtros.fecha_fin);

      const [countResult] = await pool.query(countQuery, countParams);
      const total = countResult[0].total;

      return {
        ajustes,
        paginacion: {
          total,
          pagina: filtros.page || 1,
          porPagina: filtros.limit || 50,
          totalPaginas: Math.ceil(total / (filtros.limit || 50))
        }
      };
    } catch (error) {
      console.error('Error en obtenerTodos:', error);
      throw error;
    }
  },

  obtenerPorProducto: async (idProducto, filtros = {}) => {
    try {
      const pool = db.getPool();
      
      let query = `
        SELECT 
          ai.id_ajuste,
          ai.tipo_ajuste,
          ai.stock_nuevo,
          ai.observaciones,
          ai.fecha_creacion,
          p.nombre as nombre_producto,
          u.nombre_usuario,
          s.nombre as nombre_sucursal
        FROM ajustes_inventario ai
        INNER JOIN producto p ON ai.id_producto = p.id_producto
        INNER JOIN usuarios u ON ai.id_usuario = u.id_usuario
        INNER JOIN sucursal s ON ai.id_sucursal = s.id_sucursal
        WHERE ai.id_producto = ?
      `;

      const params = [idProducto];

      if (filtros.fecha_inicio) {
        query += ` AND DATE(ai.fecha_creacion) >= ?`;
        params.push(filtros.fecha_inicio);
      }

      if (filtros.fecha_fin) {
        query += ` AND DATE(ai.fecha_creacion) <= ?`;
        params.push(filtros.fecha_fin);
      }

      query += ` ORDER BY ai.fecha_creacion DESC`;

      if (filtros.limit) {
        const limit = parseInt(filtros.limit) || 50;
        const offset = filtros.page ? (parseInt(filtros.page) - 1) * limit : 0;
        query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);
      }

      const [ajustes] = await pool.query(query, params);
      return ajustes;
    } catch (error) {
      throw error;
    }
  },

  obtenerEstadisticas: async (filtros = {}) => {
    try {
      const pool = db.getPool();
      
      let query = `SELECT COUNT(*) as total_ajustes, COUNT(DISTINCT id_producto) as productos_afectados FROM ajustes_inventario WHERE 1=1`;
      const params = [];

      if (filtros.fecha_inicio) {
        query += ` AND DATE(fecha_creacion) >= ?`;
        params.push(filtros.fecha_inicio);
      }

      if (filtros.fecha_fin) {
        query += ` AND DATE(fecha_creacion) <= ?`;
        params.push(filtros.fecha_fin);
      }

      if (filtros.id_sucursal) {
        query += ` AND id_sucursal = ?`;
        params.push(filtros.id_sucursal);
      }

      const [stats] = await pool.query(query, params);
      return stats[0];
    } catch (error) {
      throw error;
    }
  },

  obtenerProductoConStock: async (id_producto) => {
    try {
      const pool = db.getPool();
      const [productos] = await pool.query(
        `SELECT id_producto, nombre, stock, estado FROM producto WHERE id_producto = ? AND estado = 1`,
        [id_producto]
      );
      return productos[0] || null;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = AjusteInventarioModel;