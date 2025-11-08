
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

const apisController = require('../controllers/apisController');

class ApisRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    /**
     * Rutas relacionadas con autenticación/Apis
     * POST   /api/auth/login    -> login (apisController.login)
     */
    this.router.post('/login', apisController.login);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ApisRoutes;
