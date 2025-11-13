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

    // Reporte de ventas por producto - Solo ADMIN
    this.router.get('/reporte-ventas-por-producto', 
        requireRole(['ADMIN']), 
        ventasController.reporteVentasPorProducto
    );

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

    // Desactivar ventas - Solo ADMIN
    this.router.put('/desactivar-ventas', 
        requireRole(['ADMIN']), 
        ventasController.desactivarVentas
    );

    // Obtener venta por ID - ADMIN y CAJA
    this.router.get('/:id', 
        requireRole(['ADMIN', 'CAJA']), 
        ventasController.obtenerVentaPorId
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = VentasRoutes;