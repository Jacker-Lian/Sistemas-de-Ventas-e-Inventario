const ventasModel = require("../models/ventasModel");
const express = require("express");

const ventasModelInstance = new ventasModel();

const ventasController = {
  // Controlador para registrar una nueva venta
  registrarVenta: async (req, res) => {
    try {
      const ventaData = {
        id_usuario: req.body.id_usuario,
        id_caja: req.body.id_caja,
        id_sucursal: req.body.id_sucursal,
        tipo_cliente: req.body.tipo_cliente,
        metodo_pago: req.body.metodo_pago,
        productos: req.body.productos,
      };

      const estado_venta = req.body.estado_venta || "COMPLETADA";

      // Validar datos requeridos
      if (
        !ventaData.id_usuario ||
        !ventaData.id_caja ||
        !ventaData.tipo_cliente ||
        !ventaData.metodo_pago ||
        !ventaData.productos
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

      // Validar que id_sucursal sea un número positivo si se proporciona
      if (
        ventaData.id_sucursal &&
        (!Number.isInteger(ventaData.id_sucursal) || ventaData.id_sucursal <= 0)
      ) {
        return res.status(400).json({
          message: "El id_sucursal debe ser un número entero positivo.",
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

      // Validar array de productos
      if (
        !Array.isArray(ventaData.productos) ||
        ventaData.productos.length === 0
      ) {
        return res.status(400).json({
          message: "Debe proporcionar al menos un producto para la venta.",
        });
      }

      // Validar cada producto
      for (let i = 0; i < ventaData.productos.length; i++) {
        const producto = ventaData.productos[i];

        if (
          !producto.id_producto ||
          !Number.isInteger(producto.id_producto) ||
          producto.id_producto <= 0
        ) {
          return res.status(400).json({
            message: `El producto en la posición ${
              i + 1
            } debe tener un id_producto válido (número entero positivo).`,
          });
        }

        if (
          !producto.cantidad ||
          !Number.isInteger(producto.cantidad) ||
          producto.cantidad <= 0
        ) {
          return res.status(400).json({
            message: `El producto en la posición ${
              i + 1
            } debe tener una cantidad válida (número entero positivo).`,
          });
        }
      }

      const resultado = await ventasModelInstance.registrarVenta(
        ventaData,
        estado_venta
      );

      return res.status(201).json({
        message: "Venta registrada exitosamente.",
        data: resultado,
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
      if (Data.id_venta <= 0 || !Number.isInteger(Data.id_venta)) {
        return res.status(400).json({
          message: "El id_venta debe ser un número entero positivo.",
        });
      }

      if (
        !Data.id_motivo_cancelacion ||
        !Number.isInteger(Data.id_motivo_cancelacion) ||
        Data.id_motivo_cancelacion <= 0
      ) {
        return res.status(400).json({
          message:
            "El id_motivo_cancelacion debe ser un número entero positivo.",
        });
      }
      const cancelado = await ventasModelInstance.cancelarVenta(
        Data.id_venta,
        Data.id_motivo_cancelacion
      );

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

  desactivarVentas: async (req, res) => {
    try {
      const { id_caja } = req.body;

      // Validar que id_caja sea un número entero positivo
      if (!Number.isInteger(id_caja) || id_caja <= 0) {
        return res.status(400).json({
          message: "El id_caja debe ser un número entero positivo.",
        });
      }

      const desactivado = await ventasModelInstance.desactivarVentas(id_caja);

      if (desactivado) {
        return res.status(200).json({
          message: "Ventas desactivadas exitosamente.",
        });
      } else {
        return res.status(404).json({
          message: "Caja no encontrada o ventas ya desactivadas.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Error al desactivar las ventas: " + error.message,
      });
    }
  },

  // Controladores extra para probar funcionalidades de gestion de categorias

  obtenerCategorias: async (req, res) => {
    try {
      const categorias = await ventasModelInstance.obtenerCategorias();
      return res.status(200).json(categorias);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener las categorías: " + error.message,
      });
    }
  },
};

module.exports = ventasController;
