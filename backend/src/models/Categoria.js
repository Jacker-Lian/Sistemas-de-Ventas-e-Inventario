// models/Categoria.js
const database = require('../config/database');

class Categoria {
  static async findAll() {
    const pool = database.getPool();
    const [rows] = await pool.query('SELECT * FROM categoria');
    return rows;
  }

  static async findById(id) {
    const pool = database.getPool();
    const [rows] = await pool.query('SELECT * FROM categoria WHERE id_categoria = ?', [id]);
    return rows[0];
  }

  static async create({ nombre, descripcion }) {
    const pool = database.getPool();
    const [result] = await pool.query(
      'INSERT INTO categoria (nombre, descripcion, activo) VALUES (?, ?, TRUE)',
      [nombre, descripcion]
    );
    return { id_categoria: result.insertId, nombre, descripcion };
  }

  static async update(id, { nombre, descripcion, activo }) {
    const pool = database.getPool();
    const [result] = await pool.query(
      'UPDATE categoria SET nombre = ?, descripcion = ?, activo = ? WHERE id_categoria = ?',
      [nombre, descripcion, activo, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const pool = database.getPool();
    const [result] = await pool.query('UPDATE categoria SET activo = FALSE WHERE id_categoria = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Categoria;
