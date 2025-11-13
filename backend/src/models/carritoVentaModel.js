const database = require("../config/database");

class CarritoVentaModel {
  constructor() {
    this.table = "carrito_venta";
  }

  async agregarProductoAlCarrito(id_venta, data = {}) {
    try {
      const producto = {
        idProducto: data.id_producto,
        cantidad: data.cantidad,
        precioUnitario: data.precio_unitario,
        subtotal: data.subtotal,
      };

      const pool = database.getPool();

      const query = `INSERT INTO ${this.table} 
                (id_venta, id_producto, cantidad, precio_unitario, subtotal) 
                VALUES (?, ?, ?, ?, ?)`;

      await pool.query(query, [
        id_venta,
        producto.idProducto,
        producto.cantidad,
        producto.precioUnitario,
        producto.subtotal,
      ]);
    } catch (error) {
      throw new Error("Error al agregar producto al carrito: " + error.message);
    }
  }
}

module.exports = CarritoVentaModel;