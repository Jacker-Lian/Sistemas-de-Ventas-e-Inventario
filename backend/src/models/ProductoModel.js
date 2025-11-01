const database = require('../config/database');

class ProductoModel {
    constructor() {
        this.table = 'producto';
    }

    async obtenerTodos() {
        try {
            const pool = database.getPool();
            const [productos] = await pool.query(
                'SELECT p.*, c.nombre as nombre_categoria, pr.nombre as nombre_proveedor ' +
                'FROM producto p ' +
                'LEFT JOIN categoria c ON p.id_categoria = c.id_categoria ' +
                'LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor ' +
                'WHERE p.estado = 1'
            );
            return productos;
        } catch (error) {
            throw error;
        }
    }

    async obtenerPorId(id) {
        try {
            const pool = database.getPool();
            const [productos] = await pool.query(
                'SELECT p.*, c.nombre as nombre_categoria, pr.nombre as nombre_proveedor ' +
                'FROM producto p ' +
                'LEFT JOIN categoria c ON p.id_categoria = c.id_categoria ' +
                'LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor ' +
                'WHERE p.id_producto = ? AND p.estado = 1',
                [id]
            );
            return productos[0];
        } catch (error) {
            throw error;
        }
    }

    async crear(producto) {
        try {
            const pool = database.getPool();
            const [result] = await pool.query(
                'INSERT INTO producto (nombre, descripcion, precio_compra, precio_venta, stock, id_categoria, id_proveedor) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [producto.nombre, producto.descripcion, producto.precio_compra, producto.precio_venta, producto.stock, producto.id_categoria, producto.id_proveedor]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    async actualizar(id, producto) {
        try {
            const pool = database.getPool();
            const [result] = await pool.query(
                'UPDATE producto SET nombre = ?, descripcion = ?, precio_compra = ?, precio_venta = ?, stock = ?, id_categoria = ?, id_proveedor = ? WHERE id_producto = ? AND estado = 1',
                [producto.nombre, producto.descripcion, producto.precio_compra, producto.precio_venta, producto.stock, producto.id_categoria, producto.id_proveedor, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    async eliminar(id) {
        try {
            const pool = database.getPool();
            const [result] = await pool.query(
                'UPDATE producto SET estado = 0 WHERE id_producto = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    async actualizarStock(id, cantidad, tipo) {
        try {
            const pool = database.getPool();
            const [producto] = await pool.query(
                'SELECT stock FROM producto WHERE id_producto = ? AND estado = 1',
                [id]
            );

            if (!producto[0]) {
                throw new Error('Producto no encontrado');
            }

            const stockActual = producto[0].stock;
            const nuevoStock = tipo === 'AUMENTO' ? stockActual + cantidad : stockActual - cantidad;

            if (nuevoStock < 0) {
                throw new Error('No hay suficiente stock disponible');
            }

            const [result] = await pool.query(
                'UPDATE producto SET stock = ? WHERE id_producto = ? AND estado = 1',
                [nuevoStock, id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProductoModel;