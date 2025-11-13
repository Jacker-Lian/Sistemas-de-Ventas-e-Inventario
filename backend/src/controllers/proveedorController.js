const ProveedorModel = require("../models/proveedorModel"); 
const proveedorModelInstance = new ProveedorModel();

const proveedorController = {
  // Obtener todos los proveedores
  obtenerProveedores: async (req, res) => {
    try {
      const proveedores = await proveedorModelInstance.obtenerProveedores();
      return res.status(200).json(proveedores);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      return res.status(500).json({ message: "Error al obtener proveedores: " + error.message });
    }
  },

  // Obtener proveedor por ID
  obtenerProveedorPorId: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
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

  // Crear nuevo proveedor
  crearProveedor: async (req, res) => {
    try {
      const { nombre, ruc, telefono, direccion, correo, producto_principal } = req.body;

      // ✅ Validación completa
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

  // Actualizar proveedor
  actualizarProveedor: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) return res.status(400).json({ message: "ID de proveedor inválido" });

      const { nombre, ruc, telefono, direccion, correo, producto_principal } = req.body;

      // ✅ Validación completa
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

  // Desactivar proveedor
  desactivarProveedor: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) return res.status(400).json({ message: "ID de proveedor inválido" });

      const desactivado = await proveedorModelInstance.desactivarProveedor(id);
      if (!desactivado) return res.status(404).json({ message: "Proveedor no encontrado" });

      return res.status(200).json({ message: "Proveedor desactivado exitosamente" });
    } catch (error) {
      console.error('Error al desactivar proveedor:', error);
      return res.status(500).json({ message: "Error al desactivar proveedor: " + error.message });
    }
  }
};

module.exports = proveedorController;
