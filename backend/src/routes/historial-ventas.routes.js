const express = require("express");
const HistorialVentasController = require("../controllers/historial-ventas.controller");

class HistorialVentasRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    this.router.get("/", HistorialVentasController.getSalesHistory);
    this.router.get("/:id", HistorialVentasController.getSaleDetail);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = HistorialVentasRoutes;