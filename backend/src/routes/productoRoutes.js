const express = require('express');
const ProductoController = require('../controllers/ProductoController');

class ProductoRoutes {
    constructor() {
        this.router = express.Router();
        this.productoController = new ProductoController();
        this.configurarRutas();
    }

    configurarRutas() {
        // Obtener todos los productos
        this.router.get('/', this.productoController.obtenerProductos.bind(this.productoController));

        // Obtener un producto por ID
        this.router.get('/:id', this.productoController.obtenerProductoPorId.bind(this.productoController));

        // Crear un nuevo producto
        this.router.post('/', this.productoController.crearProducto.bind(this.productoController));

        // Actualizar un producto
        this.router.put('/:id', this.productoController.actualizarProducto.bind(this.productoController));

        // Eliminar un producto
        this.router.delete('/:id', this.productoController.eliminarProducto.bind(this.productoController));

        // Ajustar el stock de un producto
        this.router.patch('/:id/stock', this.productoController.ajustarStock.bind(this.productoController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = ProductoRoutes;