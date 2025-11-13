const db = require('../config/database');

const AjusteInventarioModel = {
    crear: async (datos) => {
        const {
            id_producto,
            tipo_ajuste,
            id_usuario,
            observaciones,
            id_sucursal
        } = datos;

        let connection;
        try {
            connection = await db.getPool().getConnection();
            await connection.beginTransaction();

            // Obtener stock actual
            const [productRows] = await connection.query(
                'SELECT stock, nombre FROM producto WHERE id_producto = ? AND estado = 1',
                [id_producto]
            );

            if (productRows.length === 0) {
                throw new Error('El producto no fue encontrado o está inactivo.');
            }

            const stock_actual = productRows[0].stock;
            const nombre_producto = productRows[0].nombre;

            // El nuevo stock dependerá del tipo de ajuste
            const stock_nuevo =
                tipo_ajuste === 'AUMENTO'
                    ? stock_actual + 1
                    : tipo_ajuste === 'DISMINUCION'
                    ? stock_actual - 1
                    : stock_actual;

            if (stock_nuevo < 0) {
                throw new Error('El ajuste no puede dejar el stock con valor negativo.');
            }

            // Actualizar producto
            await connection.query(
                'UPDATE producto SET stock = ? WHERE id_producto = ?',
                [stock_nuevo, id_producto]
            );

            // Registrar ajuste
            const [resultado] = await connection.query(
                `INSERT INTO ajustes_inventario 
                 (id_producto, tipo_ajuste, id_usuario, stock_nuevo, observaciones, id_sucursal)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [id_producto, tipo_ajuste, id_usuario, stock_nuevo, observaciones, id_sucursal]
            );

            await connection.commit();

            return {
                id_ajuste: resultado.insertId,
                stock_anterior: stock_actual,
                stock_nuevo: stock_nuevo,
                nombre_producto: nombre_producto
            };

        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    obtenerTodos: async (filtros = {}) => {
        try {
            const pool = db.getPool();

            let query = `
                SELECT 
                    ai.id_ajuste,
                    ai.id_producto,
                    p.nombre AS nombre_producto,
                    ai.tipo_ajuste,
                    ai.stock_nuevo,
                    ai.observaciones,
                    ai.fecha_creacion,
                    u.nombre_usuario,
                    s.nombre AS nombre_sucursal
                FROM ajustes_inventario ai
                INNER JOIN producto p ON ai.id_producto = p.id_producto
                INNER JOIN usuarios u ON ai.id_usuario = u.id_usuario
                INNER JOIN sucursal s ON ai.id_sucursal = s.id_sucursal
                WHERE 1=1
            `;

            const params = [];
            const whereClauses = [];

            if (filtros.id_producto) {
                whereClauses.push("ai.id_producto = ?");
                params.push(filtros.id_producto);
            }

            if (filtros.tipo_ajuste) {
                whereClauses.push("ai.tipo_ajuste = ?");
                params.push(filtros.tipo_ajuste);
            }

            if (filtros.id_sucursal) {
                whereClauses.push("ai.id_sucursal = ?");
                params.push(filtros.id_sucursal);
            }

            if (filtros.fecha_inicio) {
                whereClauses.push("DATE(ai.fecha_creacion) >= ?");
                params.push(filtros.fecha_inicio);
            }

            if (filtros.fecha_fin) {
                whereClauses.push("DATE(ai.fecha_creacion) <= ?");
                params.push(filtros.fecha_fin);
            }

            if (whereClauses.length > 0) {
                query += ` AND ${whereClauses.join(" AND ")}`;
            }

            query += ` ORDER BY ai.fecha_creacion DESC`;

            if (filtros.limit) {
                const limit = parseInt(filtros.limit) || 50;
                const offset = filtros.page ? (parseInt(filtros.page) - 1) * limit : 0;
                query += ` LIMIT ? OFFSET ?`;
                params.push(limit, offset);
            }

            const [ajustes] = await pool.query(query, params);

            return {
                ajustes,
                paginacion: {
                    total: ajustes.length,
                    pagina: filtros.page || 1,
                    porPagina: filtros.limit || 50
                }
            };
        } catch (error) {
            throw error;
        }
    },

    obtenerPorProducto: async (idProducto, filtros = {}) => {
        try {
            const pool = db.getPool();

            let query = `
                SELECT 
                    ai.id_ajuste,
                    ai.tipo_ajuste,
                    ai.stock_nuevo,
                    ai.observaciones,
                    ai.fecha_creacion,
                    p.nombre AS nombre_producto,
                    u.nombre_usuario,
                    s.nombre AS nombre_sucursal
                FROM ajustes_inventario ai
                INNER JOIN producto p ON ai.id_producto = p.id_producto
                INNER JOIN usuarios u ON ai.id_usuario = u.id_usuario
                INNER JOIN sucursal s ON ai.id_sucursal = s.id_sucursal
                WHERE ai.id_producto = ?
            `;

            const params = [idProducto];

            if (filtros.fecha_inicio) {
                query += ` AND DATE(ai.fecha_creacion) >= ?`;
                params.push(filtros.fecha_inicio);
            }

            if (filtros.fecha_fin) {
                query += ` AND DATE(ai.fecha_creacion) <= ?`;
                params.push(filtros.fecha_fin);
            }

            query += ` ORDER BY ai.fecha_creacion DESC`;

            const [ajustes] = await pool.query(query, params);
            return ajustes;
        } catch (error) {
            throw error;
        }
    },

    obtenerEstadisticas: async (filtros = {}) => {
        try {
            const pool = db.getPool();

            let query = `
                SELECT 
                    COUNT(*) AS total_ajustes, 
                    COUNT(DISTINCT id_producto) AS productos_afectados 
                FROM ajustes_inventario 
                WHERE 1=1
            `;
            const params = [];

            if (filtros.fecha_inicio) {
                query += ` AND DATE(fecha_creacion) >= ?`;
                params.push(filtros.fecha_inicio);
            }

            if (filtros.fecha_fin) {
                query += ` AND DATE(fecha_creacion) <= ?`;
                params.push(filtros.fecha_fin);
            }

            if (filtros.id_sucursal) {
                query += ` AND id_sucursal = ?`;
                params.push(filtros.id_sucursal);
            }

            const [stats] = await pool.query(query, params);
            return stats[0];
        } catch (error) {
            throw error;
        }
    }
};

module.exports = AjusteInventarioModel;