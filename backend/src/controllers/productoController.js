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
      res.status(200).json({
        productos,
        usuario: req.usuario // Incluir datos del usuario autenticado
      });
    } catch (err) {
      console.error('Error al buscar productos:', err);
      res.status(500).json({ message: 'Error interno al buscar productos' });
    }
  } else {
    try {
      const productos = await productoModel.obtenerProductos();
      res.status(200).json({
        productos,
        usuario: req.usuario // Incluir datos del usuario autenticado
      });
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

// Obtener productos por categoría
productoController.obtenerProductosPorCategoria = async (req, res) => {
  const { id_categoria } = req.params;
  try {
    const productos = await productoModel.obtenerProductosPorCategoria(id_categoria);
    res.status(200).json(productos);
  } catch (err) {
    console.error('Error al obtener productos por categoría:', err);
    res.status(500).json({ message: 'Error interno al obtener productos por categoría' });
  }
};

// Crear un nuevo producto
productoController.crearProducto = async (req, res) => {
  const { nombre, precio_venta, precio_compra, stock, descripcion, id_categoria, id_proveedor } = req.body;
  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ message: 'Nombre requerido' });
  }
  if (precio_venta === undefined || precio_venta < 0 || isNaN(parseFloat(precio_venta))) {
    return res.status(400).json({ message: 'Precio de venta debe ser un número positivo' });
  }
  if (precio_compra === undefined || precio_compra < 0 || isNaN(parseFloat(precio_compra))) {
    return res.status(400).json({ message: 'Precio de compra debe ser un número positivo' });
  }
  if (stock === undefined || stock < 0 || !Number.isInteger(Number(stock))) {
    return res.status(400).json({ message: 'Stock debe ser un entero no negativo' });
  }
  if (!id_categoria || !Number.isInteger(Number(id_categoria))) {
    return res.status(400).json({ message: 'ID de categoría requerido y debe ser un entero' });
  }
  if (!id_proveedor || !Number.isInteger(Number(id_proveedor))) {
    return res.status(400).json({ message: 'ID de proveedor requerido y debe ser un entero' });
  }
  try {
    const nuevoProducto = {
      nombre: nombre.trim(),
      precio_venta: parseFloat(precio_venta),
      precio_compra: parseFloat(precio_compra),
      stock: parseInt(stock),
      descripcion: descripcion && descripcion.trim()? descripcion.trim() : null,
      id_categoria: parseInt(id_categoria),
      id_proveedor: parseInt(id_proveedor)
    };
    const productoId = await productoModel.crearProducto(nuevoProducto);
    res.status(201).json({ message: 'Producto creado', id: productoId });
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ message: 'Error interno al crear producto' });
  }
};

// Actualizar producto
productoController.actualizarProducto = async (req, res) => {
  const { id, nombre, precio_venta, precio_compra, stock, descripcion, id_categoria, id_proveedor } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'ID requerido para actualizar' });
  }
  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ message: 'Nombre requerido' });
  }
  if (precio_venta === undefined || precio_venta < 0 || isNaN(parseFloat(precio_venta))) {
    return res.status(400).json({ message: 'Precio de venta debe ser un número positivo' });
  }
  if (precio_compra === undefined || precio_compra < 0 || isNaN(parseFloat(precio_compra))) {
    return res.status(400).json({ message: 'Precio de compra debe ser un número positivo' });
  }
  if (stock === undefined || stock < 0 || !Number.isInteger(Number(stock))) {
    return res.status(400).json({ message: 'Stock debe ser un entero no negativo' });
  }
  if (!id_categoria || !Number.isInteger(Number(id_categoria))) {
    return res.status(400).json({ message: 'ID de categoría requerido y debe ser un entero' });
  }
  if (!id_proveedor || !Number.isInteger(Number(id_proveedor))) {
    return res.status(400).json({ message: 'ID de proveedor requerido y debe ser un entero' });
  }
  try {
    const productoExistente = await productoModel.obtenerProductoPorId(id);
    if (!productoExistente) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const productoActualizado = {
      nombre: nombre.trim(),
      precio_venta: parseFloat(precio_venta),
      precio_compra: parseFloat(precio_compra),
      stock: parseInt(stock),
      descripcion: descripcion && descripcion.trim() ? descripcion.trim() : null,
      id_categoria: parseInt(id_categoria),
      id_proveedor: parseInt(id_proveedor)
    };
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
};



module.exports = productoController;
