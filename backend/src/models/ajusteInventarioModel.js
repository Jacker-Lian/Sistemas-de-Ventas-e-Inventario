const db = require('../config/database'); // AJUSTA ESTA RUTA A TU ARCHIVO DE CONEXIÓN REAL

const AjusteInventarioModel = {
    // Crear un nuevo ajuste de inventario
    //agregue el pool de base de dato para que no este conectandose a cada rato lo use en las 3 funciones
    crear: async (datos) => {
        const {
            id_producto,
            cantidad_ajustada, // Viene como magnitud (valor absoluto)
            tipo_ajuste,      // 'AUMENTO' o 'DISMINUCION'
            id_usuario,
            observaciones,
            id_sucursal       
        } = datos;

        let connection;
        try {
            const pool = db.getPool()
            const { id_producto, tipo_ajuste, id_usuario, stock_nuevo, observaciones } = datos;
            const query = `
                INSERT INTO ajustes_inventario 
                (id_producto, tipo_ajuste, id_usuario, stock_nuevo, observaciones)
                VALUES (?, ?, ?, ?, ?)
            `;
            const [resultado] = await pool.query(query, [
                id_producto, 
                tipo_ajuste, 
                id_usuario, 
                stock_nuevo, 
                observaciones
            ]);
            return resultado;
        } catch (error) {
            // ROLLBACK: Si algo falla, deshace todos los cambios
            if (connection) await connection.rollback(); 
            throw error; // Propaga el error al Controlador
        } finally {
            if (connection) connection.release(); // Libera la conexión
        }
    },

    // Obtener todos los ajustes de inventario
    obtenerTodos: async (filtros = {}) => {
        try {
            const pool = db.getPool();
            let query = `
                SELECT 
                    ai.id_ajuste,
                    ai.id_producto,
                    ai.tipo_ajuste,
                    ai.stock_nuevo,
                    ai.observaciones,
                    ai.fecha_creacion,
                    p.nombre as nombre_producto, 
                    u.nombre_usuario as nombre_usuario
                FROM ajustes_inventario ai
                INNER JOIN producto p ON ai.id_producto = p.id_producto
                INNER JOIN usuarios u ON ai.id_usuario = u.id_usuario
            `;
            //filtros
            const condiciones = [];
            const valores = [];

            if(filtros.nombre_usuario){
                condiciones.push("u.nombre_usuario LIKE?");
                valores.push(`%${filtros.nombre_usuario}%`);
            }
            
             if(filtros.nombre_producto){
                condiciones.push("p.nombre LIKE?");
                valores.push(`%${filtros.nombre_producto}%`);
            }
            if(filtros.fecha_inicio){
                condiciones.push("DATE(ai.fecha_creacion) >= ?");
                valores.push(filtros.fecha_inicio)
            }
            //si es aumento o disminucion
            if(filtros.tipo_ajuste){
                condiciones.push("ai.tipo_ajuste = ?");
                valores.push(filtros.tipo_ajuste);
            }
            if(condiciones.length > 0){
                query += " WHERE " + condiciones.join(" AND ");
            }

            query += " ORDER BY ai.fecha_creacion DESC"
            
            const [ajustes] = await pool.query(query, valores);
            return ajustes;
        } catch (error) {
            throw error;
        }
    },

    // 3. Obtener ajustes por producto (GET /api/inventario/ajustes-producto/:idProducto)
    obtenerPorProducto: async (idProducto) => {
        try {
            const pool = db.getPool();
            const query = `
                SELECT 
                    ai.id_ajuste,
                    ai.id_producto,
                    ai.tipo_ajuste,
                    ai.stock_nuevo,
                    ai.observaciones,
                    ai.fecha_creacion,
                    p.nombre as nombre_producto, 
                    u.nombre_usuario as nombre_usuario
                FROM ajustes_inventario ai
                INNER JOIN producto p ON ai.id_producto = p.id_producto
                INNER JOIN usuarios u ON ai.id_usuario = u.id_usuario
                INNER JOIN sucursal s ON ai.id_sucursal = s.id_sucursal
                WHERE ai.id_producto = ?
                ORDER BY ai.fecha_creacion DESC
            `;
            const [ajustes] = await pool.query(query, [idProducto]);
            return ajustes;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = AjusteInventarioModel;