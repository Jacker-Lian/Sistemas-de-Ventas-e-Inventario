import express from "express";
import { ProductosController } from "../controllers/productosController.js";

const router = express.Router();

router.get("/", ProductosController.listar);
router.get("/:id", ProductosController.obtener);
router.post("/", ProductosController.crear);
router.put("/:id", ProductosController.actualizar);
router.delete("/:id", ProductosController.eliminar);

export default router;

