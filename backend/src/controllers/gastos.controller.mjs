import gastoModel from "../models/gastoModel.mjs";

/**
Obtener todos los gastos en la base de datos
*
Ruta: GET /api/gastos
@param {Object} req - Request (petición del cliente)
@param {Object} res - Response (respuesta al cliente)
**/
export const getGastos = async (req, res) => {
  try {
    // habilitar parametros de paginacion por url = ?page=2&limit=10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { gastos, totalGastos, totalPaginas, paginaActual } = await gastoModel.obtenerGastos({ page, limit });

    res.status(200).json({
      success: true,
      message: "Éxito al obtener gastos",
      data: gastos,
      totalGastos,
      totalPaginas,
      paginaActual
    });
  } catch (error) {
    console.error("Error en getGastos:", error);
    res.status(500).json({
      success: false,
      message: "Error no se pudieron obtener los gastos."
    });
  }
};

export const getGastoById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (!id) return res.status(400).json({ message: "ID inválido" });

  try {
    const gasto = await gastoModel.obtenerGasto(id);
    if (!gasto) return res.status(404).json({ message: "Gasto no encontrado" });
    req.gasto = gasto;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error al obtener gasto", error: error.message });
  }
};

export const getOneGasto = (req, res) => {
  res.status(200).json({ success: true, data: req.gasto });
};

export const putGasto = async (req, res) => {
  const { descripcion, monto, tipo_gasto, metodo_pago } = req.body;
  try {
    const updated = await gastoModel.actualizarGasto(req.gasto.id_gasto, {
      descripcion,
      monto,
      tipo_gasto,
      metodo_pago,
    });
    res.status(200).json({ success: true, message: "Gasto actualizado", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar gasto", error: error.message });
  }
};

export const patchGasto = async (req, res) => {
  try {
    await gastoModel.eliminarGasto(req.gasto.id_gasto);
    res.status(200).json({ success: true, message: "Gasto eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar gasto", error: error.message });
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
 *   "monto": 220.50,
 *   "tipo_gasto": "SERVICIOS",
 *   "metodo_pago": "EFECTIVO",
 *   "id_usuario": 1
 * }
*/
export const createGasto = async (req, res) => {
  try {
    const { descripcion, monto, tipo_gasto, metodo_pago, id_usuario } = req.body;
    const id = await gastoModel.crearGasto({ descripcion, monto, tipo_gasto, metodo_pago, id_usuario });

    res.status(201).json({
      success: true,
      message: "Gasto creado correctamente",
      id,
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