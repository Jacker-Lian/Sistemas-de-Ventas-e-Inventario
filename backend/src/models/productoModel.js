const database = require('../config/database');

class ProductoModel {
  constructor() {
    this.pool = database.getPool();
  }

  async obtenerProductoPorId(id) {
    const query = 'SELECT id_producto AS id, nombre, precio_venta AS precio, stock, descripcion, estado FROM producto WHERE id_producto = ? AND estado = 1';
    
    const [rows] = await this.pool.query(query, [id]);
    return rows[0]; 
  }
//metodo usadoo por gandy mas y un compañero
  async obtenerProductos() {
    const query = 'SELECT id_producto AS id, nombre, precio_venta AS precio, stock, descripcion, estado FROM producto WHERE estado = 1';
    const [rows] = await this.pool.query(query); //esto es un tipo de coenccion a ala base de datos 
    return rows;
  }
/*
async obtenerSoloVentas() {
    const query = ` SELECT id_producto, SUM(cantidad) AS total_vendido FROM  detalle_venta GROUP BY   id_producto;  `;
           
    const [rows] = await this.pool.query(query);
    return rows;
}*/

  async buscarProductos(query) {
    const searchQuery = `SELECT id_producto AS id, nombre, precio_venta AS precio, stock, descripcion, estado FROM producto WHERE nombre LIKE ? AND estado = 1`;
    const [rows] = await this.pool.query(searchQuery, [`%${query}%`]);
    return rows;
  }

  async desactivarProducto(id) {
    const query = 'UPDATE producto SET estado = ? WHERE id_producto = ?';
    const [result] = await this.pool.query(query, [0, id]);
    return result.affectedRows > 0;
  }

  async crearProducto(producto) {
    const query = 'INSERT INTO producto (nombre, precio_venta, precio_compra, stock, descripcion, id_categoria, id_proveedor, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await this.pool.query(query, [
      producto.nombre,
      producto.precio_venta,
      producto.precio_compra,
      producto.stock,
      producto.descripcion,
      producto.id_categoria,
      producto.id_proveedor,
      1,
    ]);
    return result.insertId; // Devuelve el ID del nuevo producto
  }

  async actualizarProducto(id, producto) {
    const query = 'UPDATE producto SET nombre = ?, precio_venta = ?, precio_compra = ?, stock = ?, descripcion = ?, id_categoria = ?, id_proveedor = ? WHERE id_producto = ?';
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



  async obtenerStockConVentas() {
    const query = `
        SELECT 
            p.id_producto AS id, 
            p.nombre, 
            p.stock,
            p.stock_minimo, 
            IFNULL(SUM(v.cantidad), 0) AS vendidos,
            (p.stock <= p.stock_minimo) AS alerta_stock,
            p.precio_venta AS precio, 
            p.descripcion, 
            p.estado 
        FROM producto p
        LEFT JOIN detalle_venta v ON v.id_producto = p.id_producto
        WHERE p.estado = 1
        GROUP BY p.id_producto, p.nombre, p.stock, p.stock_minimo, p.precio_venta, p.descripcion, p.estado
        ORDER BY p.nombre;
    `;
    const [rows] = await this.pool.query(query);
    return rows;
}



  
  

  async obtenerProductosPorCategoria(id_categoria) {
    const query = 'SELECT id_producto AS id, nombre, precio_venta AS precio, stock, descripcion, estado FROM producto WHERE id_categoria = ? AND estado = 1';
    const [rows] = await this.pool.query(query, [id_categoria]);
    return rows;
  }

  async obtenerStockTotal() {
    const query = "SELECT SUM(stock) AS en_stock FROM producto WHERE estado = 1";
    const [result] = await this.pool.query(query);
    return result[0].en_stock || 0;
  }
  // By: WillianJC->
  async updateStock(id_producto, discount) {
    // Resta el stock de un producto: verifica que haya suficiente stock antes de restar y que el producto esté activo
    const query = 'UPDATE producto SET stock = stock - ? WHERE id_producto = ? AND stock >= ? AND estado = 1';
    const [result] = await this.pool.query(query, [discount, id_producto, discount]);
    return result.affectedRows > 0;
  }

  // <-By: WillianJC


}


module.exports = ProductoModel;
