// src/models/motivosCancelacionModel.js
const database = require("../config/database");

class MotivosCancelacionModel {
  constructor() {
    this.table = "motivos_cancelacion";
  }

  // Crear nuevo motivo de cancelación
  async crear(descripcion) {
    try {
      const pool = database.getPool();

      if (!descripcion || descripcion.trim().length === 0) {
        throw new Error("La descripción de cancelación no puede estar vacía.");
      }

      const [result] = await pool.query(
        `INSERT INTO ${this.table} (descripcion) VALUES (?)`,
        [descripcion.trim()]
      );

      return result.insertId;
    } catch (error) {
      throw new Error("Error al crear motivo de cancelación: " + error.message);
    }
  }

  // Obtener todos los motivos activos
  async obtenerTodosActivos() {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(
        `SELECT id_motivo, descripcion FROM ${this.table} WHERE estado = 1`
      );
      return rows;
    } catch (error) {
      throw new Error("Error al obtener motivos activos: " + error.message);
    }
  }

  // Obtener motivo por ID
  async obtenerPorId(id_motivo) {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(
        `SELECT id_motivo, descripcion FROM ${this.table} WHERE id_motivo = ? AND estado = 1`,
        [id_motivo]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error("Error al obtener motivo: " + error.message);
    }
  }

  // Actualizar descripción de motivo
  async actualizar(id_motivo, descripcion) {
    try {
      const pool = database.getPool();

      if (!descripcion || descripcion.trim().length === 0) {
        throw new Error("La descripción no puede estar vacía.");
      }

      const [result] = await pool.query(
        `UPDATE ${this.table} SET descripcion = ? WHERE id_motivo = ?`,
        [descripcion.trim(), id_motivo]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Error al actualizar motivo: " + error.message);
    }
  }

  // Desactivar motivo de cancelación
  async desactivar(id_motivo) {
    try {
      const pool = database.getPool();

      if (!id_motivo || !Number.isInteger(id_motivo) || id_motivo <= 0) {
        throw new Error(
          "El id_motivo es requerido y debe ser un número entero positivo."
        );
      }

      const [result] = await pool.query(
        `UPDATE ${this.table} SET estado = 0 WHERE id_motivo = ?`,
        [id_motivo]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Error al desactivar motivo: " + error.message);
    }
  }
}

// Exportar la **clase** como constructor
module.exports = MotivosCancelacionModel;
