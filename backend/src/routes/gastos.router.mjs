// código epico creado en chatgpt
import express from "express";
import {
  getGastos,
  getGastoById,
  getOneGasto,
  createGasto,
  putGasto,
  patchGasto
} from "../controllers/gastos.controller.mjs";

const router = express.Router();

/* GET /api/gastos obtiene todos los gastos.
agregado parametros query: page=1&limit=10 */
router.get("/", getGastos);
// POST /api/gastos crea un nuevo gasto
router.post("/", createGasto);

// GET /api/gastos/:id obtiene un gasto por id
router.get("/:id", getGastoById, getOneGasto);
// PUT /api/gastos/:id actualiza un gasto por id
router.put("/:id", getGastoById, putGasto);
// PATCH /api/gastos/:id "elimina" un gasto por id
router.patch("/:id", getGastoById, patchGasto);

export default router;