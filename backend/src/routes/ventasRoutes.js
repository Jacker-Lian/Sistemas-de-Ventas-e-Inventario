const express = require("express");
const ventasController = require("../controllers/ventasController");
const { verificarToken, requireRole } = require('../middleware/verificarToken');

class VentasRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {

    // 🔹 Reporte de ventas por producto (pública o protegida según necesidad)
    // Si quieres mantenerla pública como antes, quita el middleware:
    // this.router.get('/reporte/producto', ventasController.reporteVentasPorProducto);
    this.router.get('/reporte/producto', 
        verificarToken, 
        requireRole(['ADMIN']), 
        ventasController.reporteVentasPorProducto
    );

    // 🔸 A partir de aquí, todas requieren autenticación
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

    // Desactivar venta - Solo ADMIN
    this.router.put('/desactivar', 
        requireRole(['ADMIN']), 
        ventasController.desactivarVentas
    );

    // Obtener motivos de cancelación (si aún lo manejas desde ventasController)
    this.router.get('/motivos-cancelacion', 
        requireRole(['ADMIN', 'CAJA']), 
        ventasController.obtenerMotivosCancelacion
    );

    // Obtener venta por ID
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
