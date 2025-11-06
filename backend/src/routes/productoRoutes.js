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
        this.router.get('/productos', this.productoController.getAll.bind(this.productoController));

        // Obtener un producto por ID
        this.router.get('/productos/:id', this.productoController.getById.bind(this.productoController));

        // Crear un nuevo producto
        this.router.post('/productos', this.productoController.create.bind(this.productoController));

        // Actualizar un producto
        this.router.put('/productos/:id', this.productoController.update.bind(this.productoController));

        // Eliminar un producto
        this.router.delete('/productos/:id', this.productoController.delete.bind(this.productoController));

        // Ajustar el stock de un producto (funcionalidad adicional)
        this.router.patch('/productos/:id/stock', this.productoController.ajustarStock.bind(this.productoController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = ProductoRoutes;
