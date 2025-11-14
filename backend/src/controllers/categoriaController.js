const Categoria = require('../models/Categoria');

// Función auxiliar para validar ID numérico
const validarId = (id) => {
    const numId = parseInt(id, 10);
    return !isNaN(numId) && Number.isInteger(numId) && numId > 0;
};

// Obtener solo ACTIVAS (Ruta: /api/categorias)
const getCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categorías activas', error: error.message });
    }
};

// Obtener TODAS (Ruta: /api/categorias/all)
const getCategoriasAll = async (req, res) => {
    try {
        const categorias = await Categoria.findAllState();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener todas las categorías', error: error.message });
    }
};

// Obtener SOLO INACTIVAS (Ruta: /api/categorias/inactivas)
const getCategoriasInactive = async (req, res) => {
    try {
        const categorias = await Categoria.findInactive();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categorías inactivas', error: error.message });
    }
};

// Obtener una o varias por nombre (Busca SÓLO ACTIVAS - /buscar/:nombre)
const getCategoriaByNombre = async (req, res) => {
    try {
        const searchTerm = req.params.nombre; 
        
        if (!searchTerm || searchTerm.trim() === '') {
             return res.status(400).json({ message: 'El término de búsqueda (nombre) es obligatorio.' });
        }

        const categorias = await Categoria.findByName(searchTerm);
        
        if (categorias.length === 0) {
            return res.status(404).json({ message: 'No se encontraron categorías activas con ese nombre' });
        }
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar categoría por nombre', error: error.message });
    }
};

// Obtener por nombre SÓLO INACTIVAS (Ruta: /buscar/inactivas/:nombre)
const getCategoriaByNombreInactive = async (req, res) => {
    try {
        const searchTerm = req.params.nombre; 
        
        if (!searchTerm || searchTerm.trim() === '') {
             return res.status(400).json({ message: 'El término de búsqueda (nombre) es obligatorio.' });
        }

        const categorias = await Categoria.findByNameInactive(searchTerm);
        
        if (categorias.length === 0) {
            return res.status(404).json({ message: 'No se encontraron categorías inactivas con ese nombre' });
        }
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar categoría inactiva por nombre', error: error.message });
    }
};

// Obtener por nombre TODAS (Ruta: /buscar/all/:nombre)
const getCategoriaByNombreAll = async (req, res) => {
    try {
        const searchTerm = req.params.nombre; 
        
        if (!searchTerm || searchTerm.trim() === '') {
             return res.status(400).json({ message: 'El término de búsqueda (nombre) es obligatorio.' });
        }

        const categorias = await Categoria.findByNameAll(searchTerm);
        
        if (categorias.length === 0) {
            return res.status(404).json({ message: 'No se encontraron categorías (activas/inactivas) con ese nombre' });
        }
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar categoría total por nombre', error: error.message });
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
        
        if (!validarId(id)) {
            return res.status(400).json({ message: 'ID de categoría no válido. Debe ser un número entero.' });
        }
        
        const idNum = parseInt(id, 10);
        const { nombre, descripcion } = req.body;
        
        const ok = await Categoria.update(idNum, { nombre, descripcion });
        
        if (!ok) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.json({ message: 'Categoría actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar categoría', error: error.message });
    }
};

// Eliminar (Desactivación Lógica)
const deleteCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        if (!validarId(id)) {
            return res.status(400).json({ message: 'ID de categoría no válido. Debe ser un número entero.' });
        }
        
        const idNum = parseInt(id, 10);
        const ok = await Categoria.delete(idNum);
        
        if (!ok) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.json({ message: 'Categoría desactivada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar categoría', error: error.message });
    }
};

// Reactivar (Cambia estado de 0 a 1)
const reactivateCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        if (!validarId(id)) {
            return res.status(400).json({ message: 'ID de categoría no válido. Debe ser un número entero.' });
        }
        
        const idNum = parseInt(id, 10);
        const ok = await Categoria.reactivate(idNum); 
        
        if (!ok) {
            return res.status(404).json({ message: 'Categoría no encontrada o ya estaba activa.' }); 
        }

        res.json({ message: 'Categoría reactivada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al reactivar categoría', error: error.message });
    }
};


module.exports = {
    getCategorias,
    getCategoriaByNombre,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    reactivateCategoria, 
    getCategoriasAll,
    getCategoriasInactive,
    getCategoriaByNombreInactive, // Exportado
    getCategoriaByNombreAll,      // Exportado
};