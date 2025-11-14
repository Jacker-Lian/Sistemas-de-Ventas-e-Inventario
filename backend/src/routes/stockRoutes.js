const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

router.get("/productos", stockController.obtenerStockProductos);

module.exports = router;
