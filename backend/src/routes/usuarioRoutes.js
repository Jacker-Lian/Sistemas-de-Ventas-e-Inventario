const express = require('express');
const authController = require('../controllers/usuarioController');

class UsuarioRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    // Autenticación
    this.router.post('/login', authController.login);
    this.router.post('/register', authController.register);
    this.router.post('/logout', (req, res) => {
      res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
      });
      res.json({ message: 'Sesión cerrada correctamente' });
    });

    // CRUD de usuarios
    this.router.get('/', authController.listUsers);
    this.router.get('/:id', authController.getUser);
    this.router.put('/:id', authController.updateUser);
    this.router.delete('/:id', authController.deleteUser);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = UsuarioRoutes;


