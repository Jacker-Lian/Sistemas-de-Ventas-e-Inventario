const { Router } = require("express");

const {
  getGastos,
  getGastoById,
  getOneGasto,
  postGasto,
  putGasto,
  patchGasto
} = require("../controllers/gastoController.js");

class GastoRoutes {
  constructor() {
    this.router = Router();
    this.config();
  }

  config() {
    /* GET /api/gastos obtiene todos los gastos.
    agregado parametros query: page=1&limit=10 */
    this.router.get("/", getGastos);
    // POST /api/gastos crea un nuevo gasto
    this.router.post("/", postGasto);
    // GET /api/gastos/:id obtiene un gasto por id
    this.router.get("/:id", getGastoById, getOneGasto);
    // PUT /api/gastos/:id actualiza un gasto por id
    this.router.put("/:id", getGastoById, putGasto);
    // PATCH /api/gastos/:id "elimina" un gasto por id
    this.router.patch("/:id", getGastoById, patchGasto);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = GastoRoutes;