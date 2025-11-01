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

  async crearUsuario({ nombre_usuario, email_usuario, password_hash, rol_usuario = 'USER', estado = 1 }) {
    try {
      const pool = database.getPool();
      const [result] = await pool.query(
        `INSERT INTO ${this.table} (nombre_usuario, email_usuario, password_hash, rol_usuario, estado) VALUES (?, ?, ?, ?, ?)`,
        [nombre_usuario, email_usuario, password_hash, rol_usuario, estado]
      );
      return { id_usuario: result.insertId, nombre_usuario, email_usuario, rol_usuario, estado };
    } catch (error) {
      throw new Error('Error al crear usuario: ' + error.message);
    }
  }

  async listarUsuarios() {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(
        `SELECT id_usuario, nombre_usuario, email_usuario, rol_usuario, estado FROM ${this.table} ORDER BY id_usuario DESC`
      );
      return rows;
    } catch (error) {
      throw new Error('Error al listar usuarios: ' + error.message);
    }
  }

  async obtenerPorId(id) {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(
        `SELECT id_usuario, nombre_usuario, email_usuario, rol_usuario, estado FROM ${this.table} WHERE id_usuario = ? LIMIT 1`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw new Error('Error al obtener usuario por id: ' + error.message);
    }
  }

  async actualizarUsuario(id, fields) {
    try {
      const pool = database.getPool();
      const updates = [];
      const params = [];

      if (fields.nombre_usuario) { updates.push('nombre_usuario = ?'); params.push(fields.nombre_usuario); }
      if (fields.email_usuario) { updates.push('email_usuario = ?'); params.push(fields.email_usuario); }
      if (typeof fields.estado !== 'undefined') { updates.push('estado = ?'); params.push(fields.estado ? 1 : 0); }
      if (fields.rol_usuario) { updates.push('rol_usuario = ?'); params.push(fields.rol_usuario); }
      if (fields.password_hash) { updates.push('password_hash = ?'); params.push(fields.password_hash); }

      if (updates.length === 0) return null;

      params.push(id);
      const sql = `UPDATE ${this.table} SET ${updates.join(', ')} WHERE id_usuario = ?`;
      await pool.query(sql, params);
      return true;
    } catch (error) {
      throw new Error('Error al actualizar usuario: ' + error.message);
    }
  }

  async desactivarUsuario(id) {
    try {
      const pool = database.getPool();
      await pool.query(`UPDATE ${this.table} SET estado = 0 WHERE id_usuario = ?`, [id]);
      return true;
    } catch (error) {
      throw new Error('Error al desactivar usuario: ' + error.message);
    }
  }
}

module.exports = UsuarioModel;
