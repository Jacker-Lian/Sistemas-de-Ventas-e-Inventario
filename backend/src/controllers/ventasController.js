const VentasModel = require("../models/ventasModel");
const ventasModelInstance = new VentasModel();

const ventasController = {
  // Registrar nueva venta
  registrarVenta: async (req, res) => {
    try {
      const ventaData = req.body;
      const estado_venta = req.body.estado_venta || "COMPLETADA";

      // Validar campos obligatorios
      const requeridos = ["id_usuario", "id_caja", "tipo_cliente", "metodo_pago", "productos"];
      for (const campo of requeridos) {
        if (!ventaData[campo]) {
          return res.status(400).json({
            success: false,
            message: `Falta el campo requerido: ${campo}.`
          });
        }
      }

      // Validaciones numéricas
      const validarEnteroPositivo = (valor, nombre) => {
        if (!Number.isInteger(valor) || valor <= 0) {
          throw new Error(`${nombre} debe ser un número entero positivo.`);
        }
      };
      try {
        validarEnteroPositivo(ventaData.id_usuario, "id_usuario");
        validarEnteroPositivo(ventaData.id_caja, "id_caja");
        if (ventaData.id_sucursal) validarEnteroPositivo(ventaData.id_sucursal, "id_sucursal");
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      // Validaciones de tipo_cliente y metodo_pago
      const tiposClienteValidos = ["DOCENTE", "ALUMNO", "OTRO"];
      const metodosPagoValidos = ["EFECTIVO", "YAPE", "PLIN", "OTROS"];
      if (!tiposClienteValidos.includes(ventaData.tipo_cliente)) {
        return res.status(400).json({
          success: false,
          message: `El tipo_cliente debe ser uno de: ${tiposClienteValidos.join(", ")}.`
        });
      }
      if (!metodosPagoValidos.includes(ventaData.metodo_pago)) {
        return res.status(400).json({
          success: false,
          message: `El metodo_pago debe ser uno de: ${metodosPagoValidos.join(", ")}.`
        });
      }

      // Validar productos
      if (!Array.isArray(ventaData.productos) || ventaData.productos.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Debe incluir al menos un producto en la venta."
        });
      }
      for (let i = 0; i < ventaData.productos.length; i++) {
        const producto = ventaData.productos[i];
        if (!producto.id_producto || !Number.isInteger(producto.id_producto) || producto.id_producto <= 0) {
          return res.status(400).json({
            success: false,
            message: `El producto #${i + 1} tiene un id_producto inválido.`
          });
        }
        if (!producto.cantidad || !Number.isInteger(producto.cantidad) || producto.cantidad <= 0) {
          return res.status(400).json({
            success: false,
            message: `El producto #${i + 1} tiene una cantidad inválida.`
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

  // Cancelar venta
  cancelarVenta: async (req, res) => {
    try {
      const { id_venta, id_motivo_cancelacion } = req.body;
      if (!id_venta || !id_motivo_cancelacion) {
        return res.status(400).json({
          success: false,
          message: "Se requieren id_venta e id_motivo_cancelacion."
        });
      }

      if (!Number.isInteger(id_venta) || id_venta <= 0 ||
          !Number.isInteger(id_motivo_cancelacion) || id_motivo_cancelacion <= 0) {
        return res.status(400).json({
          success: false,
          message: "Los IDs deben ser números enteros positivos."
        });
      }

      const cancelado = await ventasModelInstance.cancelarVenta(id_venta, id_motivo_cancelacion);
      if (cancelado) {
        return res.status(200).json({ success: true, message: "Venta cancelada exitosamente." });
      } else {
        return res.status(404).json({ success: false, message: "Venta no encontrada." });
      }
    } catch (error) {
      console.error("Error al cancelar venta:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Desactivar ventas (por caja)
  desactivarVentas: async (req, res) => {
    try {
      const { id_caja } = req.body;
      if (!Number.isInteger(id_caja) || id_caja <= 0) {
        return res.status(400).json({
          success: false,
          message: "El id_caja debe ser un número entero positivo."
        });
      }

      const desactivado = await ventasModelInstance.desactivarVentas(id_caja);
      if (desactivado) {
        return res.status(200).json({ success: true, message: "Ventas desactivadas exitosamente." });
      } else {
        return res.status(404).json({ success: false, message: "Caja no encontrada o ya desactivada." });
      }
    } catch (error) {
      console.error("Error al desactivar ventas:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Obtener motivos de cancelación
  obtenerMotivosCancelacion: async (req, res) => {
    try {
      const motivos = await ventasModelInstance.obtenerMotivosCancelacion();
      return res.status(200).json({ success: true, data: motivos });
    } catch (error) {
      console.error("Error al obtener motivos de cancelación:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Obtener venta por ID
  obtenerVentaPorId: async (req, res) => {
    try {
      const id_venta = parseInt(req.params.id);
      if (!id_venta || id_venta <= 0) {
        return res.status(400).json({ success: false, message: "ID de venta inválido." });
      }

      const venta = await ventasModelInstance.obtenerVentaPorId(id_venta);
      if (!venta) {
        return res.status(404).json({ success: false, message: "Venta no encontrada." });
      }

      return res.status(200).json({ success: true, data: venta });
    } catch (error) {
      console.error("Error al obtener venta por ID:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Reporte de ventas por producto
  reporteVentasPorProducto: async (req, res) => {
    try {
      const { fechaInicio, fechaFin } = req.query;
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ success: false, message: "Se requieren fechaInicio y fechaFin." });
      }

      const result = await ventasModelInstance.reporteVentaProducto(fechaInicio, fechaFin);
      if (!result || result.length === 0) {
        return res.status(404).json({ success: false, message: "No se encontraron ventas en el rango proporcionado." });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error en reporte de ventas por producto:", error);
      return res.status(500).json({ success: false, message: "Error al generar el reporte." });
    }
  }
};

module.exports = ventasController;
