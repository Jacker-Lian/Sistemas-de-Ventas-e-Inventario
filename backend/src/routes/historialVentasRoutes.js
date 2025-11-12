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

    /*
     * Obtener historial de ventas con filtros y paginación
     * Roles: ADMIN, SUPERVISOR
     */
    this.router.get("/", 
        requireRole(['ADMIN', 'SUPERVISOR']), 
        HistorialVentasController.getSalesHistory
    );

    /*
     * Obtener detalle de una venta específica
     * Roles: ADMIN, SUPERVISOR, CAJERO
     */
    this.router.get("/:id", 
        requireRole(['ADMIN', 'SUPERVISOR', 'CAJERO']), 
        HistorialVentasController.getSaleDetail
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = HistorialVentasRoutes;