// C:\gith\Sistemas-de-Ventas-e-Inventario\backend\src\models\alertasModel.js

const database = require('../config/database');
const ProductoModel = require('./productoModel');

class AlertasModel {
    constructor() {
        console.log("DEBUG A.1: Instancia de AlertasModel creada.");
        this.productoModel = new ProductoModel();
    }

    // Método para obtener todas las alertas activas y no vistas
    async obtenerAlertasNoVistas() {
        console.log("DEBUG A.2: AlertasModel.obtenerAlertasNoVistas() ejecutado.");
        try {
            const conn = database.getPool();
            // Consulta para obtener alertas no vistas (visto = 0)
            const [rows] = await conn.query(
                `SELECT 
                    a.id_alerta, 
                    a.tipo_alerta, 
                    a.mensaje, 
                    a.fecha_creacion,
                    p.nombre AS nombre_producto
                FROM alertas_inventario a
                JOIN producto p ON a.id_producto = p.id_producto
                WHERE a.visto = 0
                ORDER BY a.fecha_creacion DESC`
            );
            console.log(`DEBUG A.3: Se encontraron ${rows.length} alertas no vistas.`);
            return rows;
        } catch (error) {
            console.error("ERROR A.4: Fallo al obtener alertas:", error.message);
            throw error;
        }
    }

    // Método principal para revisar el stock y generar nuevas alertas
    async generarAlertasDeStock() {
        console.log("DEBUG A.5: Iniciando proceso de generación de alertas...");
        const conn = database.getPool();
        const alertsToInsert = [];

        try {

           const productos = await this.productoModel.obtenerProductosParaAlertas();

            for (const prod of productos) {
                const STOCK_MINIMO = 10; // Valor de alerta de ejemplo
                const tipo_alerta = 'STOCK_BAJO';

                // Si el stock está bajo (menor o igual al mínimo)
                if (prod.stock <= STOCK_MINIMO) {
                    const mensaje = `¡Alerta! El stock de ${prod.nombre} es de ${prod.stock} y está bajo o igual al mínimo de ${STOCK_MINIMO}.`;

                    // 2. Verificar si ya existe una alerta activa para este producto y tipo
                    const [existingAlerts] = await conn.query(
                        `SELECT id_alerta FROM alertas_inventario 
                         WHERE id_producto = ? AND tipo_alerta = ? AND visto = 0`,
                        [prod.id_producto, tipo_alerta]
                    );

                    if (existingAlerts.length === 0) {
                        alertsToInsert.push([
                            prod.id_producto,
                            tipo_alerta,
                            STOCK_MINIMO,
                            mensaje
                        ]);
                    }
                }
            }

            // 3. Insertar las nuevas alertas
            if (alertsToInsert.length > 0) {
                const sql = `INSERT INTO alertas_inventario (id_producto, tipo_alerta, stock_minimo, mensaje) VALUES ?`;
                const [result] = await conn.query(sql, [alertsToInsert]);
                console.log(`DEBUG A.6: Se insertaron ${result.affectedRows} nuevas alertas de STOCK_BAJO.`);
                return { success: true, count: result.affectedRows };
            }

            console.log("DEBUG A.7: No se generaron nuevas alertas.");
            return { success: true, count: 0 };

        } catch (error) {
            console.error("ERROR A.8: Fallo en la generación de alertas:", error.message);
            throw error;
        }
    }
}

module.exports = new AlertasModel();