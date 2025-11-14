const express = require('express');
const AjusteInventarioController = require('../controllers/ajusteInventarioController');
const { verificarToken, requireRole } = require('../middleware/verificarToken');

class AjusteInventarioRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }
  configurarRutas() {
    this.router.use(verificarToken);

    this.router.post('/',
      requireRole(['ADMIN', 'CAJA']),
      AjusteInventarioController.crearAjuste
    );
    this.router.get('/',
      requireRole(['ADMIN']),
      AjusteInventarioController.obtenerTodosLosAjustes
    );
    this.router.get('/estadisticas',
      requireRole(['ADMIN']),
      AjusteInventarioController.obtenerEstadisticas
    );
    this.router.get('/producto/:idProducto',
      requireRole(['ADMIN', 'CAJA']),
      AjusteInventarioController.obtenerAjustesPorProducto
    );
  }
  getRouter() {
    return this.router;
  }
}
module.exports = AjusteInventarioRoutes;
