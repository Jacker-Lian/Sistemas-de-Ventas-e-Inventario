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

    // Apertura de caja - Solo ADMIN y CAJA
    this.router.post("/abrir", 
        requireRole(['ADMIN', 'CAJA']), 
        cajaController.abrirCaja
    );

    // Registrar movimiento - Solo ADMIN y CAJA
    this.router.post("/movimiento", 
        requireRole(['ADMIN', 'CAJA']), 
        cajaController.registrarMovimiento
    );

    // Cerrar caja - Solo ADMIN y CAJA
    this.router.put("/cerrar/:id_caja", 
        requireRole(['ADMIN', 'CAJA']), 
        cajaController.cerrarCaja
    );

    // Listar cajas - ADMIN y CAJA
    this.router.get("/listar", 
        requireRole(['ADMIN', 'CAJA']), 
        cajaController.listarCajas
    );

    // Obtener caja por ID - ADMIN y CAJA
    this.router.get("/:id_caja", 
        requireRole(['ADMIN', 'CAJA']), 
        cajaController.obtenerCajaPorId
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = CajaRoutes;
