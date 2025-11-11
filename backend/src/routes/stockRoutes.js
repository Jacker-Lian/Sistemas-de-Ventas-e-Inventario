// C:\gith\Sistemas-de-Ventas-e-Inventario\backend\src\routes\stockRoutes.js

const express = require('express');
console.log("DEBUG R.1: Express cargado en stockRoutes.");

// Importamos la instancia del controlador (el objeto exportado)
const stockController = require('../controllers/stockController'); 
console.log("DEBUG R.2: stockController cargado (Tipo:", typeof stockController, ").");

const router = express.Router();
console.log("DEBUG R.3: Router de Express creado.");

// Definición de la ruta: Llama al método obtenerStock del controlador
router.get('/stock/resumen-inventario', stockController.obtenerStock); 
console.log("DEBUG R.4: Ruta /stock/resumen-inventario definida.");

// Exportamos el router (función)
module.exports = router;