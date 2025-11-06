const express = require('express');
const router = express.Router();
const AjusteInventarioController = require('../controllers/ajusteInventarioController');

// Crear un nuevo ajuste de inventario
router.post('/', AjusteInventarioController.crearAjuste);

// Obtener todos los ajustes de inventario
router.get('/', AjusteInventarioController.obtenerTodosLosAjustes);

// Obtener un ajuste de inventario específico por ID
router.get('/:id', AjusteInventarioController.obtenerAjustePorId);

// Obtener ajustes de un producto específico
router.get('/producto/:idProducto', AjusteInventarioController.obtenerAjustesPorProducto);

module.exports = router;
