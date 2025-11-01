const express = require('express');
const authController = require('../controllers/usuarioController');

class UsuarioRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    /**
     * POST /api/usuario/login
     */
    this.router.post('/login', authController.login);
    /**
     * GET /api/usuario/ajustes
     * Lista todos los ajustes de inventario
     */
    this.router.get('/ajustes', authController.obtenerAjustes);
    /**
     * POST /api/usuario/ajustes
     * Crea un nuevo ajuste de inventario
     */
    this.router.post('/ajustes', authController.crearAjuste);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = UsuarioRoutes;

