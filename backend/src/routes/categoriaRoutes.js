const express = require('express');
const categoriaController = require('../controllers/categoriaController');

class CategoriaRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    this.router.get('/', categoriaController.getCategorias);
    this.router.get('/:id', categoriaController.getCategoriaByNombre);
    this.router.post('/', categoriaController.createCategoria);
    this.router.put('/:id', categoriaController.updateCategoria);
    this.router.delete('/:id', categoriaController.deleteCategoria);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = CategoriaRoutes;
