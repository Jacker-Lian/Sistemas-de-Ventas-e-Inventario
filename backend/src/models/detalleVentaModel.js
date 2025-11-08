const { createConnection } = require("mysql2");
const database =require("../config/database");

class DetalleVentaModel {
    constructor(){
        this.table = "detalle_venta";
    }

    /**
   * Registra producto de una venta
   * @param {object} datosDetalle
   * @param {object} connection
   */
    async registrar(datosDetalle, connection){
        try{
            //datos del objeto
            const{
                id_venta,
                id_producto,
                cantidad,
                precio_unitario,
                subtotal
            } =datosDetalle;

            //consulta para insertar en la tabla
            const query =`INSERT INTO ${this.table}
            (id_venta, id_producto, cantidad, precio_unitario, subtotal)
            VALUES (?, ?, ?, ?, ?)`;

            //se ejecuta la consulta
            const [resultado] = await connection.query(query, [
                id_venta,
                id_producto,
                cantidad,
                precio_unitario,
                subtotal
            ]);
            return resultado; //resultado del insert
        } catch(error){
            throw new Error("Error al registrar detalle de venta " + error.message);
        }

    }

    /**
   * Obtiene todos los productos de una venta específica.
   * @param {number} id_venta - El ID de la venta que queremos consultar.
   */
  async obtenerPorIdVenta(id_venta) {
    try {
      const pool = database.getPool(); 
      
      const query = `
        SELECT 
          dv.id_producto,
          dv.cantidad,
          dv.precio_unitario,
          dv.subtotal,
          p.nombre AS nombre_producto 
        FROM ${this.table} dv
        JOIN producto p ON dv.id_producto = p.id_producto
        WHERE dv.id_venta = ?
      `;

      const [rows] = await pool.query(query, [id_venta]);
      return rows; // Devuelve un array con los productos de esa venta

    } catch (error) {
      throw new Error("Error al obtener detalles de la venta: " + error.message);
    }
  }
}

module.exports =DetalleVentaModel;