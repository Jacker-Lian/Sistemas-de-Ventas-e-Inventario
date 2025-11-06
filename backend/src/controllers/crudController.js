import { ProductoModel } from "../models/crudModel.js"; //correccion del nombre

export const crudController = {
  listar: (req, res) => {
    ProductoModel.obtenerTodos((err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  obtener: (req, res) => {
    const { id } = req.params;
    ProductoModel.obtenerPorId(id, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
      res.json(results[0]);
    });
  },

  crear: (req, res) => {
    ProductoModel.crear(req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: result.insertId });
    });
  },

  actualizar: (req, res) => {
    const { id } = req.params;
    ProductoModel.actualizar(id, req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  },

  eliminar: (req, res) => {
    const { id } = req.params;
    ProductoModel.eliminar(id, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  },
};

module.exports = crudController;