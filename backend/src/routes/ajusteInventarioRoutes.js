const express = require('express');
const AjusteInventarioController = require('../controllers/ajusteInventarioController');
const { verificarToken, requireRole } = require('../middlewares/verificarToken');

class AjusteInventarioRoutes {
    constructor() {
        this.router = express.Router();
        this.configurarRutas();
    }

    configurarRutas() {
        this.router.use(verificarToken);

        this.router.post('/', requireRole(['ADMIN', 'CAJERO']), AjusteInventarioController.crearAjuste);
        this.router.get('/', AjusteInventarioController.obtenerTodosLosAjustes);
        this.router.get('/estadisticas', AjusteInventarioController.obtenerEstadisticas);
        this.router.get('/producto/:idProducto', AjusteInventarioController.obtenerAjustesPorProducto);
        this.router.get('/producto-info/:idProducto', AjusteInventarioController.obtenerProducto);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = AjusteInventarioRoutes;