// inporta el modelo de proveedor
const ProveedorModel = require("../models/proveedorModel");

// crear instancia del modelo
const proveedorModelInstance = new ProveedorModel();

// controlador de proveedores
const proveedorController = {

  // buscar proveedores por texto
  buscarProveedores: async (req, res) => {
    try {
      const query = req.query.query;

      // validación de query
      if (!query || query.trim() === "") {
        return res.status(400).json({ message: "Debe enviar un texto de búsqueda" });
      }

      // buscar proveedores en el modelo
      const resultados = await proveedorModelInstance.buscarProveedores(query);
      return res.status(200).json(resultados);

    } catch (error) {
      console.error("Error en búsqueda:", error);
      return res.status(500).json({ message: "Error al buscar proveedores" });
    }
  },

  
  // obtener todos los proveedores
  obtenerProveedores: async (req, res) => {
    try {
      const proveedores = await proveedorModelInstance.obtenerProveedores();
      return res.status(200).json(proveedores);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      return res.status(500).json({ message: "Error al obtener proveedores: " + error.message });
    }
  },

  
  // obtener un proveedor por su ID
  obtenerProveedorPorId: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);

      // Validación de ID
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID de proveedor inválido" });
      }

      const proveedor = await proveedorModelInstance.obtenerProveedorPorId(id);

      if (!proveedor) return res.status(404).json({ message: "Proveedor no encontrado" });

      return res.status(200).json(proveedor);
    } catch (error) {
      console.error('Error al obtener proveedor:', error);
      return res.status(500).json({ message: "Error al obtener proveedor: " + error.message });
    }
  },

  
  // crear un nuevo proveedor
  crearProveedor: async (req, res) => {
    try {
      const { nombre, ruc, telefono, direccion, correo, producto_principal } = req.body;

      // validaciones de datos
      if (!nombre || typeof nombre !== "string" || nombre.trim() === "")
        return res.status(400).json({ message: "Nombre inválido" });

      if (!ruc || !/^\d{11}$/.test(ruc))
        return res.status(400).json({ message: "RUC inválido. Debe tener 11 dígitos numéricos" });

      if (!telefono || !/^\d+$/.test(telefono))
        return res.status(400).json({ message: "Teléfono inválido. Debe contener solo números" });

      if (!direccion || typeof direccion !== "string" || direccion.trim() === "")
        return res.status(400).json({ message: "Dirección inválida" });

      if (!correo || !/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(correo))
        return res.status(400).json({ message: "Correo electrónico inválido" });

      if (!producto_principal || typeof producto_principal !== "string" || producto_principal.trim() === "")
        return res.status(400).json({ message: "Producto principal inválido" });

      // crear proveedor en el modelo
      const nuevoId = await proveedorModelInstance.crearProveedor({
        nombre,
        ruc,
        telefono,
        direccion,
        correo,
        producto_principal
      });

      return res.status(201).json({
        message: "Proveedor creado exitosamente",
        id_proveedor: nuevoId
      });
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      return res.status(500).json({ message: "Error al crear proveedor: " + error.message });
    }
  },


  // actualizar un proveedor existente
  actualizarProveedor: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);

      // validación de ID
      if (isNaN(id) || id <= 0)
        return res.status(400).json({ message: "ID de proveedor inválido" });

      const { nombre, ruc, telefono, direccion, correo, producto_principal } = req.body;

      // validaciones de datos
      if (!nombre || typeof nombre !== "string" || nombre.trim() === "")
        return res.status(400).json({ message: "Nombre inválido" });

      if (!ruc || !/^\d{11}$/.test(ruc))
        return res.status(400).json({ message: "RUC inválido" });

      if (!telefono || !/^\d+$/.test(telefono))
        return res.status(400).json({ message: "Teléfono inválido" });

      if (!direccion || typeof direccion !== "string" || direccion.trim() === "")
        return res.status(400).json({ message: "Dirección inválida" });

      if (!correo || !/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(correo))
        return res.status(400).json({ message: "Correo inválido" });

      if (!producto_principal || typeof producto_principal !== "string" || producto_principal.trim() === "")
        return res.status(400).json({ message: "Producto principal inválido" });

      // actualizar proveedor en el modelo
      const actualizado = await proveedorModelInstance.actualizarProveedor(id, {
        nombre,
        ruc,
        telefono,
        direccion,
        correo,
        producto_principal
      });

      if (!actualizado) return res.status(404).json({ message: "Proveedor no encontrado" });

      return res.status(200).json({ message: "Proveedor actualizado exitosamente" });
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      return res.status(500).json({ message: "Error al actualizar proveedor: " + error.message });
    }
  },

  // desactivar un proveedor
  desactivarProveedor: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);

      // validación de ID
      if (isNaN(id) || id <= 0)
        return res.status(400).json({ message: "ID inválido" });

      const desactivado = await proveedorModelInstance.desactivarProveedor(id);

      if (!desactivado) return res.status(404).json({ message: "Proveedor no encontrado" });

      return res.status(200).json({ message: "Proveedor desactivado exitosamente" });
    } catch (error) {
      console.error('Error al desactivar proveedor:', error);
      return res.status(500).json({ message: "Error al desactivar proveedor: " + error.message });
    }
  }
};

// exportar el controlador
module.exports = proveedorController;
