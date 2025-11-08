const express = require('express');
const productoController = require('../controllers/productoController');

class ProductoRouters {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    // Ruta para obtener todos los productos
    this.router.get('/productos', productoController.obtenerProductos);

    // Ruta para obtener un producto por su ID
    this.router.get('/productos/:id', productoController.obtenerProductoPorId);

    // Ruta para manejar operaciones POST (crear, actualizar, desactivar)
    this.router.post('/productos', productoController.manejarProducto);
  }

  getRouter() {
    return this.router;
  }
}

const router = new ProductoRouters();
module.exports = router.getRouter();
