const { Router } = require("express");
const {
  getGastos,
  getGastoById,
  getOneGasto,
  postGasto,
  putGasto,
  patchGasto,
  getTiposGasto,
  postTipoGasto,
} = require("../controllers/gastoController.js");
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
      getTiposGasto
    );

    // Crear tipo de gasto - Solo ADMIN
    this.router.post("/tipo", 
      requireRole(['ADMIN']), 
      postTipoGasto
    );

    // Obtener todos los gastos - ADMIN y CAJA
    this.router.get("/", 
      requireRole(['ADMIN', 'CAJA']), 
      getGastos
    );

    // Crear gasto - ADMIN y CAJA
    this.router.post("/", 
      requireRole(['ADMIN', 'CAJA']), 
      postGasto
    );

    // Obtener gasto por ID - ADMIN y CAJA
    this.router.get("/:id", 
      requireRole(['ADMIN', 'CAJA']), 
      getGastoById, 
      getOneGasto
    );

    // Actualizar gasto - Solo ADMIN
    this.router.put("/:id", 
      requireRole(['ADMIN']), 
      getGastoById, 
      putGasto
    );

    // Eliminar gasto - Solo ADMIN
    this.router.patch("/:id", 
      requireRole(['ADMIN']), 
      getGastoById, 
      patchGasto
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = GastoRoutes;