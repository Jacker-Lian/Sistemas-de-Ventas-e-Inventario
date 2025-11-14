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

        // Crear ajuste - Solo ADMIN y CAJA
        this.router.post('/', 
            requireRole(['ADMIN', 'CAJA']), 
            AjusteInventarioController.crearAjuste
        );

        // Obtener todos los ajustes con filtros - Solo ADMIN
        this.router.get('/', 
            requireRole(['ADMIN']), 
            AjusteInventarioController.obtenerTodosLosAjustes
        );

        // Estadísticas de ajustes - Solo ADMIN
        this.router.get('/estadisticas', 
            requireRole(['ADMIN']), 
            AjusteInventarioController.obtenerEstadisticas
        );

        // Ajustes por producto específico - ADMIN y CAJA
        this.router.get('/producto/:idProducto', 
            requireRole(['ADMIN', 'CAJA']), 
            AjusteInventarioController.obtenerAjustesPorProducto
        );
    }

    getRouter() {
        return this.router;
    }
}

module.exports = AjusteInventarioRoutes;