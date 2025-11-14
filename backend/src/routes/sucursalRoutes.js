const express = require("express");
const sucursalController = require("../controllers/sucursalController");
const { verificarToken, requireRole } = require('../middleware/verificarToken');

class SucursalRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    this.router.use(verificarToken);

    this.router.get('/',
      requireRole(['ADMIN', 'CAJA']),
      sucursalController.listar
    );
    this.router.get('/:id',
      requireRole(['ADMIN', 'CAJA']),
      sucursalController.obtener
    );
    this.router.post('/',
      requireRole(['ADMIN']),
      sucursalController.crear
    );
    this.router.put('/:id',
      requireRole(['ADMIN']),
      sucursalController.actualizar
    );
    this.router.patch('/:id/estado',
      requireRole(['ADMIN']),
      sucursalController.cambiarEstado
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = SucursalRoutes;
