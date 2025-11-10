const express = require('express');
const router = express.Router();
const detalleVentaController = require('../controllers/detalleVentaController');

/**
 * Rutas para el Detalle de Venta
 * * POST /api/detalle-venta  -> Registra un nuevo detalle de venta
 */

// Ruta para registrar un nuevo detalle de venta
router.post('/detalle-venta', detalleVentaController.registrarDetalle);

module.exports = router;