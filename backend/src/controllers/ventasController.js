const ventasModel = require("../models/ventasModel");
const express = require("express");

const ventasModelInstance = new ventasModel();

const ventasController = {
  // Controlador para registrar una nueva venta
  registrarVenta: async (req, res) => {
    try {
      const ventaData = req.body;

      // Validar datos requeridos
      if (
        !ventaData.id_usuario ||
        !ventaData.id_caja ||
        !ventaData.tipo_cliente ||
        !ventaData.metodo_pago ||
        !ventaData.total
      ) {
        return res.status(400).json({
          message: "Faltan datos requeridos para registrar la venta.",
        });
      }

      // Validar que id_usuario sea un número positivo
      if (
        !Number.isInteger(ventaData.id_usuario) ||
        ventaData.id_usuario <= 0
      ) {
        return res.status(400).json({
          message: "El id_usuario debe ser un número entero positivo.",
        });
      }

      // Validar que id_caja sea un número positivo
      if (!Number.isInteger(ventaData.id_caja) || ventaData.id_caja <= 0) {
        return res.status(400).json({
          message: "El id_caja debe ser un número entero positivo.",
        });
      }

      // Validar que id_motivo_cancelacion sea un número positivo si se proporciona
      if ( ventaData.id_motivo_cancelacion && (!Number.isInteger(ventaData.id_motivo_cancelacion) || ventaData.id_motivo_cancelacion <= 0) ) {
        return res.status(400).json({
          message: "El id_motivo_cancelacion debe ser un número entero positivo.",
        });
      }

      // Validar tipo_cliente según los valores permitidos en la base de datos
      const tiposClienteValidos = ["DOCENTE", "ALUMNO", "OTRO"];
      if (!tiposClienteValidos.includes(ventaData.tipo_cliente)) {
        return res.status(400).json({
          message:
            "El tipo_cliente debe ser uno de los siguientes: DOCENTE, ALUMNO, OTRO.",
        });
      }

      // Validar metodo_pago según los valores permitidos en la base de datos
      const metodosPagoValidos = ["EFECTIVO", "YAPE", "PLIN", "OTROS"];
      if (!metodosPagoValidos.includes(ventaData.metodo_pago)) {
        return res.status(400).json({
          message:
            "El metodo_pago debe ser uno de los siguientes: EFECTIVO, YAPE, PLIN, OTROS.",
        });
      }

      // Validar que total sea un número positivo con máximo 2 decimales
      const totalNum = parseFloat(ventaData.total);
      if (isNaN(totalNum) || totalNum < 0) {
        return res.status(400).json({
          message: "El total debe ser un número positivo.",
        });
      }

      // Validar que el total no exceda el límite de la base de datos (12,2)
      if (totalNum > 9999999999.99) {
        return res.status(400).json({
          message: "El total excede el límite permitido.",
        });
      }

      // Validar estado_venta si se proporciona
      if (ventaData.estado_venta) {
        const estadosVentaValidos = ["COMPLETADA", "PENDIENTE", "CANCELADA"];
        if (!estadosVentaValidos.includes(ventaData.estado_venta)) {
          return res.status(400).json({
            message:
              "El estado_venta debe ser uno de los siguientes: COMPLETADA, PENDIENTE, CANCELADA.",
          });
        }
      }

      const nuevaVentaId = await ventasModelInstance.registrarVenta(ventaData);

      return res.status(201).json({
        message: "Venta registrada exitosamente.",
        id_venta: nuevaVentaId,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al registrar la venta: " + error.message });
    }
  },
  
  // Controlador para cancelar una venta
  cancelarVenta: async (req, res) => {
    try {
      const Data = req.body;
      // Validar que id_venta sea un número positivo
      if ( Data.id_venta <= 0 || !Number.isInteger(Data.id_venta) ) {
        return res.status(400).json({
          message: "El id_venta debe ser un número entero positivo.",
        });
      }

      if (!Data.id_motivo_cancelacion || !Number.isInteger(Data.id_motivo_cancelacion) || Data.id_motivo_cancelacion <= 0) {
        return res.status(400).json({
          message: "El id_motivo_cancelacion debe ser un número entero positivo.",
        });
      }
      const cancelado = await ventasModelInstance.cancelarVenta(Data.id_venta, Data.id_motivo_cancelacion);

      if (cancelado) {
        return res.status(200).json({
          message: "Venta cancelada exitosamente.",
        });
      } else {
        return res.status(404).json({
          message: "Venta no encontrada.",
        });
      }

    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al cancelar la venta: " + error.message });
    }
  },



  // Controlador para agregar un nuevo motivo de cancelación
  registrarMotivoCancelacion: async (req, res) => {
    try {
        const {descripcion} = req.body;

        // Validar datos requeridos
        if (!descripcion || descripcion.trim() === "") {
            return res.status(400).json({
                message: "Faltan datos requeridos para registrar el motivo de cancelación.",
            });
        }

        const nuevoMotivoCancelacionId = await ventasModelInstance.registrarMotivoCancelacion(descripcion);

        return res.status(201).json({
            message: "Motivo de cancelación registrado exitosamente."
        });

    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al registrar el motivo de cancelación: " + error.message });
    }
  },

  // Controlador para obtener todos los motivos de cancelación
  obtenerMotivosCancelacion: async (req, res) => {
    try {

      const motivos = await ventasModelInstance.obtenerMotivosCancelacion();
      return res.status(200).json(motivos);

    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al obtener los motivos de cancelación: " + error.message });
    }
  },

  // Controlador para desactivar un motivo de cancelación
  desactivarMotivoCancelacion: async (req, res) => {
    try {
      const { id_motivo_cancelacion } = req.params;

      // Validar que id_motivo_cancelacion sea un número positivo
      if (!Number.isInteger(Number(id_motivo_cancelacion)) || Number(id_motivo_cancelacion) <= 0) {
        return res.status(400).json({
          message: "El id_motivo_cancelacion debe ser un número entero positivo.",
        });
      }

      const desactivado = await ventasModelInstance.desactivarMotivoCancelacion(id_motivo_cancelacion);

      if (desactivado) {
        return res.status(200).json({
          message: "Motivo de cancelación desactivado exitosamente.",
        });
      } else {
        return res.status(404).json({
          message: "Motivo de cancelación no encontrado.",
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al desactivar el motivo de cancelación: " + error.message });
    }
  },

};

module.exports = ventasController;
