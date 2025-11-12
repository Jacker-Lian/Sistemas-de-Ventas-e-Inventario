const express = require("express");
const cajaController = require("../controllers/cajaController");
const { verificarToken, requireRole } = require('../middleware/verificarToken');

class CajaRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    // Todas las rutas requieren autenticación
    this.router.use(verificarToken);

    // Apertura de caja - Solo ADMIN y CAJERO
    this.router.post("/abrir", 
        requireRole(['ADMIN', 'CAJERO']), 
        cajaController.abrirCaja
    );

    // Registrar movimiento - Solo ADMIN y CAJERO
    this.router.post("/movimiento", 
        requireRole(['ADMIN', 'CAJERO']), 
        cajaController.registrarMovimiento
    );

    // Cerrar caja - Solo ADMIN y CAJERO
    this.router.put("/cerrar/:id_caja", 
        requireRole(['ADMIN', 'CAJERO']), 
        cajaController.cerrarCaja
    );

    // Listar cajas - ADMIN, SUPERVISOR, CAJERO
    this.router.get("/listar", 
        requireRole(['ADMIN', 'SUPERVISOR', 'CAJERO']), 
        cajaController.listarCajas
    );

    // Obtener caja por ID - ADMIN, SUPERVISOR, CAJERO
    this.router.get("/:id_caja", 
        requireRole(['ADMIN', 'SUPERVISOR', 'CAJERO']), 
        cajaController.obtenerCajaPorId
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = CajaRoutes;