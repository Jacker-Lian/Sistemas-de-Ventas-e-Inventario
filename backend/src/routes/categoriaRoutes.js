const express = require('express');
const categoriaController = require('../controllers/categoriaController');

class CategoriaRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    // Rutas para Listado y Filtrado
    this.router.get('/', categoriaController.getCategorias); // Solo Activas
    this.router.get('/all', categoriaController.getCategoriasAll); // Todas
    this.router.get('/inactivas', categoriaController.getCategoriasInactive); // Solo Inactivas
    
    // Rutas para Búsqueda por Nombre (Respetando el filtro)
    this.router.get('/buscar/:nombre', categoriaController.getCategoriaByNombre); // Activas (Estado por defecto)
    this.router.get('/buscar/inactivas/:nombre', categoriaController.getCategoriaByNombreInactive); // Solo Inactivas
    this.router.get('/buscar/all/:nombre', categoriaController.getCategoriaByNombreAll); // Todas
    
    // Rutas CRUD y Reactivación
    this.router.post('/crear', categoriaController.createCategoria);
    this.router.put('/actualizar/:id', categoriaController.updateCategoria);
    this.router.delete('/eliminar/:id', categoriaController.deleteCategoria);
    this.router.put('/reactivar/:id', categoriaController.reactivateCategoria);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = CategoriaRoutes;
