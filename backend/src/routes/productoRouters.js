const express = require('express');
const productoController = require('../controllers/productoController');
const router = express.Router();

// Ruta para obtener todos los productos
router.get('/productos', productoController.obtenerProductos);

// Ruta para buscar productos por similitud
router.get('/productos/search', productoController.buscarProductos);

// Ruta para obtener un producto por su ID
router.get('/productos/:id', productoController.obtenerProductoPorId);

// Ruta para crear un producto
router.post('/productos', productoController.crearProducto);

// Ruta para actualizar un producto
router.put('/productos/:id', productoController.actualizarProducto);

// Ruta para desactivar un producto (marcar como inactivo)
router.put('/productos/:id/deactivate', productoController.desactivarProducto);

// Ruta para eliminar un producto
router.delete('/productos/:id', productoController.eliminarProducto);

module.exports = router;
