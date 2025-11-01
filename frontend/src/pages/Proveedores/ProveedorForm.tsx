import React, { useState } from "react";
import { createProveedor } from "../../services/proveedoresService";

export const ProveedorForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    ruc: "",
    telefono: "",
    direccion: "",
    correo: "",
    producto_principal: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProveedor(formData);
      alert("Proveedor registrado con éxito ✅");
      setFormData({
        nombre: "",
        ruc: "",
        telefono: "",
        direccion: "",
        correo: "",
        producto_principal: "",
      });
    } catch (error) {
      console.error(error);
      alert("❌ Error al registrar proveedor");
    }
  };

  return (
    <div className="form-container">
      <h2>Registrar Proveedor</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />

        <label>RUC:</label>
        <input type="text" name="ruc" value={formData.ruc} onChange={handleChange} />

        <label>Teléfono:</label>
        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />

        <label>Dirección:</label>
        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />

        <label>Correo:</label>
        <input type="email" name="correo" value={formData.correo} onChange={handleChange} />

        <label>Producto Principal:</label>
        <input type="text" name="producto_principal" value={formData.producto_principal} onChange={handleChange} />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};
