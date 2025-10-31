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
  }

  getRouter() {
    return this.router;
  }
}

module.exports = UsuarioRoutes;

