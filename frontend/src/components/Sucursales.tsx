import { useEffect, useState } from "react";
import SucursalForm from "./SucursalForm";

interface Sucursal {
  id_sucursal: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  estado: number;
}

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/sucursales`;

const Sucursales = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Sucursal | null>(null);

  const cargarSucursales = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setSucursales(data);
  };

  useEffect(() => {
    cargarSucursales();
  }, []);

  const eliminarSucursal = async (id: number) => {
    if (!confirm("¿Eliminar sucursal?")) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    cargarSucursales();
  };

  const abrirFormulario = (sucursal?: Sucursal) => {
    setEditData(sucursal || null);
    setShowForm(true);
  };

  return (
    <div className="container">
      <h1 className="mt-3">Sucursales</h1>

      <button className="btn btn-primary" onClick={() => abrirFormulario()}>
        Nueva Sucursal
      </button>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {sucursales.map((s) => (
            <tr key={s.id_sucursal}>
              <td>{s.nombre}</td>
              <td>{s.direccion}</td>
              <td>{s.telefono}</td>
              <td>{s.correo}</td>

              <td>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => abrirFormulario(s)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => eliminarSucursal(s.id_sucursal)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <SucursalForm
          editData={editData}
          onClose={() => {
            setShowForm(false);
            cargarSucursales();
          }}
        />
      )}
    </div>
  );
};

export default Sucursales;
