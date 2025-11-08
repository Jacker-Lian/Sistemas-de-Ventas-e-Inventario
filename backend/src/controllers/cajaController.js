const CajaModel = require("../models/cajaModel");
const cajaModel = new CajaModel();

const cajaController = {
  abrirCaja: async (req, res) => {
    try {
      const { id_usuario, id_sucursal } = req.body;

      if (!id_usuario)
        return res.status(400).json({ message: "El id_usuario es obligatorio." });

      const idCaja = await cajaModel.abrirCaja({ id_usuario, id_sucursal });

      res.status(201).json({
        message: "Caja abierta exitosamente.",
        id_caja: idCaja,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  registrarMovimiento: async (req, res) => {
    try {
      const { id_caja, tipo, monto } = req.body;

      if (!id_caja || !tipo || monto == null)
        return res.status(400).json({
          message: "Debe enviar id_caja, tipo (INGRESO/EGRESO) y monto.",
        });

      await cajaModel.registrarMovimiento(id_caja, tipo, monto);
      res.status(200).json({ message: "Movimiento registrado correctamente." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  cerrarCaja: async (req, res) => {
    try {
      const { id_caja } = req.params;

      await cajaModel.cerrarCaja(id_caja);
      res.status(200).json({ message: "Caja cerrada correctamente." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  listarCajas: async (req, res) => {
    try {
      const { estado } = req.query;
      const cajas = await cajaModel.listarCajas(estado);
      res.status(200).json(cajas);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = cajaController;
