const express = require('express');
const motivosCancelacionController = require('../controllers/motivosCancelacionController');
const { verificarToken, requireRole } = require('../middleware/verificarToken');

class MotivosCancelacionRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    // Todas las rutas requieren autenticación
    /*this.router.use(verificarToken);

    // Obtener todos los motivos activos - ADMIN y CAJA
    this.router.get('/', 
        requireRole(['ADMIN', 'CAJA']), 
        motivosCancelacionController.obtenerMotivosActivos
    );

    // Crear motivo de cancelación - Solo ADMIN
    this.router.post('/', 
        requireRole(['ADMIN']), 
        motivosCancelacionController.crearMotivoCancelacion
    );

    // Obtener motivo por ID - ADMIN y CAJA
    this.router.get('/:id', 
        requireRole(['ADMIN', 'CAJA']), 
        motivosCancelacionController.obtenerMotivoPorId
    );

    // Actualizar motivo - Solo ADMIN
    this.router.put('/:id', 
        requireRole(['ADMIN']), 
        motivosCancelacionController.actualizarMotivo
    );

    // Desactivar motivo - Solo ADMIN
    this.router.delete('/:id', 
        requireRole(['ADMIN']), 
        motivosCancelacionController.desactivarMotivo
    );*/
  }

  getRouter() {
    return this.router;
  }
}

module.exports = MotivosCancelacionRoutes;