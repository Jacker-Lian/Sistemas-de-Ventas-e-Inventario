const express = require('express');
const productoController = require('../controllers/productoController');
const { verificarToken, requireRole } = require('../middleware/verificarToken');

class ProductoRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    // Todas las rutas requieren autenticación
    this.router.use(verificarToken);

    // Obtener/buscar productos - Todos los roles autenticados
    this.router.get('/', productoController.obtenerProductos);

    // Obtener productos por categoría - Todos los roles autenticados
    this.router.get('/categoria/:id_categoria', productoController.obtenerProductosPorCategoria);

    // Obtener producto por ID - Todos los roles autenticados
    this.router.get('/:id', productoController.obtenerProductoPorId);

    // Crear producto - Solo ADMIN
    this.router.post('/', 
        requireRole(['ADMIN']), 
        productoController.crearProducto
    );

    // Actualizar producto - Solo ADMIN
    this.router.put('/:id', 
        requireRole(['ADMIN']), 
        productoController.actualizarProducto
    );

    // Desactivar producto - Solo ADMIN
    this.router.put('/:id/desactivar', 
        requireRole(['ADMIN']), 
        productoController.desactivarProducto
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ProductoRoutes;