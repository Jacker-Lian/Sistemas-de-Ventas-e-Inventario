const Sucursal = require('../models/sucursalModel');

module.exports = {
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

  eliminar: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await Sucursal.eliminar(id);

      if (!result) {
        return res.status(404).json({ mensaje: 'Sucursal no encontrada' });
      }

      res.json({ mensaje: 'Sucursal eliminada (baja lógica)' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar la sucursal' });
    }
  }
};
