// código epico creado en chatgpt
import express from "express";
import { getGastos, createGasto } from "../controllers/gastos.controller.mjs";

const router = express.Router();

router.get("/", getGastos);
router.post("/", createGasto);

export default router;