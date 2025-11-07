const Categoria = require('../models/Categoria');

// Obtener todas
const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
  }
};

// Obtener una
const getCategoriaByNombre = async (req, res) => {
  try {
    const searchTerm = req.params.id; 
    const categorias = await Categoria.findByName(searchTerm);
    if (categorias.length === 0) { 
      return res.status(404).json({ message: 'No se encontraron categorías con ese nombre' });
    }
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar categoría por nombre', error: error.message });
  }
};

// Crear
const createCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ message: 'El nombre es obligatorio' });

    const nueva = await Categoria.create({ nombre, descripcion });
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear categoría', error: error.message });
  }
};

// Actualizar
const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;
    const ok = await Categoria.update(id, { nombre, descripcion, estado });
    if (!ok) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ message: 'Categoría actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar categoría', error: error.message });
  }
};

// Eliminar (lógica)
const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await Categoria.delete(id);
    if (!ok) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ message: 'Categoría desactivada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar categoría', error: error.message });
  }
};

module.exports = {
  getCategorias,
  getCategoriaByNombre,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};