const VentasModel = require("../models/ventasModel");

const ventasModelInstance = new VentasModel();

const ventasController = {
  // Reporte de ventas por producto
  reporteVentasPorProducto: async (req, res) => {
    try {
      const { fechaInicio, fechaFin } = req.query;
      
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ 
          success: false,
          message: "Se requieren fecha_inicio y fecha_fin" 
        });
      }

      const result = await ventasModelInstance.reporteVentaProducto(fechaInicio, fechaFin);
      
      if (!result || result.length === 0) {
        return res.status(404).json({ 
          success: false,
          message: "No se encontraron ventas en el rango de fechas proporcionado" 
        });
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error en reporte de ventas por producto:', error);
      res.status(500).json({ 
        success: false,
        message: "Error al generar el reporte" 
      });
    }
  },

  // Registrar una nueva venta
  registrarVenta: async (req, res) => {
    try {
      const ventaData = req.body;
      const estado_venta = req.body.estado_venta || "COMPLETADA";

      // Validar datos requeridos
      const requeridos = ["id_usuario", "id_caja", "tipo_cliente", "metodo_pago", "productos"];
      for (const campo of requeridos) {
        if (!ventaData[campo]) {
          return res.status(400).json({
            success: false,
            message: `Falta el campo requerido: ${campo}`
          });
        }
      }

      // Validar que id_usuario sea un número positivo
      if (!Number.isInteger(ventaData.id_usuario) || ventaData.id_usuario <= 0) {
        return res.status(400).json({
          success: false,
          message: "El id_usuario debe ser un número entero positivo."
        });
      }

      // Validar que id_caja sea un número positivo
      if (!Number.isInteger(ventaData.id_caja) || ventaData.id_caja <= 0) {
        return res.status(400).json({
          success: false,
          message: "El id_caja debe ser un número entero positivo."
        });
      }

      // Validar que id_sucursal sea un número positivo si se proporciona
      if (ventaData.id_sucursal && (!Number.isInteger(ventaData.id_sucursal) || ventaData.id_sucursal <= 0)) {
        return res.status(400).json({
          success: false,
          message: "El id_sucursal debe ser un número entero positivo."
        });
      }

      // Validar tipo_cliente
      const tiposClienteValidos = ["DOCENTE", "ALUMNO", "OTRO"];
      if (!tiposClienteValidos.includes(ventaData.tipo_cliente)) {
        return res.status(400).json({
          success: false,
          message: `El tipo_cliente debe ser uno de: ${tiposClienteValidos.join(", ")}`
        });
      }

      // Validar metodo_pago
      const metodosPagoValidos = ["EFECTIVO", "YAPE", "PLIN", "OTROS"];
      if (!metodosPagoValidos.includes(ventaData.metodo_pago)) {
        return res.status(400).json({
          success: false,
          message: `El metodo_pago debe ser uno de: ${metodosPagoValidos.join(", ")}`
        });
      }

      // Validar array de productos
      if (!Array.isArray(ventaData.productos) || ventaData.productos.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Debe proporcionar al menos un producto para la venta."
        });
      }

      // Validar cada producto
      for (let i = 0; i < ventaData.productos.length; i++) {
        const producto = ventaData.productos[i];

        if (!producto.id_producto || !Number.isInteger(producto.id_producto) || producto.id_producto <= 0) {
          return res.status(400).json({
            success: false,
            message: `El producto en la posición ${i + 1} debe tener un id_producto válido (número entero positivo).`
          });
        }

        if (!producto.cantidad || !Number.isInteger(producto.cantidad) || producto.cantidad <= 0) {
          return res.status(400).json({
            success: false,
            message: `El producto en la posición ${i + 1} debe tener una cantidad válida (número entero positivo).`
          });
        }
      }

      const resultado = await ventasModelInstance.registrarVenta(ventaData, estado_venta);

      return res.status(201).json({
        success: true,
        message: "Venta registrada exitosamente.",
        data: resultado
      });
    } catch (error) {
      console.error("Error al registrar venta:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Error interno del servidor al registrar la venta."
      });
    }
  },

  // Cancelar una venta
  cancelarVenta: async (req, res) => {
    try {
      const { id_venta, id_motivo_cancelacion } = req.body;

      // Validar que id_venta sea un número positivo
      if (!id_venta || !Number.isInteger(id_venta) || id_venta <= 0) {
        return res.status(400).json({
          success: false,
          message: "El id_venta debe ser un número entero positivo."
        });
      }

      if (!id_motivo_cancelacion || !Number.isInteger(id_motivo_cancelacion) || id_motivo_cancelacion <= 0) {
        return res.status(400).json({
          success: false,
          message: "El id_motivo_cancelacion debe ser un número entero positivo."
        });
      }

      const cancelado = await ventasModelInstance.cancelarVenta(id_venta, id_motivo_cancelacion);

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
      console.error("Error al cancelar venta:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Error al cancelar la venta"
      });
    }
  },

  // Desactivar ventas de una caja
  desactivarVentas: async (req, res) => {
    try {
      const { id_caja } = req.body;

      // Validar que id_caja sea un número entero positivo
      if (!Number.isInteger(id_caja) || id_caja <= 0) {
        return res.status(400).json({
          success: false,
          message: "El id_caja debe ser un número entero positivo."
        });
      }

      const desactivado = await ventasModelInstance.desactivarVentas(id_caja);

      if (desactivado) {
        return res.status(200).json({
          success: true,
          message: "Ventas desactivadas exitosamente."
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Caja no encontrada o ventas ya desactivadas."
        });
      }
    } catch (error) {
      console.error("Error al desactivar ventas:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Error al desactivar las ventas"
      });
    }
  },

  // Obtener venta por ID
  obtenerVentaPorId: async (req, res) => {
    try {
      const id_venta = parseInt(req.params.id);

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
      console.error("Error al obtener venta por ID:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Error al obtener la venta"
      });
    }
  }
};

module.exports = ventasController;