const VentasModel = require("../models/ventasModel");

const ventasModelInstance = new VentasModel();

const ventasController = {
  // Controlador para registrar una nueva venta
  registrarVenta: async (req, res) => {
    try {
      const ventaData = req.body;

      // Validar datos requeridos
      if (!ventaData.id_usuario || !ventaData.id_caja || !ventaData.tipo_cliente || !ventaData.metodo_pago || !ventaData.productos) {
        return res.status(400).json({ 
          success: false,
          message: "Faltan datos requeridos para registrar la venta." 
        });
      }

      const resultado = await ventasModelInstance.registrarVenta(ventaData);
      
      return res.status(201).json({ 
        success: true,
        message: "Venta registrada exitosamente.", 
        data: resultado 
      });
    } catch (error) {
      console.error('Error al registrar venta:', error);
      return res.status(500).json({ 
        success: false,
        message: error.message || "Error interno del servidor al registrar la venta." 
      });
    }
  },

  // Controlador para cancelar una venta
  cancelarVenta: async (req, res) => {
    try {
      const { id_venta, id_motivo } = req.body;
      
      // Validaciones básicas
      if (!id_venta || !id_motivo) {
        return res.status(400).json({ 
          success: false,
          message: "Se requieren id_venta e id_motivo." 
        });
      }

      const cancelado = await ventasModelInstance.cancelarVenta(id_venta, id_motivo);

      if (cancelado) {
        return res.status(200).json({ 
          success: true,
          message: "Venta cancelada exitosamente." 
        });
      } else {
        return res.status(404).json({ 
          success: false,
          message: "Venta no encontrada." 
        });
      }
    } catch (error) {
      console.error('Error al cancelar venta:', error);
      return res.status(500).json({ 
        success: false,
        message: error.message || "Error interno del servidor al cancelar la venta." 
      });
    }
  },

  // Obtener motivos de cancelación
  obtenerMotivosCancelacion: async (req, res) => {
    try {
      const motivos = await ventasModelInstance.obtenerMotivosCancelacion();
      
      return res.status(200).json({ 
        success: true,
        data: motivos 
      });
    } catch (error) {
      console.error('Error al obtener motivos de cancelación:', error);
      return res.status(500).json({ 
        success: false,
        message: error.message || "Error interno del servidor al obtener los motivos de cancelación." 
      });
    }
  },

  // Obtener venta por ID
  obtenerVentaPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const id_venta = parseInt(id);

      if (!id_venta || id_venta <= 0) {
        return res.status(400).json({ 
          success: false,
          message: "ID de venta inválido." 
        });
      }

      const venta = await ventasModelInstance.obtenerVentaPorId(id_venta);
      
      if (!venta) {
        return res.status(404).json({ 
          success: false,
          message: "Venta no encontrada." 
        });
      }

      return res.status(200).json({ 
        success: true,
        data: venta 
      });
    } catch (error) {
      console.error('Error al obtener venta por ID:', error);
      return res.status(500).json({ 
        success: false,
        message: error.message || "Error interno del servidor al obtener la venta." 
      });
    }
  }
};

module.exports = ventasController;