import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import "../styles/admin.css"; 

function Caja() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.rol_usuario && String(user.rol_usuario).toUpperCase() !== "CAJA") {
    return <Navigate to="/" replace />;
  }

  const cards = [
    { title: "Registrar Venta", desc: "Registro de Ventas", to: "/registrarVenta" },
    { title: "Historial de Ventas", desc: "Consulta todas las ventas realizadas", to: "/ventas/historial" },
    //{ title: "Reporte Diario", desc: "Ver reporte diario de ventas realizadas", to: "/caja/reporte-diario" },
    //{ title: "Cierre de Caja", desc: "Realizar cierre de caja al final del turno", to: "/caja/cierre" }
  ];

  return (
    <>
      <Navbar />
      <main className="admin-page">
        <div className="admin-header">
          <div className="admin-welcome">
            <h2 className="muted-small">Bienvenido(a) al</h2>
            <h1 className="title">Panel de Caja</h1>
            <p className="lead muted">
              Herramientas y accesos rápidos para gestionar tus operaciones diarias.
            </p>
          </div>

          <div className="admin-user">
            <div className="admin-user-name">{user.nombre_usuario}</div>
            <div className="admin-user-role">{user.rol_usuario ?? "Caja"}</div>
          </div>
        </div>

        <section className="admin-grid">
          {cards.map((c) => (
            <article key={c.title} className="admin-card" aria-labelledby={`card-${c.title}`}>
              <div>
                <h3 id={`card-${c.title}`} className="admin-card-title">
                  {c.title}
                </h3>
                <p className="admin-card-desc">{c.desc}</p>
              </div>
              <div className="admin-card-actions">
                <Link
                  to={c.to}
                  className="btn btn-primary"
                  title={`Abrir ${c.title}`}
                >
                  Abrir
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}

export default Caja;

