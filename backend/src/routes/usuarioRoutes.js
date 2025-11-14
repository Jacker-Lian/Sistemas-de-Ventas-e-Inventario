const express = require('express');
const authController = require('../controllers/usuarioController');
const { verificarToken } = require('../middleware/verificarToken');

class UsuarioRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }
  configurarRutas() {
    this.router.post('/login', authController.login);
    this.router.post('/logout', verificarToken, authController.logout);
  }
  getRouter() {
    return this.router;
  }
}
module.exports = UsuarioRoutes;
