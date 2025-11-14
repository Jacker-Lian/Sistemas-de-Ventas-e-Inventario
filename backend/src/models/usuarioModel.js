const database = require('../config/database');

class UsuarioModel {
  constructor() {
    this.table = 'usuarios';
  }

  // Obtener usuario por email
  async obtenerPorEmail(email) {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(
        'SELECT id_usuario, nombre_usuario, email_usuario, password_hash, rol_usuario, estado FROM usuarios WHERE email_usuario = ?',
        [email]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  // Obtener usuario por ID
  async getUserById(id_usuario) {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(
        'SELECT id_usuario, nombre_usuario, email_usuario, rol_usuario FROM usuarios WHERE id_usuario = ? AND estado = 1',
        [id_usuario]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw new Error(`Error al obtener usuario por ID: ${error.message}`);
    }
  }

  // Agregar nuevas funciones aquí según funcionalidad fusionada con api

  async actualizarDatosUsuario(id_usuario, datos) {
    const keys = Object.keys(datos);
    const setString = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => datos[k]);
    values.push(id_usuario);

    try {
      const pool = database.getPool();
      const [result] = await pool.query(
        `UPDATE usuarios SET ${setString} WHERE id_usuario = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }
}

module.exports = UsuarioModel;
