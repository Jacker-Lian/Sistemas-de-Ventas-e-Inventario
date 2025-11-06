const db = require('../config/database');

class ProductoModel {
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM producto ORDER BY id_producto DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM producto WHERE id_producto = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(producto) {
    try {
      const { nombre, descripcion, precio_compra, precio_venta, stock, id_categoria, id_proveedor } = producto;
      const [result] = await db.query(
        'INSERT INTO producto (nombre, descripcion, precio_compra, precio_venta, stock, id_categoria, id_proveedor) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, precio_compra, precio_venta, stock, id_categoria, id_proveedor]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, producto) {
    try {
      const { nombre, descripcion, precio_compra, precio_venta, stock, id_categoria, id_proveedor } = producto;
      const [result] = await db.query(
        'UPDATE producto SET nombre = ?, descripcion = ?, precio_compra = ?, precio_venta = ?, stock = ?, id_categoria = ?, id_proveedor = ? WHERE id_producto = ?',
        [nombre, descripcion, precio_compra, precio_venta, stock, id_categoria, id_proveedor, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM producto WHERE id_producto = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductoModel;