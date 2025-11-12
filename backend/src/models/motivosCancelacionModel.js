const database = require("../config/database");

class MotivosCancelacionModel {
  constructor() {
    this.table = "motivos_cancelacion";
  }

  /**
   * Crear nuevo motivo de cancelación
   * @param {string} descripcion
   */
  async crear(descripcion) {
    const pool = database.getPool();
    
    if (!descripcion || descripcion.length === 0) {
      throw new Error("La descripción de cancelación no puede estar vacía.");
    }

    const [result] = await pool.query(
      `INSERT INTO ${this.table} (descripcion) VALUES (?)`,
      [descripcion]
    );
    
    return result.insertId;
  }

  /**
   * Obtener todos los motivos activos
   */
  async obtenerTodosActivos() {
    const pool = database.getPool();
    const [rows] = await pool.query(
      `SELECT id_motivo, descripcion FROM ${this.table} WHERE estado = 1`
    );
    return rows;
  }

  /**
   * Obtener motivo por ID
   * @param {number} id_motivo
   */
  async obtenerPorId(id_motivo) {
    const pool = database.getPool();
    const [rows] = await pool.query(
      `SELECT id_motivo, descripcion FROM ${this.table} WHERE id_motivo = ? AND estado = 1`,
      [id_motivo]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Desactivar motivo de cancelación
   * @param {number} id_motivo
   */
  async desactivar(id_motivo) {
    const pool = database.getPool();

    if (!id_motivo || !Number.isInteger(id_motivo) || id_motivo <= 0) {
      throw new Error("El id_motivo es requerido y debe ser un número entero positivo.");
    }

    const [result] = await pool.query(
      `UPDATE ${this.table} SET estado = 0 WHERE id_motivo = ?`,
      [id_motivo]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = MotivosCancelacionModel;