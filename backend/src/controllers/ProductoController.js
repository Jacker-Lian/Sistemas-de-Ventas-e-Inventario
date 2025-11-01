const ProductoModel = require('../models/ProductoModel');

class ProductoController {
    constructor() {
        this.productoModel = new ProductoModel();
    }

    async obtenerProductos(req, res) {
        try {
            const productos = await this.productoModel.obtenerTodos();
            res.json({
                success: true,
                data: productos
            });
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener productos',
                error: error.message
            });
        }
    }

    async obtenerProductoPorId(req, res) {
        try {
            const { id } = req.params;
            const producto = await this.productoModel.obtenerPorId(id);
            
            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            res.json({
                success: true,
                data: producto
            });
        } catch (error) {
            console.error('Error al obtener producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener producto',
                error: error.message
            });
        }
    }

    async crearProducto(req, res) {
        try {
            const nuevoProducto = req.body;
            const productoId = await this.productoModel.crear(nuevoProducto);
            
            res.status(201).json({
                success: true,
                message: 'Producto creado exitosamente',
                data: { id: productoId }
            });
        } catch (error) {
            console.error('Error al crear producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear producto',
                error: error.message
            });
        }
    }

    async actualizarProducto(req, res) {
        try {
            const { id } = req.params;
            const datosActualizados = req.body;
            
            const actualizado = await this.productoModel.actualizar(id, datosActualizados);
            
            if (!actualizado) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado o no se pudo actualizar'
                });
            }

            res.json({
                success: true,
                message: 'Producto actualizado exitosamente'
            });
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar producto',
                error: error.message
            });
        }
    }

    async eliminarProducto(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await this.productoModel.eliminar(id);
            
            if (!eliminado) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado o no se pudo eliminar'
                });
            }

            res.json({
                success: true,
                message: 'Producto eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar producto',
                error: error.message
            });
        }
    }

    async ajustarStock(req, res) {
        try {
            const { id } = req.params;
            const { cantidad, tipo } = req.body;

            if (!['AUMENTO', 'DISMINUCION'].includes(tipo)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo de ajuste inválido'
                });
            }

            const actualizado = await this.productoModel.actualizarStock(id, cantidad, tipo);
            
            if (!actualizado) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado o no se pudo actualizar el stock'
                });
            }

            res.json({
                success: true,
                message: 'Stock actualizado exitosamente'
            });
        } catch (error) {
            console.error('Error al ajustar stock:', error);
            res.status(500).json({
                success: false,
                message: 'Error al ajustar stock',
                error: error.message
            });
        }
    }
}

module.exports = ProductoController;