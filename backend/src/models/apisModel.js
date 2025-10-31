const database = require('../config/database');

class UsuarioModel {
  constructor() {
    this.table = 'usuarios';
  }

  /**
   * Obtener usuario por email
   * @param {string} email
   */
  async obtenerPorEmail(email) {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(
        `SELECT id_usuario, nombre_usuario, email_usuario, password_hash, rol_usuario, estado FROM ${this.table} WHERE email_usuario = ?`,
        [email]
      );
      return rows[0];
    } catch (error) {
      throw new Error('Error al obtener usuario: ' + error.message);
    }
  }
}

module.exports = UsuarioModel;
