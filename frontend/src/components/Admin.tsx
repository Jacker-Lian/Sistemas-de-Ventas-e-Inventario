import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import "../styles/admin.css";

function Admin() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.rol_usuario && String(user.rol_usuario).toUpperCase() !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const cards = [
    { title: "Usuarios", desc: "Gestionar usuarios del sistema", to: "/admin/usuarios" },
    { title: "Productos", desc: "Gestionar productos e inventario", to: "/admin/productos" },
    { title: "Ventas", desc: "Revisar y gestionar ventas", to: "/admin/ventas" },
    { title: "Proveedores", desc: "Gestionar proveedores y contactos", to: "/proveedores" },
    { title: "Ajustes", desc: "Ajustes de inventario y movimientos", to: "/admin/ajustes" },
    { title: "Historial de Ventas", desc: "Consulta todas las ventas realizadas", to: "/ventas/historial" },
  ];

  return (
    <>
      <Navbar />
      <main className="admin-page">
        <div className="admin-header">
          <div className="admin-welcome">
            <h2 className="muted-small">Bienvenido al</h2>
            <h1 className="title">Panel de Administración</h1>
            <p className="lead muted">Accesos rápidos y herramientas administrativas para gestionar el sistema.</p>
          </div>

          <div className="admin-user">
            <div className="admin-user-name">{user.nombre_usuario}</div>
            <div className="admin-user-role">{user.rol_usuario ?? "Usuario"}</div>
          </div>
        </div>

        <section className="admin-grid">
          {cards.map((c) => (
            <article key={c.title} className="admin-card" aria-labelledby={`card-${c.title}`}>
              <div>
                <h3 id={`card-${c.title}`} className="admin-card-title">{c.title}</h3>
                <p className="admin-card-desc">{c.desc}</p>
              </div>
              <div className="admin-card-actions">
                <Link to={c.to} className="btn btn-primary" title={`Abrir ${c.title}`}>
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
export default Admin;
// ...existing code...