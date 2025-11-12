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

    // Registrar venta - ADMIN y CAJA
    this.router.post('/registrar', 
        requireRole(['ADMIN', 'CAJA']), 
        ventasController.registrarVenta
    );

    // Cancelar venta - ADMIN y CAJA
    this.router.put('/cancelar', 
        requireRole(['ADMIN', 'CAJA']), 
        ventasController.cancelarVenta
    );

    // Obtener motivos de cancelación - ADMIN y CAJA
    this.router.get('/motivos-cancelacion', 
        requireRole(['ADMIN', 'CAJA']), 
        ventasController.obtenerMotivosCancelacion
    );

    // Obtener venta por ID
this.router.get('/:id', 
    requireRole(['ADMIN', 'CAJA']), 
    ventasController.obtenerVentaPorId
);

// Reporte de ventas por producto
this.router.get('/reporte/producto', 
    requireRole(['ADMIN']), 
    ventasController.reporteVentasPorProducto
);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = VentasRoutes;