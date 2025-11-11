// C:\gith\Sistemas-de-Ventas-e-Inventario\backend\src\models\stockModel.js

const database = require('../config/database'); // ⬅️ Tu módulo de conexión a MySQL

class StockModel {
    constructor() {
        console.log("DEBUG M.1: Instancia de StockModel creada.");
    }

    async getResumenInventario() {
        console.log("DEBUG M.2: StockModel.getResumenInventario() ejecutado.");
        try {
            // ⚠️ AQUÍ IRÍAN TUS CONSULTAS REALES A LA BASE DE DATOS
            // Para fines de depuración y evitar el error, devolvemos datos simulados.

            // Ejemplo: Contar productos en stock (reemplaza esto)
            // const [stockResult] = await database.query("SELECT COUNT(*) AS total FROM productos WHERE en_stock > 0");

            const resumen = {
                productos_en_stock: 500, // ⬅️ Dato de DB (Reemplazar)
                productos_vendidos: 230,  // ⬅️ Dato de DB (Reemplazar)
                total_productos: 730
            };

            console.log("DEBUG M.3: Consultas de Stock/Ventas simuladas ejecutadas con éxito.");
            return resumen;
        } catch (error) {
            console.error("ERROR M.4: Fallo en la consulta SQL de Stock:", error.message);
            throw error; // Propagar el error al controlador
        }
    }
}

// Exportamos una instancia para que el controlador pueda usarla
module.exports = new StockModel();