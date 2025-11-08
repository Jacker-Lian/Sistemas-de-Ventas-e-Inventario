const express = require('express');
const AjusteInventarioController = require('../controllers/ajusteInventarioController');

class AjusteInventarioRoutes {
    constructor() {
        this.router = express.Router();
        this.configurarRutas();
    }

    configurarRutas() {
        // Crear un nuevo ajuste de inventario
        this.router.post('/', AjusteInventarioController.crearAjuste);

        // Obtener todos los ajustes de inventario
        this.router.get('/', AjusteInventarioController.obtenerTodosLosAjustes);

        // Obtener ajustes de un producto específico
        this.router.get('/producto/:idProducto', AjusteInventarioController.obtenerAjustesPorProducto);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = AjusteInventarioRoutes.
