const express = require('express');
const AjusteInventarioController = require('../controllers/ajusteInventarioController');
const { verificarToken, requireRole } = require('../middleware/verificarToken');

class AjusteInventarioRoutes {
    constructor() {
        this.router = express.Router();
        this.configurarRutas();
    }

    configurarRutas() {
        // Todas las rutas requieren autenticación
        this.router.use(verificarToken);

        // Crear ajuste - Solo ADMIN y CAJERO
        this.router.post('/', 
            requireRole(['ADMIN', 'CAJERO']), 
            AjusteInventarioController.crearAjuste
        );

        // Obtener todos los ajustes con filtros
        this.router.get('/', 
            requireRole(['ADMIN', 'SUPERVISOR']), 
            AjusteInventarioController.obtenerTodosLosAjustes
        );

        // Estadísticas de ajustes
        this.router.get('/estadisticas', 
            requireRole(['ADMIN', 'SUPERVISOR']), 
            AjusteInventarioController.obtenerEstadisticas
        );

        // Ajustes por producto específico
        this.router.get('/producto/:idProducto', 
            AjusteInventarioController.obtenerAjustesPorProducto
        );

        // No se usa
        //this.router.get('/producto-info/:idProducto', AjusteInventarioController.obtenerProducto);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = AjusteInventarioRoutes;