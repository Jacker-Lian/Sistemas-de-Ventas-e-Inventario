const express = require('express');
const authController = require('../controllers/apisController');

class UsuarioRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    /**
     * Rutas de usuarios
     * POST   /api/usuario/login    -> login
     * POST   /api/usuario/register -> registrar nuevo usuario
     * GET    /api/usuario/         -> listar usuarios
     * GET    /api/usuario/:id      -> obtener usuario
     * PUT    /api/usuario/:id      -> actualizar usuario
     * DELETE /api/usuario/:id      -> desactivar usuario
     */
    this.router.post('/login', authController.login);
    this.router.post('/register', authController.register);
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

