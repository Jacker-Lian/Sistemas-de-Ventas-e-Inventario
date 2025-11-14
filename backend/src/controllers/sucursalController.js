const Sucursal = require('../models/sucursalModel');

module.exports = {
    listar: async (req, res) => {
    try {
      const sucursales = await Sucursal.listar();
      res.json(sucursales);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener sucursales' });
    }
  },
  
  obtener: async (req, res) => {
    try {
      const id = req.params.id;
      const sucursal = await Sucursal.obtenerPorId(id);

      if (!sucursal) {
        return res.status(404).json({ mensaje: 'Sucursal no encontrada' });
      }

      res.json(sucursal);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
  },

  crear: async (req, res) => {
    try {
      const id = await Sucursal.crear(req.body);
      res.json({ mensaje: 'Sucursal creada', id });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear la sucursal' });
    }
  },

  actualizar: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await Sucursal.actualizar(id, req.body);

      if (!result) {
        return res.status(404).json({ mensaje: 'Sucursal no encontrada' });
      }

      res.json({ mensaje: 'Sucursal actualizada' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar la sucursal' });
    }
  },

  cambiarEstado: async (req, res) => {
    try {
      const id = req.params.id;
      const { estado } = req.body;
      const result = await Sucursal.cambiarEstado(id, estado);
      if (!result) return res.status(404).json({ mensaje: 'Sucursal no encontrada' });
      res.json({ mensaje: `Sucursal ${estado ? 'activada' : 'desactivada'}` });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al cambiar el estado de la sucursal' });
    }
  }
};
