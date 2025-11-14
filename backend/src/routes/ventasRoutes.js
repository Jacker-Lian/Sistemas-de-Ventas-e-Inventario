// src/routes/ventasRoutes.js
const express = require("express");
const ventasController = require("../controllers/ventasController");

// IMPORTAR EL CONTROLLER (el archivo anterior)
const motivosCancelacionController = require("../controllers/motivosCancelacionController");

const { verificarToken, requireRole } = require('../middleware/verificarToken');

class VentasRoutes {
  constructor() {
    this.router = express.Router();
    this.configurarRutas();
  }

  configurarRutas() {
    // Todas pasan primero por verificarToken
    this.router.use(verificarToken);

    // Reporte de ventas por producto
    this.router.get(
      '/reporte-ventas-por-producto',
      requireRole(['ADMIN']),
      ventasController.reporteVentasPorProducto
    );

    // Gestión de ventas
    this.router.post(
      '/registrar',
      requireRole(['ADMIN', 'CAJA']),
      ventasController.registrarVenta
    );

    this.router.put(
      '/cancelar',
      requireRole(['ADMIN', 'CAJA']),
      ventasController.cancelarVenta
    );

    this.router.put(
      '/Desactivar-ventas',
      requireRole(['ADMIN']),
      ventasController.desactivarVentas
    );

    // Motivos de cancelación
    this.router.post(
      '/Insertar-motivo-cancelacion',
      requireRole(['ADMIN']),
      motivosCancelacionController.crearMotivoCancelacion
    );

    this.router.get(
      '/Obtener-motivos-cancelacion',
      requireRole(['ADMIN', 'CAJA']),
      motivosCancelacionController.obtenerMotivosActivos
    );

    this.router.put(
      '/Desactivar-motivo-cancelacion/:id',
      requireRole(['ADMIN']),
      motivosCancelacionController.desactivarMotivo
    );

    this.router.get(
      '/Obtener-motivo-cancelacion-por-id/:id',
      requireRole(['ADMIN', 'CAJA']),
      motivosCancelacionController.obtenerMotivoPorId
    );

    this.router.put(
      '/Actualizar-motivo-cancelacion/:id',
      requireRole(['ADMIN']),
      motivosCancelacionController.actualizarMotivo
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = VentasRoutes;
