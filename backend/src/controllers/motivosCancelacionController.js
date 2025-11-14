const MotivosCancelacionModel = require('../models/motivosCancelacionModel');

const motivosCancelacionModelInstance = new MotivosCancelacionModel();

const MotivosCancelacionController = {
  /**
   * Crear nuevo motivo de cancelación
   */
  crearMotivoCancelacion: async (req, res) => {
    try {
      const { descripcion } = req.body;

      if (!descripcion || descripcion.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "La descripción del motivo no puede estar vacía.",
        });
      }

      const id_motivo = await motivosCancelacionModelInstance.crear(descripcion.trim());

      return res.status(201).json({
        success: true,
        message: "Motivo de cancelación creado exitosamente.",
        data: { id_motivo },
      });
    } catch (error) {
      console.error("Error al crear motivo de cancelación:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al crear el motivo de cancelación.",
      });
    }
  },

  /**
   * Obtener todos los motivos activos
   */
  obtenerMotivosActivos: async (req, res) => {
    try {
      const motivos = await motivosCancelacionModelInstance.obtenerTodosActivos();

      return res.status(200).json({
        success: true,
        data: motivos,
      });
    } catch (error) {
      console.error("Error al obtener motivos de cancelación:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al obtener los motivos de cancelación.",
      });
    }
  },

  /**
   * Obtener motivo por ID
   */
  obtenerMotivoPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const id_motivo = parseInt(id);

      if (!id_motivo || id_motivo <= 0) {
        return res.status(400).json({
          success: false,
          message: "ID de motivo inválido.",
        });
      }

      const motivo = await motivosCancelacionModelInstance.obtenerPorId(id_motivo);

      if (!motivo) {
        return res.status(404).json({
          success: false,
          message: "Motivo de cancelación no encontrado.",
        });
      }

      return res.status(200).json({
        success: true,
        data: motivo,
      });
    } catch (error) {
      console.error("Error al obtener motivo por ID:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al obtener el motivo de cancelación.",
      });
    }
  },

  /**
   * Actualizar motivo de cancelación
   */
  actualizarMotivo: async (req, res) => {
    try {
      const { id } = req.params;
      const { descripcion } = req.body;
      const id_motivo = parseInt(id);

      if (!id_motivo || id_motivo <= 0) {
        return res.status(400).json({
          success: false,
          message: "ID de motivo inválido.",
        });
      }

      if (!descripcion || descripcion.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "La descripción no puede estar vacía.",
        });
      }

      const actualizado = await motivosCancelacionModelInstance.actualizar(id_motivo, descripcion.trim());

      if (!actualizado) {
        return res.status(404).json({
          success: false,
          message: "Motivo de cancelación no encontrado.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Motivo de cancelación actualizado exitosamente.",
      });
    } catch (error) {
      console.error("Error al actualizar motivo de cancelación:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al actualizar el motivo de cancelación.",
      });
    }
  },

  /**
   * Desactivar motivo de cancelación
   */
  desactivarMotivo: async (req, res) => {
    try {
      const { id } = req.params;
      const id_motivo = parseInt(id);

      if (!id_motivo || id_motivo <= 0) {
        return res.status(400).json({
          success: false,
          message: "ID de motivo inválido.",
        });
      }

      const desactivado = await motivosCancelacionModelInstance.desactivar(id_motivo);

      if (!desactivado) {
        return res.status(404).json({
          success: false,
          message: "Motivo de cancelación no encontrado.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Motivo de cancelación desactivado exitosamente.",
      });
    } catch (error) {
      console.error("Error al desactivar motivo de cancelación:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al desactivar el motivo de cancelación.",
      });
    }
  },
};

module.exports = MotivosCancelacionController;
