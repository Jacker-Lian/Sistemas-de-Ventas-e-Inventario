// C:\gith\Sistemas-de-Ventas-e-Inventario\backend\src\models\stockModel.js

const database = require('../config/database');
const ProductoModel = require('./productoModel');
class StockModel {
    constructor() {
        console.log("DEBUG M.1: Instancia de StockModel creada.");
        this.productoModel = new ProductoModel();
    }

    async getResumenInventario() {
        console.log("DEBUG M.2: StockModel.getResumenInventario() ejecutado. Obteniendo datos reales...");

        try {

            const conn = database.getPool();

            // 1. Obtener el STOCK ACTUAL TOTAL (¡REFACTORIZADO!)
            const productos_en_stock = await this.productoModel.obtenerStockTotal();


    
            const [vendidoResult] = await conn.query(
                "SELECT SUM(cantidad) AS vendidos FROM detalle_venta"
            );
            const productos_vendidos = vendidoResult[0].vendidos || 0;

            // 3. Crear el objeto de resumen
            const resumen = {
                productos_en_stock: parseInt(productos_en_stock),
                productos_vendidos: parseInt(productos_vendidos),
                total_productos: parseInt(productos_en_stock) + parseInt(productos_vendidos)
            };

            console.log("DEBUG M.3: Resumen de Stock/Ventas calculado con éxito:", resumen);
            return resumen;
        } catch (error) {
            console.error("ERROR M.4: Fallo en la consulta SQL de Stock:", error.message);
            throw error;
        }
    }
}

module.exports = new StockModel();