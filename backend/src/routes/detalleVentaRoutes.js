const express = require('express');
const detalleVentaController = require('../controllers/detalleVentaController');
const { verificarToken, requireRole } = require('../middleware/verificarToken');

class DetalleVentaRoutes {
    constructor() {
        this.router = express.Router();
        this.configurarRutas();
    }

    configurarRutas() {
        // Todas las rutas requieren autenticación
        this.router.use(verificarToken);

        // Registrar detalle de venta - ADMIN y CAJA
        this.router.post('/registrar', 
            requireRole(['ADMIN', 'CAJA']), 
            detalleVentaController.registrarDetalleVenta
        );

        // Obtener detalles por venta - ADMIN y CAJA
        this.router.get('/venta/:idVenta', 
            requireRole(['ADMIN', 'CAJA']), 
            detalleVentaController.obtenerDetallesPorVenta
        );
    }

    getRouter() {
        return this.router;
    }
}

module.exports = DetalleVentaRoutes;