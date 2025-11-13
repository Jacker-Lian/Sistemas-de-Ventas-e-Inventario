import { useState } from "react";

interface Props {
  editData?: any;
  onClose: () => void;
}

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/sucursales`;

const SucursalForm = ({ editData, onClose }: Props) => {
  const [form, setForm] = useState({
    nombre: editData?.nombre || "",
    direccion: editData?.direccion || "",
    telefono: editData?.telefono || "",
    correo: editData?.correo || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editData ? "PUT" : "POST";
    const url = editData ? `${API_URL}/${editData.id_sucursal}` : API_URL;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    onClose();
  };

  return (
      <div className="modal-box">

        <h3>{editData ? "Editar Sucursal" : "Nueva Sucursal"}</h3>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />

          <input
            className="form-control mb-2"
            placeholder="Dirección"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />

          <input
            className="form-control mb-2"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />

          <input
            className="form-control mb-2"
            placeholder="Correo"
            type="email"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
          />

          <button className="btn btn-success w-100">
            {editData ? "Actualizar" : "Crear"}
          </button>
        </form>

        <button className="btn btn-secondary w-100 mt-3" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default SucursalForm;
