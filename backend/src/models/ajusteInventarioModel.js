const db = require('../config/database');

const AjusteInventarioModel = {
    // Crear un nuevo ajuste de inventario
    crear: async (datos) => {
        try {
            const { id_producto, cantidad_ajustada, tipo_ajuste, motivo, id_usuario, stock_anterior, stock_nuevo, observaciones } = datos;
            const query = `
                INSERT INTO ajustes_inventario 
                (id_producto, cantidad_ajustada, tipo_ajuste, motivo, id_usuario, stock_anterior, stock_nuevo, observaciones)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const [resultado] = await db.query(query, [
                id_producto, 
                cantidad_ajustada, 
                tipo_ajuste, 
                motivo, 
                id_usuario, 
                stock_anterior, 
                stock_nuevo, 
                observaciones
            ]);
            return resultado;
        } catch (error) {
            throw error;
        }
    },

    // Obtener todos los ajustes de inventario
    obtenerTodos: async () => {
        try {
            const query = `
                SELECT ai.*, p.nombre as nombre_producto, u.nombre as nombre_usuario
                FROM ajustes_inventario ai
                INNER JOIN producto p ON ai.id_producto = p.id_producto
                INNER JOIN usuarios u ON ai.id_usuario = u.id_usuario
                ORDER BY ai.fecha_creacion DESC
            `;
            const [ajustes] = await db.query(query);
            return ajustes;
        } catch (error) {
            throw error;
        }
    },

    // Obtener un ajuste de inventario por ID
    obtenerPorId: async (id) => {
        try {
            const query = `
                SELECT ai.*, p.nombre as nombre_producto, u.nombre as nombre_usuario
                FROM ajustes_inventario ai
                INNER JOIN producto p ON ai.id_producto = p.id_producto
                INNER JOIN usuarios u ON ai.id_usuario = u.id_usuario
                WHERE ai.id_ajuste = ?
            `;
            const [ajuste] = await db.query(query, [id]);
            return ajuste[0];
        } catch (error) {
            throw error;
        }
    },

    // Obtener ajustes por producto
    obtenerPorProducto: async (idProducto) => {
        try {
            const query = `
                SELECT ai.*, p.nombre as nombre_producto, u.nombre as nombre_usuario
                FROM ajustes_inventario ai
                INNER JOIN producto p ON ai.id_producto = p.id_producto
                INNER JOIN usuarios u ON ai.id_usuario = u.id_usuario
                WHERE ai.id_producto = ?
                ORDER BY ai.fecha_creacion DESC
            `;
            const [ajustes] = await db.query(query, [idProducto]);
            return ajustes;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = AjusteInventarioModel;
