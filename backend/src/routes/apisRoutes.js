const express = require('express');
const authController = require('../controllers/usuarioController');

class UsuarioRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    this.router.post('/login', authController.login);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = UsuarioRoutes;