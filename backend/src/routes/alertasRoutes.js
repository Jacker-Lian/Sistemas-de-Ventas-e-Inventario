const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/alertas', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.id_alerta,
        p.nombre AS producto,
        a.tipo_alerta,
        a.stock_minimo,
        p.stock AS stock_actual,
        a.mensaje,
        a.visto,
        a.fecha_creacion
      FROM alertas_inventario a
      INNER JOIN producto p ON a.id_producto = p.id_producto
      ORDER BY a.fecha_creacion DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("ERROR GET /alertas:", error);
    res.status(500).json({ error: "Error al obtener alertas" });
  }
});

module.exports = router;
