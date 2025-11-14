//backend/src/routes/stockRoutes.js
const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

router.get("/productos", stockController.obtenerProductosParaAlertas);
module.exports = router;
