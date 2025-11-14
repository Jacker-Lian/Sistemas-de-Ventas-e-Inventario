const SucursalModel = require('../models/sucursalModel');

// ✅ AGREGAR ESTA LÍNEA - Declarar el objeto antes de usarlo
const sucursalController = {};

sucursalController.listar = async (req, res) => {
  try {
    // ✅ CORREGIR: Usar SucursalModel (con mayúscula) como lo importaste
    const sucursales = await SucursalModel.listar();
    res.status(200).json({ success: true, data: sucursales });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener sucursales' });
  }
};

sucursalController.obtener = async (req, res) => {
  try {
    const id = req.params.id;
    const sucursal = await SucursalModel.obtenerPorId(id);
    if (!sucursal) {
      return res.status(404).json({ success: false, message: 'Sucursal no encontrada' });
    }
    res.status(200).json({ success: true, data: sucursal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

sucursalController.crear = async (req, res) => {
  try {
    const id = await SucursalModel.crear(req.body);
    res.status(201).json({ success: true, message: 'Sucursal creada', id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear la sucursal' });
  }
};

sucursalController.actualizar = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await SucursalModel.actualizar(id, req.body);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Sucursal no encontrada' });
    }
    res.status(200).json({ success: true, message: 'Sucursal actualizada' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar la sucursal' });
  }
};

sucursalController.cambiarEstado = async (req, res) => {
  try {
    const id = req.params.id;
    const { estado } = req.body;
    const result = await SucursalModel.cambiarEstado(id, estado);
    if (!result) return res.status(404).json({ success: false, message: 'Sucursal no encontrada' });
    res.status(200).json({ success: true, message: `Sucursal ${estado ? 'activada' : 'desactivada'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cambiar el estado de la sucursal' });
  }
};

module.exports = sucursalController;
