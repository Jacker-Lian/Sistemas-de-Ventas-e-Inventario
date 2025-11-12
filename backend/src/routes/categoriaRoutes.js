const express = require('express');
const categoriaController = require('../controllers/categoriaController');

class CategoriaRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    this.router.get('/', categoriaController.getCategorias);
    this.router.get('/buscar/:nombre', categoriaController.getCategoriaByNombre);
    this.router.post('/crear', categoriaController.createCategoria);
    this.router.put('/actualizar/:id', categoriaController.updateCategoria);
    this.router.delete('/eliminar/:id', categoriaController.deleteCategoria);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = CategoriaRoutes;