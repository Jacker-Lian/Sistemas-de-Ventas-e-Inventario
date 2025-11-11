const alertasModel = require("../models/alertasModel");

class AlertasController {
  async listarAlertas(req, res) {
    try {
      const [rows] = await alertasModel.obtenerAlertas();
      res.json({ ok: true, data: rows });
    } catch (error) {
      res.status(500).json({ ok: false, error: error.message });
    }
  }

  async listarAlertasNoVistas(req, res) {
    try {
      const [rows] = await alertasModel.obtenerAlertasNoVistas();
      res.json({ ok: true, data: rows });
    } catch (error) {
      res.status(500).json({ ok: false, error: error.message });
    }
  }

  async marcarVisto(req, res) {
    try {
      const { id_alerta } = req.params;
      await alertasModel.marcarComoVisto(id_alerta);
      res.json({ ok: true, mensaje: "Alerta marcada como vista" });
    } catch (error) {
      res.status(500).json({ ok: false, error: error.message });
    }
  }
}

module.exports = AlertasController;
