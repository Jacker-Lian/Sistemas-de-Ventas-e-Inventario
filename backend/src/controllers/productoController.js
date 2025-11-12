const ProductoModel = require('../models/productoModel');
const productoModel = new ProductoModel();

const productoController = {};

// Obtener todos los productos o buscar según action
productoController.obtenerProductos = async (req, res) => {
  const { action, query } = req.query;
  
  try {
    let productos;
    
    if (action === 'search' && query && query.trim()) {
      productos = await productoModel.buscarProductos(query.trim());
    } else {
      productos = await productoModel.obtenerProductos();
    }

    res.status(200).json({ 
      success: true,
      data: productos
    });
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor al obtener productos' 
    });
  }
};

// Obtener un producto por su ID
productoController.obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;
  
  try {
    const producto = await productoModel.obtenerProductoPorId(id);
    
    if (producto) {
      res.status(200).json({ 
        success: true,
        data: producto 
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: 'Producto no encontrado' 
      });
    }
  } catch (err) {
    console.error('Error al obtener producto por ID:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor al obtener producto' 
    });
  }
};

// Obtener productos por categoría
productoController.obtenerProductosPorCategoria = async (req, res) => {
  const { id_categoria } = req.params;
  
  try {
    const productos = await productoModel.obtenerProductosPorCategoria(id_categoria);
    res.status(200).json({ 
      success: true,
      data: productos 
    });
  } catch (err) {
    console.error('Error al obtener productos por categoría:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor al obtener productos por categoría' 
    });
  }
};

// Crear un nuevo producto
productoController.crearProducto = async (req, res) => {
  const { nombre, precio_venta, precio_compra, stock, descripcion, id_categoria, id_proveedor } = req.body;
  
  // Validaciones básicas
  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ 
      success: false,
      message: 'Nombre del producto requerido' 
    });
  }

  try {
    const nuevoProducto = {
      nombre: nombre.trim(),
      precio_venta: Number.parseFloat(precio_venta),
      precio_compra: Number.parseFloat(precio_compra), // CORREGIDO: Error de sintaxis
      stock: parseInt(stock),
      descripcion: descripcion ? descripcion.trim() : null,
      id_categoria: parseInt(id_categoria),
      id_proveedor: parseInt(id_proveedor)
    };
    
    const productoId = await productoModel.crearProducto(nuevoProducto);
    
    res.status(201).json({ 
      success: true,
      message: 'Producto creado exitosamente', 
      data: { id: productoId } 
    });
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor al crear producto' 
    });
  }
};

// Actualizar producto
productoController.actualizarProducto = async (req, res) => {
  const { id, nombre, precio_venta, precio_compra, stock, descripcion, id_categoria, id_proveedor } = req.body;
  
  if (!id) {
    return res.status(400).json({ 
      success: false,
      message: 'ID del producto requerido para actualizar' 
    });
  }

  try {
    const productoActualizado = {
      nombre: nombre.trim(),
      precio_venta: Number.parseFloat(precio_venta),
      precio_compra: Number.parseFloat(precio_compra),
      stock: parseInt(stock),
      descripcion: descripcion ? descripcion.trim() : null,
      id_categoria: parseInt(id_categoria),
      id_proveedor: parseInt(id_proveedor)
    };
    
    const actualizado = await productoModel.actualizarProducto(id, productoActualizado);
    
    if (actualizado) {
      res.status(200).json({ 
        success: true,
        message: 'Producto actualizado correctamente' 
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: 'Producto no encontrado' 
      });
    }
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor al actualizar producto' 
    });
  }
};

// Desactivar producto
productoController.desactivarProducto = async (req, res) => {
  const { id } = req.params;
  
  try {
    const desactivado = await productoModel.desactivarProducto(id);
    
    if (desactivado) {
      res.status(200).json({ 
        success: true,
        message: 'Producto desactivado correctamente' 
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: 'Producto no encontrado' 
      });
    }
  } catch (err) {
    console.error('Error al desactivar producto:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor al desactivar producto' 
    });
  }
};

module.exports = productoController;