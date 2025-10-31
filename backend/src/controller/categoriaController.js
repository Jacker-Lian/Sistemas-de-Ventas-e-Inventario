import Categoria from "../models/Categoria.js";

// Obtener todas
export const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener categorías", error });
  }
};

// Obtener una
export const getCategoriaById = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria)
      return res.status(404).json({ message: "Categoría no encontrada" });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener categoría", error });
  }
};

// Crear
export const createCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre)
      return res.status(400).json({ message: "El nombre es obligatorio" });

    const nueva = await Categoria.create({ nombre, descripcion });
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ message: "Error al crear categoría", error });
  }
};

// Actualizar
export const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activo } = req.body;
    const ok = await Categoria.update(id, { nombre, descripcion, activo });
    if (!ok)
      return res.status(404).json({ message: "Categoría no encontrada" });
    res.json({ message: "Categoría actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar categoría", error });
  }
};

// Eliminar (lógica)
export const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await Categoria.delete(id);
    if (!ok)
      return res.status(404).json({ message: "Categoría no encontrada" });
    res.json({ message: "Categoría desactivada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar categoría", error });
  }
};