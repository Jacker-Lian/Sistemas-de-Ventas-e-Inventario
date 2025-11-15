import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SucursalForm from "./SucursalForm";
import "../styles/global.css"

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
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [datosEditar, setDatosEditar] = useState<Sucursal | null>(null);

  const navigate = useNavigate();

  const cargarSucursales = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setSucursales(data);
  };

  useEffect(() => {
    cargarSucursales();
  }, []);

  const abrirFormulario = (sucursal?: Sucursal) => {
    setDatosEditar(sucursal || null);
    setMostrarFormulario(true);
  };

  const cambiarEstadoSucursal = async (id: number, nuevoEstado: number) => {
    await fetch(`${API_URL}/${id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    cargarSucursales();
  };

  return (
    <div className="container">
      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <h1 className="mt-3">Sucursales</h1><br />
      <h4>Bienvenido/a, aquí podrás crear, editar, activar o desactivar sucursales de tu empresa.</h4><br />

      <div style={{ textAlign: "right", margin: "1rem 0" }}>
        <button className="btn btn-primary btn-small" onClick={() => abrirFormulario()}>
          Nueva Sucursal
        </button>
      </div>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {sucursales.map((s) => (
            <tr key={s.id_sucursal}>
              <td>{s.nombre}</td>
              <td>{s.direccion}</td>
              <td>{s.telefono}</td>
              <td>{s.correo}</td>
              <td>{s.estado === 1 ? "Activo" : "Inactivo"}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => abrirFormulario(s)}
                >
                  Editar
                </button>

                <button
                  className={`btn btn-sm ms-2 ${s.estado === 1 ? "btn-danger" : "btn-success"}`}
                  onClick={() => cambiarEstadoSucursal(s.id_sucursal, s.estado === 1 ? 0 : 1)}
                >
                  {s.estado === 1 ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarFormulario && (
        <SucursalForm
          editData={datosEditar}
          onClose={() => {
            setMostrarFormulario(false);
            cargarSucursales();
          }}
        />
      )}
    </div>
  );
};

export default Sucursales;



