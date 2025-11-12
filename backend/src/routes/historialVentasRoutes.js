const express = require("express");
const HistorialVentasController = require("../controllers/historialVentasController");
const { verificarToken, requireRole } = require('../middleware/verificarToken');

class HistorialVentasRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    // Todas las rutas requieren autenticación
    this.router.use(verificarToken);

    // Obtener historial de ventas - Solo ADMIN
    this.router.get("/", 
        requireRole(['ADMIN']), 
        HistorialVentasController.getSalesHistory
    );

    // Obtener detalle de una venta - ADMIN y CAJA
    this.router.get("/:id", 
        requireRole(['ADMIN', 'CAJA']), 
        HistorialVentasController.getSaleDetail
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = HistorialVentasRoutes;