const express = require('express');
const MotivosCancelacionController = require('../controllers/motivosCancelacionController');
const { verificarToken, requireRole } = require('../middleware/verificarToken');

class MotivosCancelacionRoutes {
    constructor() {
        this.router = express.Router();
        this.configurarRutas();
    }

    configurarRutas() {
        // Todas las rutas requieren autenticación
        this.router.use(verificarToken);

        // Crear motivo de cancelación - Solo ADMIN
        this.router.post('/', 
            requireRole(['ADMIN']), 
            MotivosCancelacionController.crearMotivoCancelacion
        );

        // Obtener todos los motivos activos - ADMIN, SUPERVISOR, CAJERO
        this.router.get('/', 
            requireRole(['ADMIN', 'SUPERVISOR', 'CAJERO']), 
            MotivosCancelacionController.obtenerMotivosActivos
        );

        // Obtener motivo por ID - ADMIN, SUPERVISOR, CAJERO
        this.router.get('/:id', 
            requireRole(['ADMIN', 'SUPERVISOR', 'CAJERO']), 
            MotivosCancelacionController.obtenerMotivoPorId
        );

        // Desactivar motivo - Solo ADMIN
        this.router.put('/:id/desactivar', 
            requireRole(['ADMIN']), 
            MotivosCancelacionController.desactivarMotivo
        );
    }

    getRouter() {
        return this.router;
    }
}

module.exports = MotivosCancelacionRoutes;