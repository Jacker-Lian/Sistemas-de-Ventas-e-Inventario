// C:\gith\Sistemas-de-Ventas-e-Inventario\backend\src\models\stockModel.js

const database = require('../config/database'); 

class StockModel {
    constructor() {
        console.log("DEBUG M.1: Instancia de StockModel creada.");
    }

    async getResumenInventario() {
        console.log("DEBUG M.2: StockModel.getResumenInventario() ejecutado. Obteniendo datos reales...");

        try {
    
            const conn = database.getPool();

            // 1. Obtener el STOCK ACTUAL TOTAL (De la tabla producto)
            const [stockResult] = await conn.query(
                "SELECT SUM(stock) AS en_stock FROM producto WHERE estado = 1"
            );
            const productos_en_stock = stockResult[0].en_stock || 0;


            // 2. Obtener la CANTIDAD TOTAL VENDIDA (De la tabla detalle_venta)
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