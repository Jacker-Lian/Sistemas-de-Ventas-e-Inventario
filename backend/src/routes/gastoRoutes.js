const { Router } = require("express");
const gastoController = require("../controllers/gastoController");
const { verificarToken, requireRole } = require('../middleware/verificarToken');

class GastoRoutes {
  constructor() {
    this.router = Router();
    this.config();
  }

  config() {
    // Todas las rutas requieren autenticación
    this.router.use(verificarToken);

    // Obtener tipos de gasto - ADMIN y CAJA
    this.router.get("/tipos", 
      requireRole(['ADMIN', 'CAJA']), 
      gastoController.getTiposGasto
    );

    // Crear tipo de gasto - Solo ADMIN
    this.router.post("/tipo", 
      requireRole(['ADMIN']), 
      gastoController.postTipoGasto
    );

    // Obtener todos los gastos - ADMIN y CAJA
    this.router.get("/", 
      requireRole(['ADMIN', 'CAJA']), 
      gastoController.getGastos
    );

    // Crear gasto - ADMIN y CAJA
    this.router.post("/", 
      requireRole(['ADMIN', 'CAJA']), 
      gastoController.postGasto
    );

    // Obtener gasto por ID - ADMIN y CAJA
    this.router.get("/:id", 
      requireRole(['ADMIN', 'CAJA']), 
      gastoController.getGastoById, 
      gastoController.getOneGasto
    );

    // Actualizar gasto - Solo ADMIN
    this.router.put("/:id", 
      requireRole(['ADMIN']), 
      gastoController.getGastoById, 
      gastoController.putGasto
    );

    // Eliminar gasto - Solo ADMIN
    this.router.patch("/:id", 
      requireRole(['ADMIN']), 
      gastoController.getGastoById, 
      gastoController.patchGasto
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = GastoRoutes;