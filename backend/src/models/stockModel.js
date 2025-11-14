const { getPool } = require("../config/database");
const pool = getPool();

exports.findStockProductos = async () => {
    try {
        const query = `
            SELECT 
                p.id_producto,
                p.nombre,
                p.stock,
                IFNULL(SUM(v.cantidad), 0) AS vendidos
            FROM producto p
            LEFT JOIN detalle_venta v ON v.id_producto = p.id_producto
            GROUP BY p.id_producto, p.nombre, p.stock
            ORDER BY p.nombre;
        `;

        const [rows] = await pool.query(query);
        return rows;

    } catch (error) {
        console.error("Error en findStockProductos:", error);
        throw error;
    }



 
};
