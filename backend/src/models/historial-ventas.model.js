// src/models/historial-ventas.model.js
const database = require("../config/database");

class HistorialVentasModel {
  constructor() {
    this.table = "ventas";
  }

  /**
   * Obtener historial de ventas con filtros dinámicos y paginación.
   * @param {object} filters - Objeto con los filtros.
   * @param {object} pagination - Objeto con { page, limit }.
   */
  async getHistory(filters = {}, pagination = {}) {
    const pool = database.getPool();

    // --- 1. Preparar Paginación ---
    const page = parseInt(pagination.page, 10) || 1;
    const limit = parseInt(pagination.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // --- 2. Preparar Filtros ---
    const {
      fecha_inicio,
      fecha_fin,
      monto_min,
      monto_max,
      id_usuario,
      estado_venta,
    } = filters;

    const queryParams = [];
    let whereClauses = ["estado = 1"]; // Asumimos que 1 es 'activo' para el registro

    if (fecha_inicio) {
      whereClauses.push("DATE(fecha_venta) >= ?");
      queryParams.push(fecha_inicio);
    }
    if (fecha_fin) {
      whereClauses.push("DATE(fecha_venta) <= ?");
      queryParams.push(fecha_fin);
    }
    if (monto_min) {
      whereClauses.push("total >= ?");
      queryParams.push(monto_min);
    }
    if (monto_max) {
      whereClauses.push("total <= ?");
      queryParams.push(monto_max);
    }
    if (id_usuario) {
      whereClauses.push("id_usuario = ?");
      queryParams.push(id_usuario);
    }
    if (estado_venta) {
      // Validamos que sea uno de los estados permitidos
      const estadosValidos = ["COMPLETADA", "PENDIENTE", "CANCELADA"];
      if (estadosValidos.includes(estado_venta.toUpperCase())) {
        whereClauses.push("estado_venta = ?");
        queryParams.push(estado_venta.toUpperCase());
      }
    }

    const whereString = `WHERE ${whereClauses.join(" AND ")}`;

    try {
      // --- 3. Consulta para obtener el total de items (para paginación) ---
      const countQuery = `SELECT COUNT(*) AS totalItems FROM ${this.table} ${whereString}`;
      const [countRows] = await pool.query(countQuery, queryParams);
      const totalItems = countRows[0].totalItems;
      const totalPages = Math.ceil(totalItems / limit);

      if (totalItems === 0) {
        return {
          data: [],
          pagination: {
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
            itemsPerPage: limit,
          },
        };
      }

      // --- 4. Consulta para obtener los datos paginados ---
      const dataQuery = `
        SELECT * FROM ${this.table} 
        ${whereString} 
        ORDER BY fecha_venta DESC 
        LIMIT ? OFFSET ?
      `;
      // Añadimos los parámetros de paginación al final
      const dataParams = [...queryParams, limit, offset];
      
      const [rows] = await pool.query(dataQuery, dataParams);

      // --- 5. Devolver resultado estructurado ---
      return {
        data: rows,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      throw new Error(
        "Error al obtener el historial de ventas: " + error.message
      );
    }
  }

  /**
   * Obtiene una venta específica y su detalle (productos).
   */
  async getDetailById(id_venta) {
    const pool = database.getPool();
    try {
      // 1. Obtener la venta principal
      const [ventaRows] = await pool.query(
        `SELECT * FROM ${this.table} WHERE id_venta = ? AND estado = 1`,
        [id_venta]
      );
      if (ventaRows.length === 0) {
        return null; // No se encontró la venta
      }
      const venta = ventaRows[0];

      // 2. Obtener el detalle de la venta (idealmente con el nombre del producto)
      const [detalleRows] = await pool.query(
        `SELECT 
          dv.*, 
          p.nombre AS nombre_producto 
         FROM detalle_venta AS dv
         JOIN producto AS p ON dv.id_producto = p.id_producto
         WHERE dv.id_venta = ?`,
        [id_venta]
      );

      // 3. Combinar resultados
      venta.detalles = detalleRows;
      return venta;
    } catch (error) {
      throw new Error("Error al obtener el detalle de la venta: " + error.message);
    }
  }
}

module.exports = HistorialVentasModel;