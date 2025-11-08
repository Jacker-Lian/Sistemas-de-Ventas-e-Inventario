const ProductoModel = require('../models/productoModel');
const productoModel = new ProductoModel();

const productoController = {};

// Obtener todos los productos o buscar según action
productoController.obtenerProductos = async (req, res) => {
  const { action, query } = req.query;
  if (action === 'search') {
    if (!query || !query.trim()) {
      return res.status(400).json({ message: 'Parámetro de búsqueda requerido' });
    }
    try {
      const productos = await productoModel.buscarProductos(query.trim());
      res.status(200).json(productos);
    } catch (err) {
      console.error('Error al buscar productos:', err);
      res.status(500).json({ message: 'Error interno al buscar productos' });
    }
  } else {
    try {
      const productos = await productoModel.obtenerProductos();
      res.status(200).json(productos);
    } catch (err) {
      console.error('Error al obtener productos:', err);
      res.status(500).json({ message: 'Error interno al obtener productos' });
    }
  }
};

// Desactivar producto (marcar como inactivo)
productoController.desactivarProducto = async (req, res) => {
  const { id } = req.body;
  try {
    const productoExistente = await productoModel.obtenerProductoPorId(id);
    if (!productoExistente) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const desactivado = await productoModel.desactivarProducto(id);
    if (desactivado) {
      res.status(200).json({ message: 'Producto marcado como inactivo' });
    } else {
      res.status(400).json({ message: 'No se pudo desactivar el producto' });
    }
  } catch (err) {
    console.error('Error al desactivar producto:', err);
    res.status(500).json({ message: 'Error interno al desactivar producto' });
  }
};

// Obtener un producto por su ID
productoController.obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await productoModel.obtenerProductoPorId(id);
    if (producto) {
      res.status(200).json(producto);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (err) {
    console.error('Error al obtener producto por ID:', err);
    res.status(500).json({ message: 'Error interno al obtener producto' });
  }
};

// Crear un nuevo producto
productoController.crearProducto = async (req, res) => {
  const { nombre, precio_venta, stock, descripcion } = req.body;
  try {
    const nuevoProducto = { nombre, precio_venta, stock, descripcion };
    const productoId = await productoModel.crearProducto(nuevoProducto);
    res.status(201).json({ message: 'Producto creado', id: productoId });
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ message: 'Error interno al crear producto' });
  }
};

// Manejar operaciones POST (crear, actualizar, desactivar)
productoController.manejarProducto = async (req, res) => {
  const { action } = req.query;

  if (action === 'update') {
    // Actualizar producto
    const { id, nombre, precio_venta, stock } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'ID requerido para actualizar' });
    }
    try {
      const productoExistente = await productoModel.obtenerProductoPorId(id);
      if (!productoExistente) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      const productoActualizado = { nombre, precio_venta, stock };
      const actualizado = await productoModel.actualizarProducto(id, productoActualizado);
      if (actualizado) {
        res.status(200).json({ message: 'Producto actualizado correctamente' });
      } else {
        res.status(400).json({ message: 'No se pudo actualizar el producto' });
      }
    } catch (err) {
      console.error('Error al actualizar producto:', err);
      res.status(500).json({ message: 'Error interno al actualizar producto' });
    }
  } else if (action === 'deactivate') {
    // Desactivar producto
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'ID requerido para desactivar' });
    }
    try {
      const productoExistente = await productoModel.obtenerProductoPorId(id);
      if (!productoExistente) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      const desactivado = await productoModel.desactivarProducto(id);
      if (desactivado) {
        res.status(200).json({ message: 'Producto marcado como inactivo' });
      } else {
        res.status(400).json({ message: 'No se pudo desactivar el producto' });
      }
    } catch (err) {
      console.error('Error al desactivar producto:', err);
      res.status(500).json({ message: 'Error interno al desactivar producto' });
    }
  } else {
    // Crear producto (sin action)
    const { nombre, precio_venta, stock, descripcion } = req.body;
    try {
      const nuevoProducto = { nombre, precio_venta, stock, descripcion };
      const productoId = await productoModel.crearProducto(nuevoProducto);
      res.status(201).json({ message: 'Producto creado', id: productoId });
    } catch (err) {
      console.error('Error al crear producto:', err);
      res.status(500).json({ message: 'Error interno al crear producto' });
    }
  }
};



module.exports = productoController;
