const express = require("express");
const proveedorController = require("../controllers/proveedorController");

class ProveedorRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {

    // 🔍 NUEVA RUTA DE BÚSQUEDA
    this.router.get("/buscar", proveedorController.buscarProveedores);

    // GET /api/proveedores → obtener todos
    this.router.get("/", proveedorController.obtenerProveedores);

    // GET /api/proveedores/:id → obtener proveedor por ID
    this.router.get("/:id", proveedorController.obtenerProveedorPorId);

    // POST /api/proveedores → crear proveedor
    this.router.post("/", proveedorController.crearProveedor);

    // PUT /api/proveedores/:id → actualizar proveedor
    this.router.put("/:id", proveedorController.actualizarProveedor);

    // DELETE /api/proveedores/:id → desactivar proveedor
    this.router.delete("/:id", proveedorController.desactivarProveedor);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ProveedorRoutes;
