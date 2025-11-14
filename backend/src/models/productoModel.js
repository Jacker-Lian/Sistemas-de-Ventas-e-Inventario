const database = require('../config/database');

class ProductoModel {
  constructor() {
    this.pool = database.getPool();
  }

  async obtenerProductoPorId(id) {
    const query = `
      SELECT 
        id_producto AS id, 
        nombre, 
        precio_venta, 
        precio_compra,
        stock, 
        descripcion, 
        estado, 
        id_categoria, 
        id_proveedor
      FROM producto 
      WHERE id_producto = ? AND estado = 1`;
    const [rows] = await this.pool.query(query, [id]);
    return rows[0];
  }

  async obtenerProductos() {
    const query = `
      SELECT 
        id_producto AS id, 
        nombre, 
        precio_venta, 
        precio_compra,
        stock, 
        descripcion, 
        estado, 
        id_categoria, 
        id_proveedor
      FROM producto 
      WHERE estado = 1`;
    const [rows] = await this.pool.query(query);
    return rows;
  }

  async buscarProductos(query) {
    const searchQuery = `
      SELECT 
        id_producto AS id, 
        nombre, 
        precio_venta, 
        precio_compra,
        stock, 
        descripcion, 
        estado, 
        id_categoria, 
        id_proveedor
      FROM producto 
      WHERE nombre LIKE ? AND estado = 1`;
    const [rows] = await this.pool.query(searchQuery, [`%${query}%`]);
    return rows;
  }

  async desactivarProducto(id) {
    const query = 'UPDATE producto SET estado = 0 WHERE id_producto = ?';
    const [result] = await this.pool.query(query, [id]);
    return result.affectedRows > 0;
  }

  async crearProducto(producto) {
    const query = `
      INSERT INTO producto (
        nombre, 
        precio_venta, 
        precio_compra, 
        stock, 
        descripcion, 
        id_categoria, 
        id_proveedor, 
        estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const [result] = await this.pool.query(query, [
      producto.nombre,
      producto.precio_venta,
      producto.precio_compra,
      producto.stock,
      producto.descripcion,
      producto.id_categoria,
      producto.id_proveedor,
      1, // Estado activo por defecto
    ]);
    return result.insertId;
  }

  async actualizarProducto(id, producto) {
    const query = `
      UPDATE producto 
      SET 
        nombre = ?, 
        precio_venta = ?, 
        precio_compra = ?, 
        stock = ?, 
        descripcion = ?, 
        id_categoria = ?, 
        id_proveedor = ?
      WHERE id_producto = ?`;
    
    const [result] = await this.pool.query(query, [
      producto.nombre,
      producto.precio_venta,
      producto.precio_compra,
      producto.stock,
      producto.descripcion,
      producto.id_categoria,
      producto.id_proveedor,
      id,
    ]);
    return result.affectedRows > 0;
  }

  async obtenerProductosPorCategoria(id_categoria) {
    const query = `
      SELECT 
        id_producto AS id, 
        nombre, 
        precio_venta, 
        precio_compra,
        stock, 
        descripcion, 
        estado, 
        id_categoria, 
        id_proveedor
      FROM producto 
      WHERE id_categoria = ? AND estado = 1`;
    const [rows] = await this.pool.query(query, [id_categoria]);
    return rows;
  }

  // Método para actualizar stock (usado en ventas)
  async updateStock(id_producto, discount) {
    // Resta el stock de un producto: verifica que haya suficiente stock antes de restar
    const query = `
      UPDATE producto 
      SET stock = stock - ? 
      WHERE id_producto = ? AND stock >= ? AND estado = 1`;
    const [result] = await this.pool.query(query, [discount, id_producto, discount]);
    return result.affectedRows > 0;
  }
}

module.exports = ProductoModel;