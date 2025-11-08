const database = require("../config/database");

class CajaModel {
  constructor() {
    this.table = "caja";
  }

  // Abrir una nueva caja
  async abrirCaja({ id_usuario, id_sucursal }) {
    try {
      const pool = database.getPool();

      // Verificar que el usuario exista
      const [usuario] = await pool.query(
        "SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND estado = 1",
        [id_usuario]
      );
      if (usuario.length === 0)
        throw new Error("El usuario no existe o está inactivo.");

      // Verificar si ya hay una caja abierta para ese usuario
      const [cajaAbierta] = await pool.query(
        "SELECT * FROM caja WHERE id_usuario = ? AND estado_caja = 'ABIERTA'",
        [id_usuario]
      );
      if (cajaAbierta.length > 0)
        throw new Error("Ya existe una caja abierta para este usuario.");

      // Insertar la nueva caja
      const [result] = await pool.query(
        `INSERT INTO ${this.table} (fecha_apertura, id_usuario, id_sucursal, estado_caja) VALUES (NOW(), ?, ?, 'ABIERTA')`,
        [id_usuario, id_sucursal || null]
      );

      return result.insertId;
    } catch (error) {
      throw new Error("Error al abrir la caja: " + error.message);
    }
  }

  // Registrar ingreso o egreso
  async registrarMovimiento(id_caja, tipo, monto) {
    try {
      const pool = database.getPool();

      // Verificar que la caja esté abierta
      const [caja] = await pool.query(
        "SELECT * FROM caja WHERE id_caja = ? AND estado_caja = 'ABIERTA'",
        [id_caja]
      );
      if (caja.length === 0)
        throw new Error("La caja no existe o ya está cerrada.");

      if (isNaN(monto) || monto <= 0)
        throw new Error("El monto debe ser un número positivo.");

      if (tipo === "INGRESO") {
        await pool.query(
          "UPDATE caja SET total_ingresos = total_ingresos + ? WHERE id_caja = ?",
          [monto, id_caja]
        );
      } else if (tipo === "EGRESO") {
        await pool.query(
          "UPDATE caja SET total_egresos = total_egresos + ? WHERE id_caja = ?",
          [monto, id_caja]
        );
      } else {
        throw new Error("Tipo de movimiento inválido. Use 'INGRESO' o 'EGRESO'.");
      }

      return true;
    } catch (error) {
      throw new Error("Error al registrar el movimiento: " + error.message);
    }
  }

  // Cerrar caja
  async cerrarCaja(id_caja) {
    try {
      const pool = database.getPool();

      // Verificar caja abierta
      const [rows] = await pool.query(
        "SELECT * FROM caja WHERE id_caja = ? AND estado_caja = 'ABIERTA'",
        [id_caja]
      );
      if (rows.length === 0)
        throw new Error("No se encontró una caja abierta con ese ID.");

      // Actualizar estado
      await pool.query(
        `UPDATE caja SET estado_caja = 'CERRADA', fecha_cierre = NOW() WHERE id_caja = ?`,
        [id_caja]
      );

      return true;
    } catch (error) {
      throw new Error("Error al cerrar la caja: " + error.message);
    }
  }

  // Listar cajas (abiertas o cerradas)
  async listarCajas(estado = null) {
    try {
      const pool = database.getPool();
      let query = "SELECT * FROM caja";
      const params = [];

      if (estado) {
        query += " WHERE estado_caja = ?";
        params.push(estado);
      }

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw new Error("Error al listar las cajas: " + error.message);
    }
  }
}

module.exports = CajaModel;
