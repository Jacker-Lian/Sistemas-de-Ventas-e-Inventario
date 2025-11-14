const express = require('express');
const { authController, usuarioController } = require('../controllers/usuarioController');

class UsuarioRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    // Autenticación
    this.router.post('/login', authController.login);
    this.router.post('/logout', (req, res) => {
      res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
      });
      res.json({ message: 'Sesión cerrada correctamente' });
    });

    // CRUD de usuarios con nombres explícitos
    this.router.get('/listar', usuarioController.listUsers);          
    this.router.get('/obtener/:id', usuarioController.getUser);       
    this.router.get('/buscar/:q', usuarioController.searchUsers);    
    this.router.post('/crear', usuarioController.createUser);        
    this.router.put('/actualizar/:id', usuarioController.updateUser);
    this.router.delete('/eliminar/:id', usuarioController.deleteUser);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = UsuarioRoutes;



