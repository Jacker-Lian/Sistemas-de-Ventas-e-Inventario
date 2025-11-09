const express = require('express');
const productoController = require('../controllers/productoController');

class ProductoRouters {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    // Ruta para obtener/buscar productos
    this.router.get('/', productoController.obtenerProductos);

    // Ruta para obtener un producto por su ID
    this.router.get('/:id', productoController.obtenerProductoPorId);

    // Ruta para obtener productos por categoría
    this.router.get('/categoria/:id_categoria', productoController.obtenerProductosPorCategoria);

    // Ruta para crear producto
    this.router.post('/create', productoController.crearProducto);

    // Ruta unificada para operaciones POST (actualizar, desactivar)
    this.router.post('/', productoController.manejarProducto);
  }

  getRouter() {
    return this.router;
  }
}

const router = new ProductoRouters();
module.exports = router.getRouter();
