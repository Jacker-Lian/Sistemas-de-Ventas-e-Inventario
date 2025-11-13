const database = require("../config/database");

class MotivoCancelacionModel {
  constructor() {
    this.table = "motivo_cancelacion";
  }

  async obtenerMotivoCancelacionByID(id_motivo) {
    try {
      const pool = database.getPool();
      const query = `SELECT id_motivo, descripcion FROM ${this.table} WHERE id_motivo = ? AND estado = 1`;
      const [rows] = await pool.query(query, [id_motivo]);
      if (rows.length === 0) {
        throw new Error("No se encontraron motivos de cancelacion");
      }

      return rows;
    } catch (error) {
      throw new Error(
        "Error al obtener motivos de cancelacion: " + error.message
      );
    }
  }

  async registrarMotivoCancelacion(descripcion) {
    try {
      const pool = database.getPool();

      if (!descripcion || descripcion.length === 0)
        throw new Error("La descripción de cancelación no puede estar vacía.");

      const [result] = await pool.query(
        `INSERT INTO motivos_cancelacion (descripcion) VALUES (?)`,
        [descripcion]
      );

      return result.insertId;
    } catch (error) {
      throw new Error(
        "Error al registrar motivo de cancelación: " + error.message
      );
    }
  }

  async actualizarMotivoCancelacion(id_motivo, descripcion) {
    try {
      const pool = database.getPool();
      const [result] = await pool.query(
        `UPDATE motivos_cancelacion SET descripcion = ? WHERE id_motivo = ?`,
        [descripcion, id_motivo]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(
        "Error al actualizar motivo de cancelación: " + error.message
      );
    }
  }

  async obtenerMotivosCancelacion() {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(
        `SELECT id_motivo, descripcion FROM motivos_cancelacion WHERE estado = 1`
      );
      return rows;
    } catch (error) {
      throw new Error(
        "Error al obtener motivos de cancelación: " + error.message
      );
    }
  }

  async desactivarMotivoCancelacion(id_motivo) {
    try {
      const pool = database.getPool();

      if (!id_motivo || !Number.isInteger(id_motivo) || id_motivo <= 0)
        throw new Error(
          "El id_motivo es requerido y debe ser un número entero positivo."
        );

      const [result] = await pool.query(
        `UPDATE motivos_cancelacion SET estado = 0 WHERE id_motivo = ?`,
        [id_motivo]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(
        "Error al desactivar motivo de cancelación: " + error.message
      );
    }
  }
}

module.exports = MotivoCancelacionModel;
