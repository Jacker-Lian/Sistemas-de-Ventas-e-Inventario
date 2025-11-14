const GastoModel = require('../models/gastoModel');

const gastoModel = new GastoModel();

const gastoController = {
  // Obtener todos los gastos
  getGastos: async (req, res) => {
    try {
      const gastos = await gastoModel.obtenerTodos();
      res.status(200).json({
        success: true,
        data: gastos
      });
    } catch (error) {
      console.error('Error al obtener gastos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener gastos'
      });
    }
  },

  // Middleware para obtener gasto por ID
  getGastoById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const gasto = await gastoModel.obtenerPorId(id);
      
      if (!gasto) {
        return res.status(404).json({
          success: false,
          message: 'Gasto no encontrado'
        });
      }
      
      req.gasto = gasto;
      next();
    } catch (error) {
      console.error('Error al obtener gasto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener gasto'
      });
    }
  },

  // Obtener un gasto específico
  getOneGasto: async (req, res) => {
    res.status(200).json({
      success: true,
      data: req.gasto
    });
  },

  // Crear nuevo gasto
  postGasto: async (req, res) => {
    try {
      const { id_tipo_gasto, monto, descripcion, id_usuario, id_caja } = req.body;
      
      if (!id_tipo_gasto || !monto || !id_usuario || !id_caja) {
        return res.status(400).json({
          success: false,
          message: 'Faltan campos obligatorios'
        });
      }

      const nuevoGasto = await gastoModel.crear({
        id_tipo_gasto,
        monto,
        descripcion,
        id_usuario,
        id_caja
      });

      res.status(201).json({
        success: true,
        message: 'Gasto creado exitosamente',
        data: { id: nuevoGasto }
      });
    } catch (error) {
      console.error('Error al crear gasto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear gasto'
      });
    }
  },

  // Actualizar gasto
  putGasto: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_tipo_gasto, monto, descripcion } = req.body;

      const actualizado = await gastoModel.actualizar(id, {
        id_tipo_gasto,
        monto,
        descripcion
      });

      if (actualizado) {
        res.status(200).json({
          success: true,
          message: 'Gasto actualizado correctamente'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'No se pudo actualizar el gasto'
        });
      }
    } catch (error) {
      console.error('Error al actualizar gasto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar gasto'
      });
    }
  },

  // Eliminar gasto (soft delete)
  patchGasto: async (req, res) => {
    try {
      const { id } = req.params;
      const eliminado = await gastoModel.eliminar(id);

      if (eliminado) {
        res.status(200).json({
          success: true,
          message: 'Gasto eliminado correctamente'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'No se pudo eliminar el gasto'
        });
      }
    } catch (error) {
      console.error('Error al eliminar gasto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar gasto'
      });
    }
  },

  // Obtener tipos de gasto
  getTiposGasto: async (req, res) => {
    try {
      const tipos = await gastoModel.obtenerTiposGasto();
      res.status(200).json({
        success: true,
        data: tipos
      });
    } catch (error) {
      console.error('Error al obtener tipos de gasto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener tipos de gasto'
      });
    }
  },

  // Crear tipo de gasto
  postTipoGasto: async (req, res) => {
    try {
      const { nombre, descripcion } = req.body;
      
      if (!nombre) {
        return res.status(400).json({
          success: false,
          message: 'El nombre del tipo de gasto es obligatorio'
        });
      }

      const nuevoTipo = await gastoModel.crearTipoGasto({
        nombre,
        descripcion
      });

      res.status(201).json({
        success: true,
        message: 'Tipo de gasto creado exitosamente',
        data: { id: nuevoTipo }
      });
    } catch (error) {
      console.error('Error al crear tipo de gasto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear tipo de gasto'
      });
    }
  }
};

module.exports = gastoController;