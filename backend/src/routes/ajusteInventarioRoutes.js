const express = require('express');
const ajusteInventarioController = require('../controllers/ajusteInventarioController');

class AjusteInventarioRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    // Crear un nuevo ajuste de inventario
    this.router.post('/ajuste', ajusteInventarioController.crearAjuste);

    // Obtener lista de ajustes
    this.router.get('/ajustes', ajusteInventarioController.obtenerAjustes);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = AjusteInventarioRoutes;