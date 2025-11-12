const express = require('express');
const authController = require('../controllers/usuariosController');
const { verificarToken } = require('../middleware/verificarToken');

class UsuarioRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    // Rutas públicas
    this.router.post('/login', authController.login);
    
    // Rutas protegidas
    this.router.post('/logout', verificarToken, authController.logout);
    this.router.get('/me', verificarToken, authController.getCurrentUser);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = UsuarioRoutes;