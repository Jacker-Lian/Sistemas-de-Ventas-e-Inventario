const database = require('../config/database');

class Categoria {
  // Listar solo ACTIVAS
  static async findAll() {
    const pool = database.getPool();
    const [rows] = await pool.query(
      'SELECT id_categoria, nombre, descripcion, estado FROM categoria WHERE estado = 1'
    );
    return rows;
  }

  // Listar TODAS (Activas e Inactivas)
  static async findAllState() {
    const pool = database.getPool();
    const [rows] = await pool.query(
      'SELECT id_categoria, nombre, descripcion, estado FROM categoria'
    );
    return rows;
  }

  // Listar SOLO INACTIVAS
  static async findInactive() {
    const pool = database.getPool();
    const [rows] = await pool.query(
      'SELECT id_categoria, nombre, descripcion, estado FROM categoria WHERE estado = 0'
    );
    return rows;
  }

  // Buscar por nombre solo en ACTIVAS
  static async findByName(nombre) {
    const pool = database.getPool();
    const searchTerm = `%${nombre}%`;
    const [rows] = await pool.query(
      'SELECT id_categoria, nombre, descripcion, estado FROM categoria WHERE nombre LIKE ? AND estado = 1',
      [searchTerm]
    );
    return rows;
  }

  // Buscar por nombre solo en INACTIVAS
  static async findByNameInactive(nombre) {
    const pool = database.getPool();
    const searchTerm = `%${nombre}%`;
    const [rows] = await pool.query(
      'SELECT id_categoria, nombre, descripcion, estado FROM categoria WHERE nombre LIKE ? AND estado = 0',
      [searchTerm]
    );
    return rows;
  }

  // Buscar por nombre en todas
  static async findByNameAll(nombre) {
    const pool = database.getPool();
    const searchTerm = `%${nombre}%`;
    const [rows] = await pool.query(
      'SELECT id_categoria, nombre, descripcion, estado FROM categoria WHERE nombre LIKE ?',
      [searchTerm]
    );
    return rows;
  }

  // Crear nueva categoría (siempre inicia ACTIVA)
  static async create({ nombre, descripcion }) {
    const pool = database.getPool();
    const [result] = await pool.query(
      'INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion]
    );
    return { id_categoria: result.insertId, nombre, descripcion, estado: 1 };
  }

  // Actualizar nombre y descripción por ID
  static async update(id, { nombre, descripcion }) {
    const pool = database.getPool();
    const [result] = await pool.query(
      'UPDATE categoria SET nombre = ?, descripcion = ? WHERE id_categoria = ?',
      [nombre, descripcion, id]
    );
    return result.affectedRows > 0;
  }

  // Desactivación lógica (borrado)
  static async delete(id) {
    const pool = database.getPool();
    const [result] = await pool.query(
      'UPDATE categoria SET estado = 0 WHERE id_categoria = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  // Reactivación lógica
  static async reactivate(id) {
    const pool = database.getPool();
    const [result] = await pool.query(
      'UPDATE categoria SET estado = 1 WHERE id_categoria = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Categoria;
