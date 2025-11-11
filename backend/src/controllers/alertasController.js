// C:\gith\Sistemas-de-Ventas-e-Inventario\backend\src\controllers\alertasController.js

const AlertasModel = require('../models/alertasModel');

class AlertasController {
    constructor() {
        console.log("DEBUG A.9: Instancia de AlertasController creada.");
    }

    // Ruta: GET /api/alertas/activas
    async obtenerAlertasActivas(req, res) {
        console.log("DEBUG A.10: Controlador 'obtenerAlertasActivas' alcanzado.");
        try {
            const alertas = await AlertasModel.obtenerAlertasNoVistas();
            
            // Si quieres que el servidor active la revisión de stock antes de devolverlas
            // await AlertasModel.generarAlertasDeStock(); 

            res.status(200).json({
                message: "Alertas activas obtenidas con éxito.",
                data: alertas
            });
        } catch (error) {
            console.error("ERROR A.11: Error en obtenerAlertasActivas:", error.message);
            res.status(500).json({ 
                error: "Error interno del servidor al obtener las alertas." 
            });
        }
    }
    
    // Ruta: POST /api/alertas/marcar-visto/:id_alerta
    async marcarAlertaComoVista(req, res) {
        // ... (Implementar lógica para actualizar el campo 'visto' de la alerta)
        res.status(501).json({ message: "Función de marcar como vista aún no implementada." });
    }
}

module.exports = new AlertasController();