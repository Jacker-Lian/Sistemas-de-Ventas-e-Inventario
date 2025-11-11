// src/routes/historial-ventas.routes.js
const express = require("express");
const HistorialVentasController = require("../controllers/historial-ventas.controller");

class HistorialVentasRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    /*
     * Ruta para obtener el historial de ventas
     * Permite filtros y paginación por query string
     *
     * Ejemplo: GET {BASE_URL}/api/historial-ventas?page=1&limit=5&estado_venta=COMPLETADA
     */
    this.router.get("/", HistorialVentasController.getSalesHistory);

    /*
     * Ruta para obtener el detalle de una venta específica
     *
     * Ejemplo: GET {BASE_URL}/api/historial-ventas/15
     */
    this.router.get("/:id", HistorialVentasController.getSaleDetail);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = HistorialVentasRoutes;