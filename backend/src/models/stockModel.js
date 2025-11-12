// C:\gith\Sistemas-de-Ventas-e-Inventario\backend\src\models\stockModel.js

const database = require('../config/database');
const ProductoModel = require('./productoModel');
const DetalleVentaModel = require('./detalleVentaModel');
class StockModel {
    constructor() {
        console.log("DEBUG M.1: Instancia de StockModel creada.");
        this.productoModel = new ProductoModel();
        this.detalleVentaModel = new DetalleVentaModel();
    }

    async getResumenInventario() {
        console.log("DEBUG M.2: StockModel.getResumenInventario() ejecutado. Obteniendo datos reales...");

        try {

            const conn = database.getPool();


            const productos_en_stock = await this.productoModel.obtenerStockTotal();



            // const productos_vendidos = vendidoResult[0].vendidos || 0;
            const productos_vendidos = await this.detalleVentaModel.obtenerCantidadTotalVendida();

            const resumen = {
                productos_en_stock: parseInt(productos_en_stock) || 0,
                productos_vendidos: parseInt(productos_vendidos) || 0,
                total_productos: (parseInt(productos_en_stock) || 0) + (parseInt(productos_vendidos) || 0)
            };

            console.log("DEBUG M.3: Resumen de Stock/Ventas calculado con éxito:", resumen);
            return resumen;
        } catch (error) {
            console.error("ERROR M.4: Fallo en la consulta SQL detock/Ventas:", error.message);
            throw error;
        }
    }
}

module.exports = new StockModel();