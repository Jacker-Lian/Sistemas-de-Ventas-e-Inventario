const motivoCancelacionModel = require("../models/motivoCancelacionModel");
const express = require("express");

const motivoCancelacionModelInstance = new motivoCancelacionModel();

const motivoCancelacionController = {
  getById: async (req, res) => {
    try {
      const id = req.query.id;

      if (!id)
        return res
          .status(400)
          .json({ message: "El id del motivo de cancelación es requerido" });

      const idNumber = Number(id);
      if (isNaN(idNumber) || idNumber <= 0) {
        return res.status(400).json({
          message:
            "El id del motivo de cancelación debe ser un número entero positivo",
        });
      }

      const motivo =
        await motivoCancelacionModelInstance.obtenerMotivoCancelacionByID(
          idNumber
        );
      res.json(motivo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  register: async (req, res) => {
    try {
      const { descripcion } = req.body;

      if (!descripcion || descripcion.trim() === "") {
        return res
          .status(400)
          .json({ message: "La descripción es requerida." });
      }

      const nuevoMotivoId =
        await motivoCancelacionModelInstance.registrarMotivoCancelacion(
          descripcion.trim()
        );

      res.status(201).json({
        message: "Motivo de cancelación registrado exitosamente.",
        id: nuevoMotivoId,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { descripcion } = req.body;

      const id_motivo = req.query.id_motivo;
      const id_motivo_num = Number(id_motivo);

      if (isNaN(id_motivo_num) || id_motivo_num <= 0) {
        return res.status(400).json({
          message: "El id_motivo debe ser un número entero positivo.",
        });
      }
      if (!descripcion || descripcion.trim() === "") {
        return res
          .status(400)
          .json({ message: "La descripción es requerida." });
      }

      const actualizado =
        await motivoCancelacionModelInstance.actualizarMotivoCancelacion(
          id_motivo_num,
          descripcion.trim()
        );

      if (actualizado) {
        res.json({
          message: "Motivo de cancelación actualizado exitosamente.",
        });
      } else {
        res
          .status(404)
          .json({ message: "Motivo de cancelación no encontrado." });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const motivos =
        await motivoCancelacionModelInstance.obtenerMotivosCancelacion();
      res.json(motivos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deactive: async (req, res) => {
    try {
      const id_motivo = req.query.id_motivo;
      const id_motivo_num = Number(id_motivo);

      const desactivado =
        await motivoCancelacionModelInstance.desactivarMotivoCancelacion(
          id_motivo_num
        );
      if (desactivado) {
        res.json({
          message: "Motivo de cancelación desactivado exitosamente.",
        });
      } else {
        res
          .status(404)
          .json({ message: "Motivo de cancelación no encontrado." });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = motivoCancelacionController;
