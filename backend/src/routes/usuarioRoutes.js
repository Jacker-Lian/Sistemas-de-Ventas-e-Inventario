const express = require('express');
const authController = require('../controllers/usuarioController');

class UsuarioRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    this.router.post('/login', authController.login);

    this.router.post('/logout', (req, res) => {
      res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
      });
      res.json({ message: 'Sesión cerrada correctamente' });
    });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = UsuarioRoutes;

