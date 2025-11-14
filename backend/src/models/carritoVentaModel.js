const database = require("../config/database");

class CarritoVentaModel {
  constructor() {
    this.table = "carrito_venta";
  }

  /**
   * Agrega un producto al carrito y valida datos básicos antes.
   * @param {number} idVenta - ID de la venta principal.
   * @param {object} data - Objeto producto: { id_producto, cantidad, precio_unitario, subtotal }
   */
  async agregarProductoAlCarrito(idVenta, data = {}) {
    try {
      // Validación básica de insumos
      const { id_producto, cantidad, precio_unitario, subtotal } = data;

      if (!idVenta || !id_producto || !cantidad || !precio_unitario || !subtotal) {
        throw new Error("Todos los campos de producto y la venta son obligatorios.");
      }
      if (cantidad <= 0 || precio_unitario <= 0 || subtotal <= 0) {
        throw new Error("Cantidad, precio y subtotal deben ser mayores a cero.");
      }

      const pool = database.getPool();
      const query = `INSERT INTO ${this.table} 
        (id_venta, id_producto, cantidad, precio_unitario, subtotal) 
        VALUES (?, ?, ?, ?, ?)`;

      await pool.query(query, [
        idVenta,
        id_producto,
        cantidad,
        precio_unitario,
        subtotal,
      ]);
      // Opcional: retorna un valor de éxito estándar
      return { success: true, message: "Producto agregado al carrito correctamente." };
    } catch (error) {
      throw new Error("Error al agregar producto al carrito: " + error.message);
    }
  }
}

module.exports = new CarritoVentaModel();
