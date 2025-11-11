const ventasModel = require("../models/ventasModel");

const ventasModelInstance = new ventasModel();

const ventasController = {
  registrarVenta: async (req, res) => {
    try {
      const ventaData = req.body;

      if (!ventaData.id_usuario || !ventaData.id_caja || !ventaData.tipo_cliente || !ventaData.metodo_pago || !ventaData.productos) {
        return res.status(400).json({ message: "Faltan datos requeridos para registrar la venta." });
      }

      if (!Number.isInteger(ventaData.id_usuario) || ventaData.id_usuario <= 0) {
        return res.status(400).json({ message: "El id_usuario debe ser un número entero positivo." });
      }

      if (!Number.isInteger(ventaData.id_caja) || ventaData.id_caja <= 0) {
        return res.status(400).json({ message: "El id_caja debe ser un número entero positivo." });
      }

      if (ventaData.id_sucursal && (!Number.isInteger(ventaData.id_sucursal) || ventaData.id_sucursal <= 0)) {
        return res.status(400).json({ message: "El id_sucursal debe ser un número entero positivo." });
      }

      const tiposClienteValidos = ["DOCENTE", "ALUMNO", "OTRO"];
      if (!tiposClienteValidos.includes(ventaData.tipo_cliente)) {
        return res.status(400).json({ message: "El tipo_cliente debe ser uno de los siguientes: DOCENTE, ALUMNO, OTRO." });
      }

      const metodosPagoValidos = ["EFECTIVO", "YAPE", "PLIN", "OTROS"];
      if (!metodosPagoValidos.includes(ventaData.metodo_pago)) {
        return res.status(400).json({ message: "El metodo_pago debe ser uno de los siguientes: EFECTIVO, YAPE, PLIN, OTROS." });
      }

      if (ventaData.estado_venta) {
        const estadosVentaValidos = ["COMPLETADA", "PENDIENTE", "CANCELADA"];
        if (!estadosVentaValidos.includes(ventaData.estado_venta)) {
          return res.status(400).json({ message: "El estado_venta debe ser uno de los siguientes: COMPLETADA, PENDIENTE, CANCELADA." });
        }
      }

      if (!Array.isArray(ventaData.productos) || ventaData.productos.length === 0) {
        return res.status(400).json({ message: "Debe proporcionar al menos un producto para la venta." });
      }

      for (let i = 0; i < ventaData.productos.length; i++) {
        const producto = ventaData.productos[i];

        if (!producto.id_producto || !Number.isInteger(producto.id_producto) || producto.id_producto <= 0) {
          return res.status(400).json({ message: `El producto en la posición ${i + 1} debe tener un id_producto válido.` });
        }

        if (!producto.cantidad || !Number.isInteger(producto.cantidad) || producto.cantidad <= 0) {
          return res.status(400).json({ message: `El producto en la posición ${i + 1} debe tener una cantidad válida.` });
        }

        const precioUnitario = parseFloat(producto.precio_unitario);
        if (isNaN(precioUnitario) || precioUnitario <= 0) {
          return res.status(400).json({ message: `El producto en la posición ${i + 1} debe tener un precio_unitario válido.` });
        }

        if (precioUnitario > 99999999.99) {
          return res.status(400).json({ message: `El precio_unitario del producto en la posición ${i + 1} excede el límite permitido.` });
        }
      }

      const resultado = await ventasModelInstance.registrarVenta(ventaData);
      return res.status(201).json({ message: "Venta registrada exitosamente.", data: resultado });
    } catch (error) {
      return res.status(500).json({ message: "Error al registrar la venta: " + error.message });
    }
  },

  cancelarVenta: async (req, res) => {
    try {
      const Data = req.body;
      
      if (Data.id_venta <= 0 || !Number.isInteger(Data.id_venta)) {
        return res.status(400).json({ message: "El id_venta debe ser un número entero positivo." });
      }

      if (!Data.id_motivo_cancelacion || !Number.isInteger(Data.id_motivo_cancelacion) || Data.id_motivo_cancelacion <= 0) {
        return res.status(400).json({ message: "El id_motivo_cancelacion debe ser un número entero positivo." });
      }

      const cancelado = await ventasModelInstance.cancelarVenta(Data.id_venta, Data.id_motivo_cancelacion);

      if (cancelado) {
        return res.status(200).json({ message: "Venta cancelada exitosamente." });
      } else {
        return res.status(404).json({ message: "Venta no encontrada." });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error al cancelar la venta: " + error.message });
    }
  },

  registrarMotivoCancelacion: async (req, res) => {
    try {
      const { descripcion } = req.body;

      if (!descripcion) {
        return res.status(400).json({ message: "Faltan datos requeridos para registrar el motivo de cancelación." });
      }
      if (!isNaN(descripcion)) {
        return res.status(400).json({ message: "La descripción de cancelación no puede ser un número." });
      }
      if (descripcion.length === 0) {
        return res.status(400).json({ message: "La descripción de cancelación no puede estar vacía." });
      }

      await ventasModelInstance.registrarMotivoCancelacion(descripcion);
      return res.status(201).json({ message: "Motivo de cancelación registrado exitosamente." });
    } catch (error) {
      return res.status(500).json({ message: "Error al registrar el motivo de cancelación: " + error.message });
    }
  },

  obtenerMotivosCancelacion: async (req, res) => {
    try {
      const motivos = await ventasModelInstance.obtenerMotivosCancelacion();
      return res.status(200).json(motivos);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener los motivos de cancelación: " + error.message });
    }
  },

  desactivarMotivoCancelacion: async (req, res) => {
    try {
      const { id_motivo_cancelacion } = req.body;
      const id_motivo_num = Number(id_motivo_cancelacion);

      if (!Number.isInteger(id_motivo_num) || id_motivo_num <= 0) {
        return res.status(400).json({ message: "El id_motivo debe ser un número entero positivo." });
      }

      const desactivado = await ventasModelInstance.desactivarMotivoCancelacion(id_motivo_num);

      if (desactivado) {
        return res.status(200).json({ message: "Motivo de cancelación desactivado exitosamente." });
      } else {
        return res.status(404).json({ message: "Motivo de cancelación no encontrado." });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error al desactivar el motivo de cancelación: " + error.message });
    }
  },
};

module.exports = ventasController;