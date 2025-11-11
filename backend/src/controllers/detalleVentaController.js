const DetalleVentaModel = require('../models/detalleVentaModel');

const detalleVentaModelInstance = new DetalleVentaModel(); 

const detalleVentaController = {
    
    registrarDetalleVenta: async (req, res) => {
        const datosDetalle = req.body; 

        try {
            const resultado = await detalleVentaModelInstance.registrarDetalleVenta(datosDetalle);
            
            if (resultado) {
                return res.status(201).json({ 
                    mensaje: "Detalle de venta registrado correctamente",
                    id_insertado: resultado
                });
            } else {
                return res.status(400).json({ mensaje: "Error al registrar detalle de venta." });
            }
        } catch (error) {
            console.error("Error en registrarDetalleVenta:", error);
            return res.status(500).json({ 
                mensaje: "Error interno del servidor al registrar detalle de venta.",
                error: error.message 
            });
        }
    },
    
    obtenerDetallesPorVenta: async (req, res) => {
        const { idVenta } = req.params; 

        try {
            const detalles = await detalleVentaModelInstance.getDetallesPorVenta(idVenta);

            if (detalles.length > 0) {
                return res.status(200).json(detalles);
            } else {
                return res.status(404).json({ 
                    mensaje: `No se encontraron detalles para la Venta con ID: ${idVenta}` 
                });
            }
        } catch (error) {
            console.error("Error en obtenerDetallesPorVenta:", error);
            return res.status(500).json({ 
                mensaje: "Error interno del servidor al obtener detalles de venta.",
                error: error.message 
            });
        }
    }
};

module.exports = detalleVentaController;