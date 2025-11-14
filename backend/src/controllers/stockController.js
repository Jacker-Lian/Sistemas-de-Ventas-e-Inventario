const stockModel = require("../models/stockModel");

exports.obtenerStockProductos = async (req, res) => {
    try {
      
        const productos = await stockModel.findStockProductos();

        return res.json({
            success: true,
            data: productos
        });

    } catch (error) {
        console.error("Error en obtenerStockProductos:", error);
        return res.status(500).json({
            success: false,
            mensaje: "Error del servidor"
        });
    }
};
