// C:\gith\Sistemas-de-Ventas-e-Inventario\backend\src\routes\alertasRoutes.js

const express = require('express');
const router = express.Router();
const AlertasController = require('../controllers/alertasController');

console.log("DEBUG R.5: Express cargado en alertasRoutes.");

// Ruta para obtener las alertas activas (no vistas)
router.get('/alertas/activas', AlertasController.obtenerAlertasActivas);
console.log("DEBUG R.6: Ruta /alertas/activas definida.");

// Ruta para marcar una alerta como vista (Notificación eliminada)
router.post('/alertas/marcar-visto/:id', AlertasController.marcarAlertaComoVista);
console.log("DEBUG R.7: Ruta /alertas/marcar-visto/:id definida.");

module.exports = router;