const AjusteInventarioModel = require('../models/ajusteInventarioModel');

const AjusteInventarioController = {
    // Crear un nuevo ajuste de inventario
    crearAjuste: async (req, res) => {
        try {
            const resultado = await AjusteInventarioModel.crear(req.body);
            res.status(201).json({
                success: true,
                message: 'Ajuste de inventario creado exitosamente',
                data: resultado
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al crear el ajuste de inventario',
                error: error.message
            });
        }
    },

    // Obtener todos los ajustes de inventario
    obtenerTodosLosAjustes: async (req, res) => {
        try {
            const ajustes = await AjusteInventarioModel.obtenerTodos();
            res.json({
                success: true,
                data: ajustes
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener los ajustes de inventario',
                error: error.message
            });
        }
    },

    // Obtener ajustes por producto
    obtenerAjustesPorProducto: async (req, res) => {
        try {
            const ajustes = await AjusteInventarioModel.obtenerPorProducto(req.params.idProducto);
            res.json({
                success: true,
                data: ajustes
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener los ajustes del producto',
                error: error.message
            });
        }
    }
};

module.exports = AjusteInventarioController;
