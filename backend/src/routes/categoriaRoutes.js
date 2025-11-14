const express = require('express');
const categoriaController = require('../controllers/categoriaController');
const { verificarToken, requireRole } = require('../middleware/verificarToken');

class CategoriaRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    this.router.use(verificarToken);

    // Listado y filtrado de categorías
    this.router.get('/',
      requireRole(['ADMIN', 'CAJA']),
      categoriaController.getCategorias
    ); // Solo activas

    this.router.get('/all',
      requireRole(['ADMIN']),
      categoriaController.getCategoriasAll
    ); // Todas

    this.router.get('/inactivas',
      requireRole(['ADMIN']),
      categoriaController.getCategoriasInactive
    ); // Solo inactivas

    // Búsqueda por nombre
    this.router.get('/buscar/:nombre',
      requireRole(['ADMIN', 'CAJA']),
      categoriaController.getCategoriaByNombre
    ); // Activas

    this.router.get('/buscar/inactivas/:nombre',
      requireRole(['ADMIN']),
      categoriaController.getCategoriaByNombreInactive
    ); // Solo inactivas

    this.router.get('/buscar/all/:nombre',
      requireRole(['ADMIN']),
      categoriaController.getCategoriaByNombreAll
    ); // Todas

    // CRUD y reactivación
    this.router.post('/crear',
      requireRole(['ADMIN']),
      categoriaController.createCategoria
    );
    this.router.put('/actualizar/:id',
      requireRole(['ADMIN']),
      categoriaController.updateCategoria
    );
    this.router.put('/reactivar/:id',
      requireRole(['ADMIN']),
      categoriaController.reactivateCategoria
    );
    this.router.delete('/eliminar/:id',
      requireRole(['ADMIN']),
      categoriaController.deleteCategoria
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = CategoriaRoutes;
