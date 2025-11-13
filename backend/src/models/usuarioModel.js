const database = require('../config/database');

class UsuarioModel {
  constructor() {
    this.table = 'usuarios';
  }

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

  // By: WillianJC->
  async getUserById(id_usuario) {
    try {
      const pool = database.getPool();
      const response = await pool.query(
        `SELECT id_usuario, nombre_usuario, email_usuario, rol_usuario FROM ${this.table} WHERE id_usuario = ? AND estado = 1`,
        [id_usuario]
      );
      if(response[0].length === 0) {
        return null;
      }
      return response[0];
    } catch (error) {

    }
  }

  // <-By: WillianJC
}

module.exports = UsuarioModel;  