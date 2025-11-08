
const pool = require('../config/db'); 

// Reporte de ventas totales por período
const getVentasTotalesModel = async ({ fecha_inicio, fecha_fin, id_sucursal }) => {
    // Armamos el SQL aquí (en el model, no en el controller)
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

    const params = [fecha_inicio, fecha_fin];
    if (id_sucursal) params.push(id_sucursal);

    const [rows] = await pool.query(sql, params);
    return rows;
};

// Reporte de inventario con stock bajo
const getInventarioStockBajoModel = async () => {
    const sql = `
        SELECT 
            p.nombre AS producto,
            p.stock,
            c.nombre AS categoria,
            s.nombre AS sucursal
        FROM producto p
        JOIN categoria c ON p.id_categoria = c.id_categoria
        LEFT JOIN sucursal s ON p.id_sucursal = s.id_sucursal
        WHERE p.stock <= 5
          AND p.estado = 1
        ORDER BY p.stock ASC;
    `;

    const [rows] = await pool.query(sql);
    return rows;
};

module.exports = {
    getVentasTotalesModel,
    getInventarioStockBajoModel,
};
