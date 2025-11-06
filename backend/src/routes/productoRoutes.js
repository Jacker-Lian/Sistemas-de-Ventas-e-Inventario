const express = require('express');
const ProductoController = require('../controllers/productoController');

const router = express.Router();

// Obtener todos los productos
router.get('/productos', ProductoController.getAll);

// Obtener un producto por ID
router.get('/productos/:id', ProductoController.getById);

// Crear un nuevo producto
router.post('/productos', ProductoController.create);

// Actualizar un producto
router.put('/productos/:id', ProductoController.update);

// Eliminar un producto
router.delete('/productos/:id', ProductoController.delete);

module.exports = router;