const express = require('express');
const productoController = require('../controllers/productoController');
const { verificarToken, requireRole } = require('../middleware/verificarToken');

class ProductoRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    this.router.use(verificarToken);

    this.router.get('/obtenerProductos',
      requireRole(['ADMIN', 'CAJA']),
      productoController.obtenerProductos
    );

    this.router.get('/obtenerProductosPorCategoria/:id_categoria',
      requireRole(['ADMIN', 'CAJA']),
      productoController.obtenerProductosPorCategoria
    );

    this.router.get('/obtenerProducto/:id',
      requireRole(['ADMIN', 'CAJA']),
      productoController.obtenerProductoPorId
    );

    this.router.post('/crearProducto',
      requireRole(['ADMIN']),
      productoController.crearProducto
    );

    this.router.put('/actualizarProducto',
      requireRole(['ADMIN']),
      productoController.actualizarProducto
    );

    this.router.put('/desactivarProducto',
      requireRole(['ADMIN']),
      productoController.desactivarProducto
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ProductoRoutes;
