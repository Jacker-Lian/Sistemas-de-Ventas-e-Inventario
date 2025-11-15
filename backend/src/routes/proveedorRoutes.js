const express = require("express");
const proveedorController = require("../controllers/proveedorController");

class ProveedorRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {

    // rutas de busqueda
    this.router.get("/buscar", proveedorController.buscarProveedores);
    this.router.get("/", proveedorController.obtenerProveedores);   
    this.router.get("/:id", proveedorController.obtenerProveedorPorId);   
    this.router.post("/", proveedorController.crearProveedor);
    this.router.put("/:id", proveedorController.actualizarProveedor);
    this.router.delete("/:id", proveedorController.desactivarProveedor);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ProveedorRoutes;
