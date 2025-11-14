const AjusteInventarioModel = require('../models/ajusteInventarioModel');

const AjusteInventarioController = {
    // Crear un nuevo ajuste de inventario
    crearAjuste: async (req, res) => {
        const id_usuario = req.usuario?.id_usuario;
        
        if (!id_usuario) {
            return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        }

        const { id_producto, tipo_ajuste, observaciones, id_sucursal } = req.body;

        // Validación básica de campos obligatorios
        if (!id_producto || !tipo_ajuste || !id_sucursal) {
            return res.status(400).json({ 
                success: false, 
                message: 'Faltan campos obligatorios: id_producto, tipo_ajuste, id_sucursal' 
            });
        }

        try {
            const datosParaModelo = { 
                id_producto, 
                tipo_ajuste, 
                id_usuario, 
                observaciones: observaciones || '', 
                id_sucursal 
            };

            const resultado = await AjusteInventarioModel.crear(datosParaModelo);

            res.status(201).json({ 
                success: true, 
                message: 'Ajuste de inventario creado exitosamente', 
                data: resultado 
            });
        } catch (error) {
            console.error('Error al crear ajuste:', error);
            
            if (error.message.includes('negativo') || error.message.includes('no fue encontrado')) {
                return res.status(400).json({ 
                    success: false, 
                    message: error.message 
                });
            }

            res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor al crear el ajuste de inventario' 
            });
        }
    },

    // Obtener todos los ajustes de inventario con filtros
    obtenerTodosLosAjustes: async (req, res) => {
        try {
            const filtros = {};
            
            if (req.query.id_producto) filtros.id_producto = parseInt(req.query.id_producto);
            if (req.query.tipo_ajuste) filtros.tipo_ajuste = req.query.tipo_ajuste;
            if (req.query.id_sucursal) filtros.id_sucursal = parseInt(req.query.id_sucursal);
            if (req.query.id_usuario) filtros.id_usuario = parseInt(req.query.id_usuario);
            if (req.query.fecha_inicio) filtros.fecha_inicio = req.query.fecha_inicio;
            if (req.query.fecha_fin) filtros.fecha_fin = req.query.fecha_fin;
            if (req.query.limit) filtros.limit = parseInt(req.query.limit) || 50;
            if (req.query.page) filtros.page = parseInt(req.query.page) || 1;

            const resultado = await AjusteInventarioModel.obtenerTodos(filtros);
            
            res.json({ 
                success: true, 
                data: resultado.ajustes, 
                paginacion: resultado.paginacion
            });
        } catch (error) {
            console.error('Error al obtener ajustes:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor al obtener los ajustes de inventario'
            });
        }
    },

    // Obtener ajustes por producto específico
    obtenerAjustesPorProducto: async (req, res) => {
        try {
            const { idProducto } = req.params;
            
            if (!idProducto || isNaN(parseInt(idProducto))) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'ID de producto inválido' 
                });
            }

            const filtros = {};
            if (req.query.fecha_inicio) filtros.fecha_inicio = req.query.fecha_inicio;
            if (req.query.fecha_fin) filtros.fecha_fin = req.query.fecha_fin;
            if (req.query.limit) filtros.limit = parseInt(req.query.limit);
            if (req.query.page) filtros.page = parseInt(req.query.page);

            const ajustes = await AjusteInventarioModel.obtenerPorProducto(parseInt(idProducto), filtros);
            
            res.json({ 
                success: true, 
                data: ajustes
            });
        } catch (error) {
            console.error('Error al obtener ajustes por producto:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor al obtener los ajustes del producto'
            });
        }
    },

    // Obtener estadísticas de ajustes
    obtenerEstadisticas: async (req, res) => {
        try {
            const filtros = {};
            
            if (req.query.fecha_inicio) filtros.fecha_inicio = req.query.fecha_inicio;
            if (req.query.fecha_fin) filtros.fecha_fin = req.query.fecha_fin;
            if (req.query.id_sucursal) filtros.id_sucursal = parseInt(req.query.id_sucursal);

            const estadisticas = await AjusteInventarioModel.obtenerEstadisticas(filtros);
            
            res.json({ 
                success: true, 
                data: estadisticas 
            });
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor al obtener estadísticas'
            });
        }
    }
};

module.exports = AjusteInventarioController;
