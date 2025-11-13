const { getPool } = require('../config/database');

const Sucursal = {

  obtenerPorId: async (id) => {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM sucursal WHERE id_sucursal = ?', [id]);
    return rows[0];
  },

  crear: async (datos) => {
    const pool = getPool();
    const { nombre, direccion, telefono, correo, estado } = datos;
    const [result] = await pool.query(
      `INSERT INTO sucursal (nombre, direccion, telefono, correo, estado) 
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, direccion, telefono, correo, estado ?? 1]
    );
    return result.insertId;
  },

  actualizar: async (id, datos) => {
    const pool = getPool();
    const { nombre, direccion, telefono, correo, estado } = datos;
    const [result] = await pool.query(
      `UPDATE sucursal SET nombre=?, direccion=?, telefono=?, correo=?, estado=? 
       WHERE id_sucursal=?`,
      [nombre, direccion, telefono, correo, estado, id]
    );
    return result.affectedRows;
  },

  eliminar: async (id) => {
    const pool = getPool();
    const [result] = await pool.query(
      'UPDATE sucursal SET estado = 0 WHERE id_sucursal = ?',
      [id]
    );
    return result.affectedRows;
  }
};

module.exports = Sucursal;
