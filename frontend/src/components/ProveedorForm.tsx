import React, { useState } from "react";
import "./Proveedor.css";

const ProveedorForm: React.FC<{ onAdd: (proveedor: any) => void }> = ({ onAdd }) => {
  const [proveedor, setProveedor] = useState({
    nombre: "",
    ruc: "",
    telefono: "",
    direccion: "",
    correo: "",
    producto_principal: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProveedor({ ...proveedor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(proveedor);
    setProveedor({
      nombre: "",
      ruc: "",
      telefono: "",
      direccion: "",
      correo: "",
      producto_principal: "",
    });
  };

  return (
    <div className="form-container">
      <h2>Registrar Proveedor</h2>
      <form onSubmit={handleSubmit} className="proveedor-form">
        <input name="nombre" placeholder="Nombre" value={proveedor.nombre} onChange={handleChange} required />
        <input name="ruc" placeholder="RUC" value={proveedor.ruc} onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" value={proveedor.telefono} onChange={handleChange} />
        <input name="direccion" placeholder="Dirección" value={proveedor.direccion} onChange={handleChange} />
        <input name="correo" placeholder="Correo" value={proveedor.correo} onChange={handleChange} />
        <input name="producto_principal" placeholder="Producto Principal" value={proveedor.producto_principal} onChange={handleChange} />
        <button type="submit" className="btn-primary">Agregar</button>
      </form>
    </div>
  );
};

export default ProveedorForm;
