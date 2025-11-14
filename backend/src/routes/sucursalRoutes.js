const express = require("express");
const sucursalController = require("../controllers/sucursalController");
const { verificarToken, requireRole } = require('../middleware/verificarToken');

class SucursalRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    // Todas las rutas requieren autenticación
    this.router.use(verificarToken);

    // Listar sucursales - ADMIN y CAJA
    this.router.get("/", 
      requireRole(['ADMIN', 'CAJA']), 
      sucursalController.listar
    );

    // Obtener sucursal por ID - ADMIN y CAJA
    this.router.get("/:id", 
      requireRole(['ADMIN', 'CAJA']), 
      sucursalController.obtener
    );

    // Crear sucursal - Solo ADMIN
    this.router.post("/", 
      requireRole(['ADMIN']), 
      sucursalController.crear
    );

    // Actualizar sucursal - Solo ADMIN
    this.router.put("/:id", 
      requireRole(['ADMIN']), 
      sucursalController.actualizar
    );

    // Cambiar estado de sucursal - Solo ADMIN
    this.router.patch("/:id/estado", 
      requireRole(['ADMIN']), 
      sucursalController.cambiarEstado
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = SucursalRoutes;