import express from "express";
import { crudController, ProductosController } from "../controllers/crudController.js";

const router = express.Router();

router.get("/", crudController.listar);
router.get("/:id", crudController.obtener);
router.post("/", crudController.crear);
router.put("/:id", crudController.actualizar);
router.delete("/:id", crudController.eliminar);//correccion

export default router;

