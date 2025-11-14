const express = require("express");
const cajaController = require("../controllers/cajaController");
const { verificarToken, requireRole } = require('../middleware/verificarToken');

class CajaRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }
  configurarRutas() {
    this.router.use(verificarToken);

    this.router.post("/abrir",
      requireRole(['ADMIN', 'CAJA']),
      cajaController.abrirCaja
    );
    this.router.post("/movimiento",
      requireRole(['ADMIN', 'CAJA']),
      cajaController.registrarMovimiento
    );
    this.router.put("/cerrar/:id_caja",
      requireRole(['ADMIN', 'CAJA']),
      cajaController.cerrarCaja
    );
    this.router.get("/listar",
      requireRole(['ADMIN', 'CAJA']),
      cajaController.listarCajas
    );
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
