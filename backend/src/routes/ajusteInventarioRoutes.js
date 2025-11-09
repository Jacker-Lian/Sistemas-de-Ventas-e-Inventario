const express = require('express');
const AjusteInventarioController = require('../controllers/ajusteInventarioController');

class AjusteInventarioRoutes {
    constructor() {
        this.router = express.Router();
        this.configurarRutas();
    }

    configurarRutas() {
        // RUTA 1: POST / (Crear Ajuste)
        this.router.post('/', AjusteInventarioController.crearAjuste);

        // Obtener todos los ajustes de inventario --
        this.router.get('/', AjusteInventarioController.obtenerTodosLosAjustes);

        // RUTA 3: GET /producto/:idProducto (Obtener Historial Específico)
        this.router.get('/producto/:idProducto', AjusteInventarioController.obtenerAjustesPorProducto);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = AjusteInventarioRoutes;
