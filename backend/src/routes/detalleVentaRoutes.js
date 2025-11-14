const express = require('express');
const detalleVentaController = require('../controllers/detalleVentaController');
const { verificarToken, requireRole } = require('../middleware/verificarToken');

class DetalleVentaRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }
  configurarRutas() {
    this.router.use(verificarToken);

    // Registrar un nuevo detalle de venta
    this.router.post('/registrar',
      requireRole(['ADMIN', 'CAJA']),
      detalleVentaController.registrarDetalleVenta
    );
    // Obtener detalles de venta por id venta
    this.router.get('/:idVenta',
      requireRole(['ADMIN', 'CAJA']),
      detalleVentaController.obtenerDetallesPorVenta
    );
  }
  getRouter() {
    return this.router;
  }
}
module.exports = DetalleVentaRoutes;
