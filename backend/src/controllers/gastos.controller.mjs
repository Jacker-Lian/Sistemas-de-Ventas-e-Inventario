import pool from "../config/database.mjs";

/**
Obtener todos los gastos en la base de datos
*
Ruta: GET /api/gastos
@param {Object} req - Request (petición del cliente)
@param {Object} res - Response (respuesta al cliente)
**/
export const getGastos = async (req, res) => {
  try {
    const [gastos] = await pool.query("SELECT * FROM gastos ORDER BY fecha_creacion DESC");
    res.status(200).json({
      success: true,
      message: "Éxito al obtener gastos",
      total: gastos.length,
      data: gastos,
    });
  } catch (error) {
    console.error("Error al obtener gastos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener gastos",
      error: error.message,
    });
  }
};

/**
Crear un nuevo gasto en la base de datos
*
Ruta: POST /api/gastos
@example
 * // Ejemplo JSON:
 * {
 *   "descripcion": "Servicio para la limpieza del local",
 *   "monto": 100.00,
 *   "tipo_gasto": "SERVICIOS",
 *   "metodo_pago": "EFECTIVO",
 *   "id_usuario": 1
 * }
*/
export const createGasto = async (req, res) => {
  try {
    const { descripcion, monto, tipo_gasto, metodo_pago, id_usuario } = req.body;

    const [crear] = await pool.query(
      `INSERT INTO gastos (descripcion, monto, tipo_gasto, metodo_pago, id_usuario)
       VALUES (?, ?, ?, ?, ?)`,
      [descripcion, monto, tipo_gasto, metodo_pago, id_usuario]
    );

    res.status(201).json({
      success: true,
      message: "Gasto creado correctamente",
      id: crear.insertId,
    });
  } catch (error) {
    console.error("Error al crear gasto:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear gasto",
      error: error.message,
    });
  }
};
