const express = require("express");
const ventasController = require("../controllers/ventasController");
const { verificarToken, requireRole } = require('../middleware/verificarToken');

class VentasRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    // Todas las rutas requieren autenticación
    this.router.use(verificarToken);

    // Registrar venta - ADMIN y CAJERO
    this.router.post('/registrar', 
        requireRole(['ADMIN', 'CAJERO']), 
        ventasController.registrarVenta
    );

    // Cancelar venta - ADMIN y CAJERO
    this.router.put('/cancelar', 
        requireRole(['ADMIN', 'CAJERO']), 
        ventasController.cancelarVenta
    );

    // Obtener motivos de cancelación - ADMIN, SUPERVISOR, CAJERO
    this.router.get('/motivos-cancelacion', 
        requireRole(['ADMIN', 'SUPERVISOR', 'CAJERO']), 
        ventasController.obtenerMotivosCancelacion
    );

  }

  getRouter() {
    return this.router;
  }
}

module.exports = VentasRoutes;