const express = require("express");
const ventasController = require("../controllers/ventasController");

class VentasRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {

    Body: ventaData (objeto JSON)

    Ejemplo: {BASE_URL}/api/ventas/registrar
    */
    this.router.post('ventas/registrar', ventasController.registrarVenta);

    this.router.put('/cancelar/:id_venta', ventasController.cancelarVenta);
    
    
    //PARA CONSEGUIR DETALLES DE UNA VENTA CON EL ID

this.router.get('ventas/detalles/:id_venta', ventasController.obtenerDetallesVenta);

    /*
    Ruta para agregar un motivo de cancelación

    Body: motivoCancelacionData (objeto JSON)

    this.router.post('/Insertar-motivo-cancelacion', ventasController.registrarMotivoCancelacion);

    this.router.get('/Obtener-motivos-cancelacion', ventasController.obtenerMotivosCancelacion);

    this.router.put('/Desactivar-motivo-cancelacion', ventasController.desactivarMotivoCancelacion);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = VentasRoutes;
