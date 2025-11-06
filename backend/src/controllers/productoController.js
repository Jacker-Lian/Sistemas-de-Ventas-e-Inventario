const ProductoModel = require('../models/productoModel');

class ProductoController {
  static async getAll(req, res) {
    try {
      const productos = await ProductoModel.getAll();
      res.json(productos);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async getById(req, res) {
    try {
      const id = req.params.id;
      const producto = await ProductoModel.getById(id);
      if (producto) {
        res.json(producto);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async create(req, res) {
    try {
      const producto = req.body;
      if (!producto.nombre || !producto.precio_venta) {
        return res.status(400).json({ error: 'Nombre y precio son requeridos' });
      }
      const id = await ProductoModel.create(producto);
      res.status(201).json({ id, mensaje: 'Producto creado exitosamente' });
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async update(req, res) {
    try {
      const id = req.params.id;
      const producto = req.body;
      if (!producto.nombre || !producto.precio_venta) {
        return res.status(400).json({ error: 'Nombre y precio son requeridos' });
      }
      const actualizado = await ProductoModel.update(id, producto);
      if (actualizado) {
        res.json({ mensaje: 'Producto actualizado exitosamente' });
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async delete(req, res) {
    try {
      const id = req.params.id;
      const eliminado = await ProductoModel.delete(id);
      if (eliminado) {
        res.json({ mensaje: 'Producto eliminado exitosamente' });
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = ProductoController;