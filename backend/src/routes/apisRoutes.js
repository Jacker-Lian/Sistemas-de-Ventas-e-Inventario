
const express = require('express');
// Usar el controlador de usuarios existente (alias explicito para apis)
const usuarioController = require('../controllers/usuarioController');

class ApisRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    /**
     * Rutas relacionadas con autenticación / APIs
     * POST   /api/auth/login    -> login (apisController.login)
     */
      this.router.post('/login', usuariosController.login);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ApisRoutes;

