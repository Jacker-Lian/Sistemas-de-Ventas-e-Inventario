// stockController.js
const ProductoModel = require('../models/productoModel'); 
const productoModel = new ProductoModel();

exports.obtenerProductosParaAlertas = async (req, res) => {
  try {
    // Reutilizamos la función ya existente en ProductoModel
    const productos = await productoModel.obtenerProductos();

    // Seleccionamos solo los campos necesarios
    const productosParaAlertas = productos.map(p => ({
      id_producto: p.id, // p.id viene del SELECT en obtenerProductos()
      nombre: p.nombre,
      stock: p.stock
    }));

    return res.json({ success: true, data: productosParaAlertas });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, mensaje: "Error del servidor" });
  }
};
