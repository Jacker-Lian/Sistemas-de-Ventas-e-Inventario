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
    { title: "Registrar Venta", desc: "Registro de Ventas", to: "/registrarVenta" },
    { title: "categorías", desc: "Gestionar categorías de productos", to: "/categorias" },
    { title: "Ajustes", desc: "Ajustes de inventario y movimientos", to: "/inventario/ajuste" },
    { title: "Reporte de Ventas", desc: "Ver reportes y estadísticas de ventas", to: "/inventario/ReporteVentas" },
    { title: "Historial de Ventas", desc: "Consulta todas las ventas realizadas", to: "/ventas/historial" },
    { title: "Sucursales", desc: "Gestionar sucursales de la empresa", to: "/admin/Sucursales" },
    { title: "Gastos", desc: "Gestionar gastos y tipos de gasto", to: "/gastos" },
    { title: "Crud Productos", desc: "Gestionar productos del inventario", to: "/CrudProductos"},
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