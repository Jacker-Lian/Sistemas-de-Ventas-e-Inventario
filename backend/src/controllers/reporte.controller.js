const { 
    getVentasTotalesModel, 
    getInventarioStockBajoModel 
} = require('../models/reporteModel');

const getVentasTotales = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, id_sucursal } = req.query;

        // Validaciones básicas (opcional pero recomendable)
        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({
                success: false,
                message: "Los parámetros 'fecha_inicio' y 'fecha_fin' son obligatorios."
            });
        }

        const results = await getVentasTotalesModel({ 
            fecha_inicio, 
            fecha_fin, 
            id_sucursal 
        });

        res.status(200).json({ 
            success: true, 
            data: results,
            message: "Reporte de ventas totales generado con éxito."
        });

    } catch (error) {
        console.error("Error al generar reporte de ventas:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error interno del servidor al obtener el reporte." 
        });
    }
};

const getInventarioStockBajo = async (req, res) => {
    try {
        const results = await getInventarioStockBajoModel();

        res.status(200).json({ 
            success: true, 
            data: results,
            message: "Reporte de stock bajo generado con éxito."
        });

    } catch (error) {
        console.error("Error al generar reporte de stock bajo:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error interno del servidor al obtener el reporte." 
        });
    }
};

module.exports = {
    getVentasTotales,
    getInventarioStockBajo,
};
