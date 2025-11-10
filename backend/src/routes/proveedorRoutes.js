const express = require("express");
const proveedorController = require("../controllers/proveedorController");

class ProveedorRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    // Obtener todos los proveedores
    this.router.get('/', proveedorController.obtenerProveedores);

    // Obtener proveedor por ID
    this.router.get('/:id', proveedorController.obtenerProveedorPorId);

    // Crear nuevo proveedor
    this.router.post('/', proveedorController.crearProveedor);

    // Actualizar proveedor
    this.router.put('/:id', proveedorController.actualizarProveedor);

    // Desactivar proveedor
    this.router.delete('/:id', proveedorController.desactivarProveedor);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ProveedorRoutes;