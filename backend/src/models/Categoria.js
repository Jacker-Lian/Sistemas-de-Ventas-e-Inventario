
const database = require('../config/database');

class Categoria {
    
    static async findAll() {
        const pool = database.getPool();
        const [rows] = await pool.query('SELECT id_categoria, nombre, descripcion, estado FROM categoria WHERE estado = 1'); 
        return rows;
    }

    static async findByName(nombre) {
        const pool = database.getPool();
        const searchTerm = `%${nombre}%`;
        const [rows] = await pool.query(
            'SELECT id_categoria, nombre, descripcion, estado FROM categoria WHERE nombre LIKE ? AND estado = 1', 
            [searchTerm]
        );
        return rows;
    }
    
    static async create({ nombre, descripcion }) {
        const pool = database.getPool();
        const [result] = await pool.query(
            'INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion]
        );
        return { id_categoria: result.insertId, nombre, descripcion, estado: 1}; 
    }

    static async update(id, { nombre, descripcion }) {
        const pool = database.getPool();
        const [result] = await pool.query(
            'UPDATE categoria SET nombre = ?, descripcion = ? WHERE id_categoria = ?',
            [nombre, descripcion, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const pool = database.getPool();
        const [result] = await pool.query('UPDATE categoria SET estado = 0 WHERE id_categoria = ?', [id]); 
        return result.affectedRows > 0;
    }
}

module.exports = Categoria;