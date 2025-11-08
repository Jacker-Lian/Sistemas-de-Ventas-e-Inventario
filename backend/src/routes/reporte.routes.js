const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporte.controller');

// Ejemplo de un reporte: Ventas Totales por Rango de Fechas
router.get('/reportes/ventas', reporteController.getVentasTotales);

// Ejemplo de un reporte: Inventario de Stock Bajo
router.get('/reportes/inventario/stock-bajo', reporteController.getInventarioStockBajo);

// Puedes añadir más rutas aquí según los reportes que necesites (caja, gastos, etc.)

module.exports = router;