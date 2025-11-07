const database = require('../config/database');

class ProductoModel {
  constructor() {
    this.pool = database.getPool();
  }

  async obtenerProductoPorId(id) {
    const query = 'SELECT id_producto, nombre, precio_venta, stock, descripcion FROM producto WHERE id_producto = ?';
    const [rows] = await this.pool.query(query, [id]);
    return rows[0]; // Devuelve el primer producto encontrado
  }

  async obtenerProductos() {
    const query = 'SELECT id_producto, nombre, precio_venta, stock, descripcion FROM producto';
    const [rows] = await this.pool.query(query);
    return rows;
  }

  async crearProducto(producto) {
    const query = 'INSERT INTO producto (nombre, precio_venta, stock, descripcion) VALUES (?, ?, ?, ?)';
    const [result] = await this.pool.query(query, [
      producto.nombre,
      producto.precio_venta,
      producto.stock,
      producto.descripcion,
    ]);
    return result.insertId; // Devuelve el ID del nuevo producto
  }

  async actualizarProducto(id, producto) {
    const query = 'UPDATE producto SET nombre = ?, precio_venta = ?, stock = ?, descripcion = ? WHERE id_producto = ?';
    const [result] = await this.pool.query(query, [
      producto.nombre,
      producto.precio_venta,
      producto.stock,
      producto.descripcion,
      id,
    ]);
    return result.affectedRows > 0; // Si la actualización afectó alguna fila
  }

  async eliminarProducto(id) {
    const query = 'DELETE FROM producto WHERE id_producto = ?';
    const [result] = await this.pool.query(query, [id]);
    return result.affectedRows > 0; // Si el producto fue eliminado
  }
}

module.exports = ProductoModel;
