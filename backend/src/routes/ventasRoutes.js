const express = require("express");
const ventasController = require("../controllers/ventasController");

class VentasRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    /*
    Ruta para registrar una nueva venta

    Body: ventaData (objeto JSON)

    Ejemplo: {BASE_URL}/api/ventas/registrar
    */
    this.router.post('/registrar', ventasController.registrarVenta);

    this.router.put('/cancelar/:id_venta', ventasController.cancelarVenta);



    /*
    Ruta para agregar un motivo de cancelación

    Body: motivoCancelacionData (objeto JSON)

    Ejemplo: {BASE_URL}/api/ventas/Insertar-motivo-cancelacion
    */
    this.router.post('/Insertar-motivo-cancelacion', ventasController.registrarMotivoCancelacion);

    /*
    Ruta para obtener todos los motivos de cancelación
    
    Ejemplo: {BASE_URL}/api/ventas/Obtener-motivos-cancelacion 
    */
    this.router.get('/Obtener-motivos-cancelacion', ventasController.obtenerMotivosCancelacion);

    /*
    Ruta para desactivar un motivo de cancelación
    
    Parámetro: id_motivo_cancelacion
    Ejemplo: {BASE_URL}/api/ventas/Desactivar-motivo-cancelacion/3
    */
    this.router.put('/Desactivar-motivo-cancelacion/:id_motivo_cancelacion', ventasController.desactivarMotivoCancelacion);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = VentasRoutes;
