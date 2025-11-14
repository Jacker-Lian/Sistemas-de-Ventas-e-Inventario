const DetalleVentaModel = require('../models/detalleVentaModel');
const detalleVentaModelInstance = new DetalleVentaModel();

const detalleVentaController = {
  registrarDetalleVenta: async (req, res) => {
    const datosDetalle = req.body;
    try {
      const resultado = await detalleVentaModelInstance.registrarDetalleVenta(datosDetalle);
      if (resultado) {
        return res.status(201).json({
          success: true,
          message: "Detalle de venta registrado correctamente",
          data: { id_insertado: resultado.insertId }
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Error al registrar detalle de venta."
        });
      }
    } catch (error) {
      console.error("Error en registrarDetalleVenta:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al registrar detalle de venta.",
        error: error.message
      });
    }
  },

  obtenerDetallesPorVenta: async (req, res) => {
    const { idVenta } = req.params;
    try {
      const detalles = await detalleVentaModelInstance.getDetallesPorVenta(idVenta);
      if (detalles.length > 0) {
        return res.status(200).json({
          success: true,
          data: detalles
        });
      } else {
        return res.status(404).json({
          success: false,
          message: `No se encontraron detalles para la Venta con ID: ${idVenta}`
        });
      }
    } catch (error) {
      console.error("Error en obtenerDetallesPorVenta:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al obtener detalles de venta.",
        error: error.message
      });
    }
  }
};

module.exports = detalleVentaController;
