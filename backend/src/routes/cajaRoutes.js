const express = require("express");
const cajaController = require("../controllers/cajaController");

class CajaRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    this.router.post("/abrir", cajaController.abrirCaja);
    this.router.post("/movimiento", cajaController.registrarMovimiento);
    this.router.put("/cerrar/:id_caja", cajaController.cerrarCaja);
    this.router.get("/listar", cajaController.listarCajas);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = CajaRoutes;
