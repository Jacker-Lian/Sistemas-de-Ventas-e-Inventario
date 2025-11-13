const AjusteInventarioModel = require('../models/ajusteInventarioModel');

const AjusteInventarioController = {
    // 1. Crear un nuevo ajuste de inventario (POST /api/ajustes-inventario)
    crearAjuste: async (req, res) => {
        const { 
            id_producto, 
            cantidad_ajustada, 
            tipo_ajuste, 
            id_usuario, 
            observaciones,
            id_sucursal
        } = req.body;

        //VALIDACIÓN DE ENTRADA (Controlador)
        // 1. Verificar campos obligatorios
        if (!id_producto || !cantidad_ajustada || !tipo_ajuste || !id_usuario || !observaciones || !id_sucursal) {
            return res.status(400).json({ 
                success: false, 
                message: 'Faltan campos obligatorios para el ajuste.' 
            });
        }
        
        // 2. Validar que la cantidad sea un número válido y diferente de cero
        const cantidadNumerica = parseInt(cantidad_ajustada);
        if (isNaN(cantidadNumerica) || cantidadNumerica === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'La cantidad debe ser un número entero válido y diferente de cero.' 
            });
        }

        // BLOQUE DE CÓDIGO ELIMINADO/CORREGIDO: 
        // El frontend envía la magnitud y el tipo por separado.
        /*
        if ((cantidadNumerica > 0 && tipo_ajuste !== 'AUMENTO') || (cantidadNumerica < 0 && tipo_ajuste !== 'DISMINUCION')) {
            return res.status(400).json({ 
                success: false, 
                message: 'Error de lógica: El tipo de ajuste no coincide con el signo de la cantidad.' 
            });
        }
        */        
        // --- FIN DE VALIDACIÓN DE ENTRADA ---
        try {
            const datosParaModelo = {
                ...req.body,
                cantidad_ajustada: Math.abs(cantidadNumerica)
            };

            const resultado = await AjusteInventarioModel.crear(datosParaModelo);

            res.status(201).json({
                success: true,
                message: 'Ajuste de inventario creado exitosamente',
                data: resultado
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error al crear el ajuste de inventario',
                error: error.message
            });
        }
    },

    // 2. Obtener todos los ajustes de inventario (GET /api/ajustes-inventario)
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

    // 3. Obtener ajustes por producto (GET /api/ajustes-inventario/producto/:idProducto)
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
    },
    
    // 4. Obtener la lista de productos (GET /api/ajustes-inventario/productos)
    obtenerListaProductos: async (req, res) => {
        try {
            const productos = await AjusteInventarioModel.obtenerListaProductos();
            res.json(productos); 
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener la lista de productos para el selector.',
                error: error.message
            });
        }
    }
};

module.exports = AjusteInventarioController;