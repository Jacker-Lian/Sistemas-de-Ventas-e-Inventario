const express = require('express');
const AjusteInventarioController = require('../controllers/ajusteInventarioController');

const router = express.Router();

// RUTA 1: POST / (Crear Ajuste)
router.post('/', AjusteInventarioController.crearAjuste);

// RUTA 2: GET / (Obtener Historial General)
router.get('/', AjusteInventarioController.obtenerTodosLosAjustes);

// RUTA 3: GET /producto/:idProducto (Obtener Historial Específico)
router.get('/producto/:idProducto', AjusteInventarioController.obtenerAjustesPorProducto);

module.exports = router;