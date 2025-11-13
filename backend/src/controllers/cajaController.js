const cajaModel = require("../models/cajaModel");

const cajaController = {
  abrirCaja: async (req, res) => {
    try {
      const { id_usuario, id_sucursal } = req.body;

      if (!id_usuario)
        return res.status(400).json({ 
          success: false,
          message: "El id_usuario es obligatorio." 
        });

      const result = await cajaModel.abrirCaja(id_usuario, id_sucursal);
      res.status(201).json({ 
        success: true,
        data: result 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  },

  registrarMovimiento: async (req, res) => {
    try {
      const { id_caja, tipo, monto } = req.body;

      if (!id_caja || !tipo || monto == null)
        return res.status(400).json({
          success: false,
          message: "Debe enviar id_caja, tipo (INGRESO/EGRESO) y monto.",
        });

      await cajaModel.registrarMovimiento(id_caja, tipo, monto);
      res.status(200).json({ 
        success: true,
        message: "Movimiento registrado correctamente." 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  },

  cerrarCaja: async (req, res) => {
    try {
      const { id_caja } = req.params;
      await cajaModel.cerrarCaja(id_caja);
      res.status(200).json({ 
        success: true,
        message: "Caja cerrada correctamente." 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  },

  listarCajas: async (req, res) => {
    try {
      const { estado } = req.query;

      if (estado && estado !== "ABIERTA" && estado !== "CERRADA") {
        return res
          .status(400)
          .json({ 
            success: false,
            message: "El estado debe ser 'ABIERTA' o 'CERRADA'." 
          });
      }

      const cajas = await cajaModel.listarCajas(estado);
      res.status(200).json({
        success: true,
        data: cajas
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  },
  
  obtenerCajaPorId: async (req, res) => {
    try {
      const { id_caja } = req.params;

      if (!id_caja) {
        return res.status(400).json({ 
          success: false,
          message: "El id_caja es obligatorio en la URL." 
        });
      }

      const caja = await cajaModel.obtenerCajaAbiertaPorId(id_caja);

      if (caja) {
        res.status(200).json({
          success: true,
          data: caja
        });
      } else {
        res.status(404).json({ 
          success: false,
          message: "No se encontró una caja abierta y activa con ese ID." 
        });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  },
};

module.exports = cajaController;  
