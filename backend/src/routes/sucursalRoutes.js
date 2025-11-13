const express = require("express");
const sucursalController = require("../controllers/sucursalController");

class SucursalRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    this.router.get("/", sucursalController.listar);
    this.router.get("/:id", sucursalController.obtener);
    this.router.post("/", sucursalController.crear);
    this.router.put("/:id", sucursalController.actualizar);
    this.router.delete("/:id", sucursalController.eliminar);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = SucursalRoutes;

