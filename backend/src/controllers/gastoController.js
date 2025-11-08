const gastoModel = require('../models/gastoModel.js');

/**
Obtener todos los gastos en la base de datos
*
Ruta: GET /api/gastos
@param {Object} req - Request (petición del cliente)
@param {Object} res - Response (respuesta al cliente)
**/
const getGastos = async (req, res) => {
  try {
    // habilitar parametros de paginacion por url = ?page=2&limit=10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const { gastos, totalGastos, totalPaginas, paginaActual, error } =
      await gastoModel.obtenerGastos({ page, limit });

    if (error) {
      console.error("Error en getGastos:", error);
      return res.status(500).json({
        success: false,
        message: "Error no se pudieron obtener los gastos."
      });
    }

    res.status(200).json({
      success: true,
      message: "Éxito al obtener gastos",
      data: gastos,
      totalGastos,
      totalPaginas,
      paginaActual
    });
  } catch (error) {
    console.error("Error inesperado en getGastos:", error);
    res.status(500).json({
      success: false,
      message: "Error inesperado al obtener los gastos."
    });
  }
};

const getGastoById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (!id) return res.status(400).json({ message: "ID inválido" });

  try {
    const gasto = await gastoModel.obtenerGasto(id);

    if (gasto?.error) {
      console.error("Error en getGastoById:", gasto.error);
      return res.status(500).json({ message: "Error al obtener gasto" });
    }

    if (!gasto)
      return res.status(404).json({ message: "Gasto no encontrado" });

    req.gasto = gasto;
    next();
  } catch (error) {
    console.error("Error inesperado en getGastoById:", error);
    res.status(500).json({ message: "Error inesperado al obtener gasto"});
  }
};

const getOneGasto = (req, res) => {
  res.status(200).json({
    success: true,
    data: req.gasto
  });
};

const putGasto = async (req, res) => {
  const { descripcion, monto, tipo_gasto, metodo_pago } = req.body;
  try {
    const updated = await gastoModel.actualizarGasto(req.gasto.id_gasto, {
      descripcion,
      monto,
      tipo_gasto,
      metodo_pago,
    });

    if (updated?.error) {
      console.error("Error en putGasto:", updated.error);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar gasto"
      });
    }

    res.status(200).json({
      success: true,
      message: "Gasto actualizado",
      data: updated
    });
  } catch (error) {
    console.error("Error inesperado en putGasto:", error);
    res.status(500).json({
      success: false,
      message: "Error inesperado al actualizar gasto"
    });
  }
};

const patchGasto = async (req, res) => {
  try {
    const result = await gastoModel.eliminarGasto(req.gasto.id_gasto);

    if (result?.error) {
      console.error("Error en patchGasto:", result.error);
      return res.status(500).json({
        success: false,
        message: "Error al eliminar gasto"
      });
    }

    res.status(200).json({
      success: true,
      message: "Gasto eliminado"
    });
  } catch (error) {
    console.error("Error inesperado en patchGasto:", error);
    res.status(500).json({
      success: false,
      message: "Error inesperado al eliminar gasto"
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
 *   "monto": 220.50,
 *   "tipo_gasto": "SERVICIOS",
 *   "metodo_pago": "EFECTIVO",
 *   "id_usuario": 1
 * }
*/
const postGasto = async (req, res) => {
  try {
    const { descripcion, monto, tipo_gasto, metodo_pago, id_usuario } = req.body;
    const id = await gastoModel.crearGasto({
      descripcion,
      monto,
      tipo_gasto,
      metodo_pago,
      id_usuario
    });

    if (id?.error) {
      console.error("Error en postGasto:", id.error);
      return res.status(500).json({
        success: false,
        message: "Error al crear gasto"
      });
    }

    res.status(201).json({
      success: true,
      message: "Gasto creado correctamente",
      id,
    });

  } catch (error) {
    console.error("Error inesperado en postGasto:", error);
    res.status(500).json({
      success: false,
      message: "Error inesperado al crear gasto"
    });
  }
};


const getTiposGasto = async (req, res) => {
  try {
    const tipos = await gastoModel.obtenerTiposGasto();

    if (tipos?.error) {
      console.error("Error en getTiposGasto:", tipos.error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener tipos de gasto"
      });
    }

    res.status(200).json({
      success: true,
      data: tipos
    });

  } catch (error) {
    console.error("Error inesperado en getTiposGasto:", error);
    res.status(500).json({
      success: false,
      message: "Error inesperado al obtener tipos de gasto"
    });
  }
};

/**
Crear un nuevo tipo de gasto
*/
const postTipoGasto = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const id = await gastoModel.crearTipoGasto({ nombre, descripcion });

    if (id?.error) {
      console.error("Error en postTipoGasto:", id.error);
      return res.status(500).json({
        success: false,
        message: "Error al crear tipo de gasto"
      });
    }

    res.status(201).json({
      success: true,
      message: "Tipo de gasto creado correctamente",
      id,
    });

  } catch (error) {
    console.error("Error inesperado en postTipoGasto:", error);
    res.status(500).json({
      success: false,
      message: "Error inesperado al crear tipo de gasto"
    });
  }
};


module.exports = {
  getGastos,
  getGastoById,
  getOneGasto,
  putGasto,
  patchGasto,
  postGasto,
  getTiposGasto,
  postTipoGasto
};
