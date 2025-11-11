// C:\gith\Sistemas-de-Ventas-e-Inventario\backend\src\controllers\stockController.js

const stockModel = require('../models/stockModel'); // ⬅️ Importamos el Modelo

class StockController {
    constructor() {
        console.log("DEBUG C.1: Instancia de StockController creada.");
    }

    // Método para obtener el resumen de inventario (Stock, Vendido, Total)
    async obtenerStock(req, res) {
        console.log("DEBUG C.2: Controlador 'obtenerStock' alcanzado. Llamando al Modelo...");
        try {
            // Llama al modelo para obtener los datos de la base de datos
            const resumen = await stockModel.getResumenInventario(); 

            if (!resumen) {
                console.log("DEBUG C.3: El Modelo devolvió datos nulos.");
                return res.status(404).json({ success: false, mensaje: "No se encontraron datos de inventario." });
            }

            console.log("DEBUG C.4: Datos de Stock obtenidos del Modelo con éxito. Enviando respuesta.");
            return res.status(200).json({
                success: true,
                mensaje: "Resumen de stock obtenido correctamente.",
                data: resumen
            });

        } catch (error) {
            console.error("ERROR C.5: Error en obtenerStock (capturado del Modelo):", error.message, "\nStack:", error.stack);
            return res.status(500).json({
                success: false,
                mensaje: "Error interno del servidor al obtener el resumen de stock",
                error: error.message
            });
        }
    }
}

// Exportamos una instancia para que el router pueda usar sus métodos
module.exports = new StockController();