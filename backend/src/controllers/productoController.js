const ProductoModel = require('../models/productoModel');
const productoModel = new ProductoModel();

const productoController = {};

productoController.obtenerProductos = async (req, res) => {
  const { action, query } = req.query;
  try {
    let productos;
    if (action === 'search' && query && query.trim()) {
      productos = await productoModel.buscarProductos(query.trim());
    } else {
      productos = await productoModel.obtenerProductos();
    }
    res.status(200).json({ success: true, data: productos });
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ success: false, message: 'Error interno del servidor al obtener productos' });
  }
};

productoController.obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await productoModel.obtenerProductoPorId(id);
    if (producto) {
      res.status(200).json({ success: true, data: producto });
    } else {
      res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
  } catch (err) {
    console.error('Error al obtener producto por ID:', err);
    res.status(500).json({ success: false, message: 'Error interno del servidor al obtener producto' });
  }
};

productoController.obtenerProductosPorCategoria = async (req, res) => {
  const { id_categoria } = req.params;
  try {
    const productos = await productoModel.obtenerProductosPorCategoria(id_categoria);
    res.status(200).json({ success: true, data: productos });
  } catch (err) {
    console.error('Error al obtener productos por categoría:', err);
    res.status(500).json({ success: false, message: 'Error interno del servidor al obtener productos por categoría' });
  }
};

productoController.crearProducto = async (req, res) => {
  const { nombre, precio_venta, precio_compra, stock, descripcion, id_categoria, id_proveedor } = req.body;
  // Validaciones
  if (!nombre || !nombre.trim()) return res.status(400).json({ success: false, message: 'Nombre del producto requerido' });
  if (precio_venta === undefined || precio_venta < 0 || isNaN(parseFloat(precio_venta)))
    return res.status(400).json({ success: false, message: 'Precio de venta debe ser un número positivo' });
  if (precio_compra === undefined || precio_compra < 0 || isNaN(parseFloat(precio_compra)))
    return res.status(400).json({ success: false, message: 'Precio de compra debe ser un número positivo' });
  if (stock === undefined || stock < 0 || !Number.isInteger(Number(stock)))
    return res.status(400).json({ success: false, message: 'Stock debe ser un entero no negativo' });
  if (!id_categoria || !Number.isInteger(Number(id_categoria)))
    return res.status(400).json({ success: false, message: 'ID de categoría requerido y debe ser un entero' });
  if (!id_proveedor || !Number.isInteger(Number(id_proveedor)))
    return res.status(400).json({ success: false, message: 'ID de proveedor requerido y debe ser un entero' });

  try {
    const nuevoProducto = {
      nombre: nombre.trim(),
      precio_venta: parseFloat(precio_venta),
      precio_compra: parseFloat(precio_compra),
      stock: parseInt(stock),
      descripcion: descripcion ? descripcion.trim() : null,
      id_categoria: parseInt(id_categoria),
      id_proveedor: parseInt(id_proveedor)
    };
    const productoId = await productoModel.crearProducto(nuevoProducto);
    res.status(201).json({ success: true, message: 'Producto creado exitosamente', data: { id: productoId } });
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ success: false, message: 'Error interno del servidor al crear producto' });
  }
};

productoController.actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio_venta, precio_compra, stock, descripcion, id_categoria, id_proveedor } = req.body;
  if (!id) return res.status(400).json({ success: false, message: 'ID del producto requerido para actualizar' });
  if (!nombre || !nombre.trim()) return res.status(400).json({ success: false, message: 'Nombre requerido' });
  try {
    const productoExistente = await productoModel.obtenerProductoPorId(id);
    if (!productoExistente) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

    const productoActualizado = {
      nombre: nombre.trim(),
      precio_venta: parseFloat(precio_venta),
      precio_compra: parseFloat(precio_compra),
      stock: parseInt(stock),
      descripcion: descripcion ? descripcion.trim() : productoExistente.descripcion,
      id_categoria: parseInt(id_categoria),
      id_proveedor: parseInt(id_proveedor)
    };
    const actualizado = await productoModel.actualizarProducto(id, productoActualizado);
    if (actualizado) {
      res.status(200).json({ success: true, message: 'Producto actualizado correctamente' });
    } else {
      res.status(400).json({ success: false, message: 'No se pudo actualizar el producto' });
    }
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).json({ success: false, message: 'Error interno del servidor al actualizar producto' });
  }
};

productoController.desactivarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const productoExistente = await productoModel.obtenerProductoPorId(id);
    if (!productoExistente) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    const desactivado = await productoModel.desactivarProducto(id);
    if (desactivado) {
      res.status(200).json({ success: true, message: 'Producto desactivado correctamente' });
    } else {
      res.status(400).json({ success: false, message: 'No se pudo desactivar el producto' });
    }
  } catch (err) {
    console.error('Error al desactivar producto:', err);
    res.status(500).json({ success: false, message: 'Error interno del servidor al desactivar producto' });
  }
};

module.exports = productoController;
