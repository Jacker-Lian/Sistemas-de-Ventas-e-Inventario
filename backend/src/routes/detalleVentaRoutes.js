
const express = require('express');
const detalleVentaController = require('../controllers/detalleVentaController'); 


class DetalleVentaRoutes {
    
    
    constructor() {
        this.router = express.Router(); 
        this.configurarRutas(); 
    }

   
    configurarRutas() {
        
        // Ruta POST para registrar un nuevo detalle de venta
        // La ruta completa será: /api/detalle-venta/
        this.router.post(
            '/registrar', 
            detalleVentaController.registrarDetalleVenta
        );
        
        this.router.get(
            '/:idVenta', 
            detalleVentaController.obtenerDetallesPorVenta
        );
         
    }
    
    /**
     * @returns {Router} 
     */
    getRouter() {
        return this.router;
    }
}


module.exports = DetalleVentaRoutes;