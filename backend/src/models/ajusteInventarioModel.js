const db = require('../config/database'); // AJUSTA ESTA RUTA A TU ARCHIVO DE CONEXIÓN REAL

const AjusteInventarioModel = {
    // 1. Ejecuta la transacción de ajuste (POST)
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
        const pool = db.getPool();
        try {
            // INICIO DE LA TRANSACCIÓN
            connection = await pool.getConnection();
            await connection.beginTransaction();

            // 1. Obtener Stock Actual y Validar Producto
            // Consulta la tabla producto para obtener el stock actual
            const [productRows] = await connection.query(
                'SELECT stock FROM producto WHERE id_producto = ?',
                [id_producto]
            );

            if (productRows.length === 0) {
                throw new Error('El producto no fue encontrado en la base de datos.');
            }

            const stock_actual = productRows[0].stock;

            // 2. Cálculo y Validación del Nuevo Stock
            // Definir la cantidad neta: positivo si AUMENTO, negativo si DISMINUCION
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

            // 5. COMMIT: Confirmar los dos pasos (UPDATE y INSERT)
            await connection.commit();
            
            return { 
                id_ajuste: resultado.insertId, // Retorna el ID generado
                stock_nuevo 
            };

        } catch (error) {
            // ROLLBACK: Si algo falla, deshace todos los cambios
            if (connection) await connection.rollback(); 
            throw error; // Propaga el error al Controlador
        } finally {
            if (connection) connection.release(); // Libera la conexión
        }
    },

    // 2. Obtener todos los ajustes de inventario (GET /api/inventario/historial)
    obtenerTodos: async (filtros = {}) => {
        try {
            const pool = db.getPool();
            
            
            // Query con JOINs a producto, usuarios y sucursal
            let consultaSQL = `
                SELECT 
                    ai.id_ajuste,
                    ai.id_producto,
                    ai.tipo_ajuste,
                    ai.id_usuario,
                    ai.stock_nuevo,
                    ai.observaciones,
                    ai.fecha_creacion,
                    p.nombre as nombre_producto, 
                    u.nombre_usuario as nombre_usuario
                FROM ajustes_inventario ai
                INNER JOIN producto p ON ai.id_producto = p.id_producto
                INNER JOIN usuarios u ON ai.id_usuario = u.id_usuario
            `;

            const condiciones = [];
            const valores = [];

            if(filtros.nombre_usuario){
                condiciones.push("u.nombre_usuario LIKE ?");
                valores.push(`%${filtros.nombre_usuario}%`);
            }
            if(filtros.nombre_producto){
                condiciones.push("u.nombre LIKE ?");
                valores.push(`%${filtros.nombre_producto}%`);
            }
            if(filtros.fecha_inicio){
                condiciones.push("DATE(ai.fecha_creacion) >= ?");
                valores.push(filtros.fecha_fin)
            }
            if(filtros.tipo_fin){
                condiciones.push("DATE (ai.fecha_creacion) <= ?");
                valores.push(filtros.fecha_fin)
            }
            if(filtros.tipo_ajuste){
                condiciones.push("ai.tipo_ajuste = ?");
                valores.push(filtros.tipo_ajuste)
            }
            if(condiciones.length > 0){
                consultasSQL =+ " WHERE " + condiciones.join(" AND ");
            }
            
            
           consultaSQL += ` ORDER BY ai.fecha_creacion DESC `
            
            const [ajustes] = await pool.query(consultaSQL, valores);
            return ajustes;

        } catch (error) {
            console.error('error en obtenerTodos(AjusteInventarioModel): ', error)
            throw error;
        }
    
    },

    // 3. Obtener ajustes por producto (GET /api/inventario/ajustes-producto/:idProducto)
    obtenerPorProducto: async (idProducto) => {
        try {
            // Query con JOINs y filtro por id_producto
            const query = `
                SELECT 
                    ai.id_ajuste,
                    ai.cantidad_ajustada,
                    ai.tipo_ajuste,
                    ai.stock_nuevo,
                    ai.observaciones,
                    ai.fecha_creacion,
                    p.nombre as nombre_producto, 
                    u.nombre_usuario,
                    s.nombre as nombre_sucursal
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
    }
};

module.exports = AjusteInventarioModel;
