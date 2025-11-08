const express = require('express');
const router = express.Router();
const { 
    getVentasTotales, 
    getInventarioStockBajo 
} = require('../controllers/reporteController');

router.get('/reporte/ventas-totales', getVentasTotales);
router.get('/reporte/stock-bajo', getInventarioStockBajo);

module.exports = router;
