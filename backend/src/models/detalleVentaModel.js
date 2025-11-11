const database =require("../config/database");

class DetalleVentaModel {
    
    constructor() {
        this.pool = database.getPool();
      }

    /**
   * Registra producto de una venta
   * @param {object} datosDetalle
   */
    async registrarDetalleVenta(datosDetalle){
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
            const [resultado] = await pool.query(query, [
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
     * @param {number} idVenta 
     * @returns {Promise<Array<Object>>} 
     */
    async getDetallesPorVenta(idVenta) {
        try {
            const query = `
                SELECT 
                    dv.id AS id_detalle, 
                    dv.id_producto, 
                    p.nombre AS nombre_producto,
                    dv.cantidad, 
                    dv.precio_unitario,
                    (dv.cantidad * dv.precio_unitario) AS subtotal
                FROM detalle_venta dv
                JOIN producto p ON dv.id_producto = p.id
                WHERE dv.id_venta = ?
            `;
            
            const [rows] = await this.pool.query(query, [idVenta]);
            
            return rows;
        } catch (error) {
            console.error("Error en el Modelo al obtener detalles por venta:", error);
            throw error; 
        }
    }
}

module.exports =DetalleVentaModel;
