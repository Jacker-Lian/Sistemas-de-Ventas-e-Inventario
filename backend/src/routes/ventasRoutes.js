const express = require("express");
const ventasController = require("../controllers/ventasController");

class VentasRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {

    this.router.post('/registrar', ventasController.registrarVenta);

    this.router.put('/cancelar', ventasController.cancelarVenta);

    this.router.post('/Insertar-motivo-cancelacion', ventasController.registrarMotivoCancelacion);

    this.router.get('/Obtener-motivos-cancelacion', ventasController.obtenerMotivosCancelacion);

    this.router.put('/Desactivar-motivo-cancelacion', ventasController.desactivarMotivoCancelacion);

    this.router.put('/Desactivar-ventas', ventasController.desactivarVentas);

    // Ruta extra para probar funcionalidad inexistente en PR
    // Borrar cuando se integre PR de gestion de categorias
    this.router.get('/Obtener-categorias', ventasController.obtenerCategorias);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = VentasRoutes;
