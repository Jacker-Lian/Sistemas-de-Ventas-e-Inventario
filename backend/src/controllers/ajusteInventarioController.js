const AjusteInventarioModel = require('../models/ajusteInventarioModel');

const ajusteInventarioController = {};
const ajusteModel = new AjusteInventarioModel();

/**
 * POST /api/inventario/ajuste
 * Body: { 
 *   id_producto, 
 *   cantidad_anterior, 
 *   cantidad_nueva, 
 *   tipo_ajuste, 
 *   motivo, 
 *   id_usuario_ajuste 
 * }
 */
ajusteInventarioController.crearAjuste = async (req, res) => {
  try {
    const ajusteData = req.body;

    // Validaciones básicas
    if (!ajusteData.id_producto || !ajusteData.cantidad_nueva || !ajusteData.motivo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan campos requeridos' 
      });
    }

    if (ajusteData.cantidad_nueva < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'La cantidad nueva no puede ser negativa' 
      });
    }

    // Crear el ajuste
    const idAjuste = await ajusteModel.crearAjuste(ajusteData);

    return res.status(201).json({
      success: true,
      message: 'Ajuste de inventario creado exitosamente',
      data: { id_ajuste: idAjuste }
    });

  } catch (error) {
    console.error('Error al crear ajuste de inventario:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al crear el ajuste de inventario' 
    });
  }
};

/**
 * GET /api/inventario/ajustes
 * Query params: fecha_inicio, fecha_fin, id_producto
 */
ajusteInventarioController.obtenerAjustes = async (req, res) => {
  try {
    const filtros = {
      fecha_inicio: req.query.fecha_inicio,
      fecha_fin: req.query.fecha_fin,
      id_producto: req.query.id_producto
    };

    const ajustes = await ajusteModel.obtenerAjustes(filtros);

    return res.json({
      success: true,
      data: ajustes
    });

  } catch (error) {
    console.error('Error al obtener ajustes de inventario:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los ajustes de inventario' 
    });
  }
};

module.exports = ajusteInventarioController;