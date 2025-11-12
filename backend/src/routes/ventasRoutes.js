const express = require("express");
const ventasController = require("../controllers/ventasController");
const motivoCancelacionController = require("../controllers/motivoCancelacionController");
const verificarToken = require("../middleware/verificarToken");

class VentasRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {

    // Aplicar middleware de autenticación a todas las rutas
    this.router.use(verificarToken);

    // Rutas de para gestion de ventas
    this.router.post('/registrar', ventasController.registrarVenta);
    this.router.put('/cancelar', ventasController.cancelarVenta);
    this.router.put('/Desactivar-ventas', ventasController.desactivarVentas);

    // Rutas para gestion de motivos de cancelación(Relacionado con ventas)
    this.router.post('/Insertar-motivo-cancelacion', motivoCancelacionController.register);
    this.router.get('/Obtener-motivos-cancelacion', motivoCancelacionController.getAll);
    this.router.put('/Desactivar-motivo-cancelacion', motivoCancelacionController.deactive);
    this.router.get('/Obtener-motivo-cancelacion-por-id', motivoCancelacionController.getById);
    this.router.put('/Actualizar-motivo-cancelacion', motivoCancelacionController.update);



    // Ruta extra para probar funcionalidad inexistente en PR
    // Borrar cuando se integre PR de gestion de categorias
    this.router.get('/Obtener-categorias', ventasController.obtenerCategorias);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = VentasRoutes;
