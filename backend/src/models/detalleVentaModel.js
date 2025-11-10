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
    async registrarDetalleVenta(datosDetalle, connection){
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
}

module.exports =DetalleVentaModel;
