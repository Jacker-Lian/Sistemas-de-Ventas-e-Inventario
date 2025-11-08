const getVentasTotales = async (req, res) => {
    try {
        // Obtener filtros de la query (asumiendo formato YYYY-MM-DD)
        const { fecha_inicio, fecha_fin, id_sucursal } = req.query;

        // **Consulta SQL para Reporte de Ventas Totales por Período**
        const sql = `
            SELECT 
                DATE(v.fecha_venta) AS fecha,
                SUM(v.total) AS total_ventas,
                COUNT(v.id_venta) AS num_ventas,
                s.nombre AS sucursal_nombre
            FROM ventas v
            JOIN sucursal s ON v.id_sucursal = s.id_sucursal
            WHERE v.estado_venta = 'COMPLETADA'
            AND v.fecha_venta BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
            ${id_sucursal ? 'AND v.id_sucursal = ?' : ''}
            GROUP BY DATE(v.fecha_venta), s.nombre
            ORDER BY fecha DESC;
        `;
        
        // Parámetros para la consulta
        const params = [fecha_inicio, fecha_fin];
        if (id_sucursal) {
            params.push(id_sucursal);
        }

        // Simulación: Reemplaza esta línea con la ejecución de tu consulta real.
        // const [results] = await pool.query(sql, params); 
        
        // Respuesta de simulación
        const results = [
             { fecha: '2025-11-07', total_ventas: 1500.50, num_ventas: 12, sucursal_nombre: 'CFP TACNA' }
        ];

        res.status(200).json({ 
            success: true, 
            data: results,
            message: "Reporte de ventas totales generado con éxito."
        });

    } catch (error) {
        console.error("Error al generar reporte de ventas:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error interno del servidor al obtener el reporte." 
        });
    }
};

const getInventarioStockBajo = async (req, res) => {
    try {
        // **Consulta SQL para Reporte de Inventario con Stock Bajo**
        // Nota: Asume que tienes una tabla/vista 'niveles_stock' o que el stock mínimo 
        // está definido de alguna manera. Aquí usamos un umbral fijo (ej. stock < 5).
        const sql = `
            SELECT 
                p.nombre AS producto,
                p.stock,
                c.nombre AS categoria,
                s.nombre AS sucursal
            FROM producto p
            JOIN categoria c ON p.id_categoria = c.id_categoria
            LEFT JOIN sucursal s ON p.id_sucursal = s.id_sucursal
            WHERE p.stock <= 5 -- UMbral de ejemplo para stock bajo
            AND p.estado = 1
            ORDER BY p.stock ASC;
        `;

        // Simulación: Reemplaza esta línea con la ejecución de tu consulta real.
        // const [results] = await pool.query(sql); 
        
        // Respuesta de simulación
        const results = [
             { producto: 'Papa Peruana', stock: 2, categoria: 'verduras', sucursal: 'CFP TACNA' },
             { producto: 'Tomate Italiano', stock: 5, categoria: 'verduras', sucursal: 'CFP TACNA' }
        ];

        res.status(200).json({ 
            success: true, 
            data: results,
            message: "Reporte de stock bajo generado con éxito."
        });

    } catch (error) {
        console.error("Error al generar reporte de stock bajo:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error interno del servidor al obtener el reporte." 
        });
    }
};

module.exports = {
    getVentasTotales,
    getInventarioStockBajo
};