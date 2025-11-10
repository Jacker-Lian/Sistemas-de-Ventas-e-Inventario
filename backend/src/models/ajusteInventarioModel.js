const db = require('../config/database'); // AJUSTA ESTA RUTA A TU ARCHIVO DE CONEXIÓN REAL

const AjusteInventarioModel = {
    // 1. Ejecuta la transacción de ajuste (POST) - ¡CÓDIGO CORRECTO!
    crear: async (datos) => {
        const {
            id_producto,
            cantidad_ajustada, // Viene como magnitud (valor absoluto)
            tipo_ajuste,      
            id_usuario,
            observaciones,
            id_sucursal       
        } = datos;

        let connection;
        try {
            // ... (Toda la lógica de Transacción, Cálculo de Stock, y ROLLBACK está correcta) ...
            connection = await db.getConnection(); 
            await connection.beginTransaction();

            // 1. Obtener Stock Actual
            const [productRows] = await connection.query(
                'SELECT stock FROM producto WHERE id_producto = ?',
                [id_producto]
            );

            if (productRows.length === 0) {
                throw new Error('El producto no fue encontrado en la base de datos.');
            }

            const stock_actual = productRows[0].stock;
            const cantidad_neta = tipo_ajuste === 'AUMENTO' ? cantidad_ajustada : -cantidad_ajustada;
            const stock_nuevo = stock_actual + cantidad_neta;

            if (stock_nuevo < 0) {
                throw new Error('El ajuste no puede dejar el stock con valor negativo.');
            }
            
            // 3. ACTUALIZAR LA TABLA 'producto'
            await connection.query(
                'UPDATE producto SET stock = ? WHERE id_producto = ?',
                [stock_nuevo, id_producto]
            );

            // 4. REGISTRAR EL AJUSTE EN 'ajustes_inventario'
            const [resultado] = await connection.query(
                `INSERT INTO ajustes_inventario 
                 (id_producto, cantidad_ajustada, tipo_ajuste, id_usuario, stock_nuevo, observaciones, id_sucursal)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [id_producto, cantidad_ajustada, tipo_ajuste, id_usuario, stock_nuevo, observaciones, id_sucursal]
            );

            // 5. COMMIT
            await connection.commit();
            
            return { 
                id_ajuste: resultado.insertId,
                stock_nuevo 
            };

        } catch (error) {
            if (connection) await connection.rollback(); 
            throw error; 
        } finally {
            if (connection) connection.release(); 
        }
    },

    // 2. Obtener todos los ajustes de inventario (GET /historial) - ¡CÓDIGO CORRECTO!
    obtenerTodos: async () => {
        try {
            const query = `
                SELECT 
                    ai.id_ajuste, ai.cantidad_ajustada, ai.tipo_ajuste, ai.stock_nuevo, ai.observaciones, ai.fecha_creacion,
                    p.nombre as nombre_producto, u.nombre_usuario, s.nombre as nombre_sucursal
                FROM ajustes_inventario ai
                INNER JOIN producto p ON ai.id_producto = p.id_producto
                INNER JOIN usuarios u ON ai.id_usuario = u.id_usuario
                INNER JOIN sucursal s ON ai.id_sucursal = s.id_sucursal
                ORDER BY ai.fecha_creacion DESC
            `;
            const [ajustes] = await db.query(query);
            return ajustes;
        } catch (error) {
            throw error;
        }
    },

    // 3. Obtener ajustes por producto (GET /ajustes-producto/:idProducto) - ¡CÓDIGO CORRECTO!
    obtenerPorProducto: async (idProducto) => {
        try {
            const query = `
                SELECT 
                    ai.id_ajuste, ai.cantidad_ajustada, ai.tipo_ajuste, ai.stock_nuevo, ai.observaciones, ai.fecha_creacion,
                    p.nombre as nombre_producto, u.nombre_usuario, s.nombre as nombre_sucursal
                FROM ajustes_inventario ai
                INNER JOIN producto p ON ai.id_producto = p.id_producto
                INNER JOIN usuarios u ON ai.id_usuario = u.id_usuario
                INNER JOIN sucursal s ON ai.id_sucursal = s.id_sucursal
                WHERE ai.id_producto = ?
                ORDER BY ai.fecha_creacion DESC
            `;
            const [ajustes] = await db.query(query, [idProducto]);
            return ajustes;
        } catch (error) {
            throw error;
        }
    },
    
    // 4. NUEVA FUNCIÓN: Obtener la lista de productos (GET /productos) - ¡NECESARIO PARA EL FRONTEND!
    obtenerListaProductos: async () => {
        try {
            const query = 'SELECT id_producto, nombre, stock FROM producto WHERE estado = 1 ORDER BY nombre ASC'; 
            const [productos] = await db.query(query);
            return productos;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = AjusteInventarioModel;