const express = require('express');
const productoController = require('../controllers/productoController');
const verificarToken = require('../middleware/verificarToken');

class ProductoRouters {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    // Aplicar middleware de autenticación a todas las rutas
    // this.router.use(verificarToken);

    // Ruta para obtener/buscar productos
    this.router.route('/obtenerProductos')
      .get(productoController.obtenerProductos);

    // Ruta para obtener productos por categoría
    this.router.route('/obtenerProductosPorCategoria/:id_categoria')
      .get(productoController.obtenerProductosPorCategoria);

    // Ruta para obtener un producto por su ID
    this.router.route('/obtenerProducto/:id')
      .get(productoController.obtenerProductoPorId);

    // Ruta para crear producto
    this.router.route('/crearProducto')
      .post(productoController.crearProducto);

    // Ruta para actualizar producto
    this.router.route('/actualizarProducto')
      .put(productoController.actualizarProducto);

    // Ruta para desactivar producto
    this.router.route('/desactivarProducto')
      .put(productoController.desactivarProducto);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ProductoRouters;
