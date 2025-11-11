
const { Router } = require('express');
const detalleVentaController = require('../controllers/detalleVentaController'); 


class DetalleVentaRoutes {
    
    
    constructor() {
        this.router = Router(); 
        
        this.configRoutes(); 
    }

   
    configRoutes() {
        
        // Ruta POST para registrar un nuevo detalle de venta
        // La ruta completa será: /api/detalle-venta/
        this.router.post(
            '/', 
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