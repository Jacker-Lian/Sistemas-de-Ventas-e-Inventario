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

    // Obtener/buscar productos - ADMIN y CAJA
    this.router.get('/', 
        requireRole(['ADMIN', 'CAJA']), 
        productoController.obtenerProductos
    );

    // Obtener productos por categoría - ADMIN y CAJA
    this.router.get('/categoria/:id_categoria', 
        requireRole(['ADMIN', 'CAJA']), 
        productoController.obtenerProductosPorCategoria
    );

    // Obtener producto por ID - ADMIN y CAJA
    this.router.get('/:id', 
        requireRole(['ADMIN', 'CAJA']), 
        productoController.obtenerProductoPorId
    );

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