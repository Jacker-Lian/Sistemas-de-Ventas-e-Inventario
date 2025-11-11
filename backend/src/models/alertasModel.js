const db = require("../config/database");

const alertasModel = {

  obtenerAlertas() {
    const sql = `
      SELECT a.id_alerta, a.id_producto, a.tipo_alerta, a.stock_minimo,
             a.mensaje, a.visto, a.fecha_creacion, p.nombre AS nombre_producto
      FROM alertas_inventario a
      INNER JOIN producto p ON p.id_producto = a.id_producto
      ORDER BY a.fecha_creacion DESC;
    `;
    return db.promise().query(sql);
  },

  obtenerAlertasNoVistas() {
    const sql = `
      SELECT a.id_alerta, a.id_producto, a.tipo_alerta, a.stock_minimo,
             a.mensaje, a.visto, a.fecha_creacion, p.nombre AS nombre_producto
      FROM alertas_inventario a
      INNER JOIN producto p ON p.id_producto = a.id_producto
      WHERE a.visto = 0
      ORDER BY a.fecha_creacion DESC;
    `;
    return db.promise().query(sql);
  },

  marcarComoVisto(id_alerta) {
    const sql = `
      UPDATE alertas_inventario
      SET visto = 1, fecha_actualizacion = NOW()
      WHERE id_alerta = ?;
    `;
    return db.promise().query(sql, [id_alerta]);
  }
};

module.exports = alertasModel;
