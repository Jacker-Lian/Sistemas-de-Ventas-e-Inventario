const express = require('express');
const detalleVentaController = require('../controllers/detalleVentaController');
const { verificarToken } = require('../middleware/verificarToken');

class DetalleVentaRoutes {
    constructor() {
        this.router = express.Router();
        this.configurarRutas();
    }

    configurarRutas() {
        // Todas las rutas requieren autenticación
        this.router.use(verificarToken);

        // Registrar detalle de venta
        this.router.post('/registrar', detalleVentaController.registrarDetalleVenta);

        // Obtener detalles por venta
        this.router.get('/venta/:idVenta', detalleVentaController.obtenerDetallesPorVenta);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = DetalleVentaRoutes;