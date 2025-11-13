const express = require("express");
const proveedorController = require("../controllers/proveedorController");

class ProveedorRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
  // Obtener todos los proveedores
  this.router.get('/ObtenerProveedores', proveedorController.obtenerProveedores);

  // Obtener proveedor por ID
  this.router.get('/ObtenerProveedorPorId/:id', proveedorController.obtenerProveedorPorId);

  // Crear nuevo proveedor
  this.router.post('/CrearProveedor', proveedorController.crearProveedor);

  // Actualizar proveedor
  this.router.put('/ActualizarProveedor/:id', proveedorController.actualizarProveedor);

  // Desactivar proveedor
  this.router.delete('/DesactivarProveedor/:id', proveedorController.desactivarProveedor);
}


  getRouter() {
    return this.router;
  }
}

module.exports = ProveedorRoutes;