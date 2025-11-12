const HistorialVentasModel = require("../models/historialVentasModel"); // CORREGIDO: nombre de archivo

const historialVentasModelInstance = new HistorialVentasModel();

const HistorialVentasController = {
  // Controlador para obtener el historial de ventas con filtros y paginación.   */
  
  getSalesHistory: async (req, res) => {
    try {
      const filters = {
        fecha_inicio: req.query.fecha_inicio,
        fecha_fin: req.query.fecha_fin,
        monto_min: req.query.monto_min,
        monto_max: req.query.monto_max,
        id_usuario: req.query.id_usuario,
        estado_venta: req.query.estado_venta,
      };

      const pagination = {
        page: req.query.page,
        limit: req.query.limit
      };

      const result = await historialVentasModelInstance.getHistory(filters, pagination);

      res.status(200).json({
        success: true,
        message: "Historial de ventas obtenido correctamente.",
        ...result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error interno del servidor al obtener el historial de ventas.",
        error: error.message,
      });
    }
  },

  // Controlador para obtener el detalle de una sola venta.
  getSaleDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const venta = await historialVentasModelInstance.getDetailById(id);

      if (!venta) {
        return res.status(404).json({
          success: false,
          message: "Venta no encontrada."
        });
      }

      res.status(200).json({
        success: true,
        message: "Detalle de venta obtenido correctamente.",
        data: venta
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error interno del servidor al obtener el detalle de la venta.",
        error: error.message,
      });
    }
  },
};

module.exports = HistorialVentasController;