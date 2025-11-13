const database = require('../config/database');

class CajaModel {
  async abrirCaja(idUsuario, idSucursal) {
    try {
      const pool = database.getPool();

      // Verificar si ya hay una caja abierta para ese usuario
      const [cajaAbierta] = await pool.query(
        "SELECT id_caja FROM caja WHERE id_usuario = ? AND estado_caja = 'ABIERTA' AND estado = 1",
        [idUsuario]
      );

      if (cajaAbierta.length > 0) {
        throw new Error('Ya existe una caja abierta para este usuario.');
      }

      const [result] = await pool.query(
        `INSERT INTO caja (fecha_apertura, id_usuario, id_sucursal, estado_caja) 
         VALUES (NOW(), ?, ?, 'ABIERTA')`,
        [idUsuario, idSucursal]
      );

      return { id_caja: result.insertId };
    } catch (error) {
      throw error;
    }
  }

  async registrarMovimiento(idCaja, tipo, monto) {
    try {
      const pool = database.getPool();

      // Verificar que la caja esté abierta
      const [rows] = await pool.query(
        "SELECT COUNT(1) AS count FROM caja WHERE id_caja = ? AND estado_caja = 'ABIERTA' AND estado = 1",
        [idCaja]
      );

      if (rows[0].count === 0) {
        throw new Error('La caja no está abierta o no existe.');
      }

      if (tipo === "INGRESO") {
        await pool.query(
          "UPDATE caja SET total_ingresos = total_ingresos + ? WHERE id_caja = ?",
          [monto, idCaja]
        );
      } else if (tipo === "EGRESO") {
        await pool.query(
          "UPDATE caja SET total_egresos = total_egresos + ? WHERE id_caja = ?",
          [monto, idCaja]
        );
      } else {
        throw new Error("Tipo de movimiento no válido.");
      }

      return { message: "Movimiento registrado correctamente." };
    } catch (error) {
      throw error;
    }
  }

  async cerrarCaja(idCaja) {
    try {
      const pool = database.getPool();

      // Verificar caja abierta
      const [rows] = await pool.query(
        "SELECT COUNT(1) AS count FROM caja WHERE id_caja = ? AND estado_caja = 'ABIERTA' AND estado = 1",
        [idCaja]
      );

      if (rows[0].count === 0) {
        throw new Error('La caja ya está cerrada o no existe.');
      }

      await pool.query(
        "UPDATE caja SET estado_caja = 'CERRADA', fecha_cierre = NOW() WHERE id_caja = ?",
        [idCaja]
      );

      return { message: "Caja cerrada correctamente." };
    } catch (error) {
      throw error;
    }
  }

  async listarCajas(estado = null) {
    try {
      const pool = database.getPool();
      let query = `
        SELECT 
          id_caja, fecha_apertura, fecha_cierre, total_ingresos, total_egresos, 
          estado_caja, id_usuario, id_sucursal, estado, fecha_creacion, fecha_actualizacion
        FROM caja
        WHERE estado = 1
      `;
      const params = [];

      if (estado) {
        query += " AND estado_caja = ?";
        params.push(estado);
      }

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async obtenerCajaAbiertaPorId(idCaja) {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(
        "SELECT id_caja, id_sucursal FROM caja WHERE id_caja = ? AND estado_caja = 'ABIERTA' AND estado = 1",
        [idCaja]
      );
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CajaModel();