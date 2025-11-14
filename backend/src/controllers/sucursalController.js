const Sucursal = require('../models/sucursalModel');

module.exports = {
  listar: async (req, res) => {
    try {
      const sucursales = await Sucursal.listar();
      res.json({
        success: true,
        data: sucursales
      });
    } catch (error) {
      console.error('Error al obtener sucursales:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error al obtener sucursales' 
      });
    }
  },
  
  obtener: async (req, res) => {
    try {
      const id = req.params.id;
      const sucursal = await Sucursal.obtenerPorId(id);

      if (!sucursal) {
        return res.status(404).json({ 
          success: false,
          message: 'Sucursal no encontrada' 
        });
      }

      res.json({
        success: true,
        data: sucursal
      });
    } catch (error) {
      console.error('Error al obtener sucursal:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error en el servidor' 
      });
    }
  },

  crear: async (req, res) => {
    try {
      const id = await Sucursal.crear(req.body);
      res.status(201).json({ 
        success: true,
        message: 'Sucursal creada exitosamente', 
        data: { id } 
      });
    } catch (error) {
      console.error('Error al crear sucursal:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error al crear la sucursal' 
      });
    }
  },

  actualizar: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await Sucursal.actualizar(id, req.body);

      if (!result) {
        return res.status(404).json({ 
          success: false,
          message: 'Sucursal no encontrada' 
        });
      }

      res.json({ 
        success: true,
        message: 'Sucursal actualizada exitosamente' 
      });
    } catch (error) {
      console.error('Error al actualizar sucursal:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error al actualizar la sucursal' 
      });
    }
  },

  cambiarEstado: async (req, res) => {
    try {
      const id = req.params.id;
      const { estado } = req.body;
      
      const result = await Sucursal.cambiarEstado(id, estado);
      
      if (!result) {
        return res.status(404).json({ 
          success: false,
          message: 'Sucursal no encontrada' 
        });
      }
      
      res.json({ 
        success: true,
        message: `Sucursal ${estado ? 'activada' : 'desactivada'} exitosamente` 
      });
    } catch (error) {
      console.error('Error al cambiar estado de sucursal:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error al cambiar el estado de la sucursal' 
      });
    }
  }
};