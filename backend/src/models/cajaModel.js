const database = require('../config/database');

class CajaModel {
  // Abre caja solo si no existe abierta y activa para ese usuario y sucursal
  async abrirCaja(idUsuario, idSucursal) {
    try {
      const pool = database.getPool();

      // Verificar si ya hay una caja abierta para ese usuario y sucursal
      const [cajaAbierta] = await pool.query(
        "SELECT id_caja FROM caja WHERE id_usuario = ? AND estado_caja = 'ABIERTA' AND estado = 1 AND id_sucursal = ?",
        [idUsuario, idSucursal]
      );

      if (cajaAbierta.length > 0) {
        throw new Error('Ya existe una caja abierta para este usuario en esta sucursal.');
      }

      const [result] = await pool.query(
        `INSERT INTO caja (fecha_apertura, id_usuario, id_sucursal, estado_caja, estado) 
         VALUES (NOW(), ?, ?, 'ABIERTA', 1)`,
        [idUsuario, idSucursal]
      );

      return { id_caja: result.insertId };
    } catch (error) {
      throw error;
    }
  }

  // Registra un movimiento (ingreso/egreso) y apunta a la tabla movimientos_caja
  async registrarMovimiento(idCaja, tipo, monto, connection = null) {
    try {
      const pool = connection || database.getPool();

      // Verifica que la caja esté abierta y activa
      const [rows] = await pool.query(
        "SELECT COUNT(1) AS count FROM caja WHERE id_caja = ? AND estado_caja = 'ABIERTA' AND estado = 1",
        [idCaja]
      );

      if (rows[0].count === 0) {
        throw new Error('La caja no está abierta o no existe.');
      }

      await pool.query(
        `INSERT INTO movimientos_caja (id_caja, tipo_movimiento, monto, fecha_movimiento) 
         VALUES (?, ?, ?, NOW())`,
        [idCaja, tipo, monto]
      );

      return { message: "Movimiento registrado correctamente." };
    } catch (error) {
      throw error;
    }
  }

  // Cierra caja y asigna monto final
  async cerrarCaja(idCaja, montoFinal) {
    try {
      const pool = database.getPool();

      const [result] = await pool.query(
        `UPDATE caja 
         SET fecha_cierre = NOW(), monto_final = ?, estado_caja = 'CERRADA' 
         WHERE id_caja = ? AND estado_caja = 'ABIERTA' AND estado = 1`,
        [montoFinal, idCaja]
      );

      if (result.affectedRows === 0) {
        throw new Error('La caja no está abierta o no existe.');
      }

      return { message: "Caja cerrada correctamente." };
    } catch (error) {
      throw error;
    }
  }

  // Listado de cajas por estado
  async listarCajas(estado = null) {
    try {
      const pool = database.getPool();
      let query = `
        SELECT 
          id_caja, fecha_apertura, fecha_cierre, monto_final, total_ingresos, total_egresos, 
          estado_caja, id_usuario, id_sucursal, estado, fecha_creacion, fecha_actualizacion
        FROM caja
      `;
      const params = [];
      if (estado) {
        query += " WHERE estado_caja = ?";
        params.push(estado);
      }
      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtiene caja abierta por su ID, solo si está activa
  async obtenerCajaAbiertaPorId(idCaja) {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(
        "SELECT id_caja, fecha_apertura, id_usuario, id_sucursal, estado_caja FROM caja WHERE id_caja = ? AND estado_caja = 'ABIERTA' AND estado = 1",
        [idCaja]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Obtiene caja abierta por usuario
  async obtenerCajaAbiertaPorUsuario(idUsuario) {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(
        "SELECT id_caja, fecha_apertura, id_sucursal, estado_caja FROM caja WHERE id_usuario = ? AND estado_caja = 'ABIERTA' AND estado = 1 LIMIT 1",
        [idUsuario]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Obtiene movimientos de caja (ingresos/egresos)
  async obtenerMovimientos(idCaja) {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(
        "SELECT id_movimiento, tipo_movimiento, monto, fecha_movimiento FROM movimientos_caja WHERE id_caja = ? ORDER BY fecha_movimiento DESC",
        [idCaja]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Calcula el total de ingresos, egresos y saldo actual de la caja
  async calcularTotalCaja(idCaja) {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(
        `SELECT 
           SUM(CASE WHEN tipo_movimiento = 'INGRESO' THEN monto ELSE 0 END) AS total_ingresos,
           SUM(CASE WHEN tipo_movimiento = 'EGRESO' THEN monto ELSE 0 END) AS total_egresos
         FROM movimientos_caja 
         WHERE id_caja = ?`,
        [idCaja]
      );
      const { total_ingresos, total_egresos } = rows[0];
      const saldo = (total_ingresos || 0) - (total_egresos || 0);
      return {
        total_ingresos: total_ingresos || 0,
        total_egresos: total_egresos || 0,
        saldo
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CajaModel();
