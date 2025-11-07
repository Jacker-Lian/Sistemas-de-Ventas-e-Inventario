const ProductoModel = require('../models/productoModel');
const productoModel = new ProductoModel();

const productoController = {};

// Obtener todos los productos
productoController.obtenerProductos = async (req, res) => {
  try {
    const productos = await productoModel.obtenerProductos();
    res.status(200).json(productos);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ message: 'Error interno al obtener productos' });
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

// Actualizar un producto
productoController.actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio_venta, stock, descripcion } = req.body;
  try {
    const productoExistente = await productoModel.obtenerProductoPorId(id);
    if (!productoExistente) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const productoActualizado = { nombre, precio_venta, stock, descripcion };
    const actualizado = await productoModel.actualizarProducto(id, productoActualizado);
    if (actualizado) {
      res.status(200).json({ message: 'Producto actualizado' });
    } else {
      res.status(400).json({ message: 'No se pudo actualizar el producto' });
    }
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).json({ message: 'Error interno al actualizar producto' });
  }
};

// Eliminar un producto
productoController.eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const productoEliminado = await productoModel.eliminarProducto(id);
    if (productoEliminado) {
      res.status(200).json({ message: 'Producto eliminado' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ message: 'Error interno al eliminar producto' });
  }
};

module.exports = productoController;
