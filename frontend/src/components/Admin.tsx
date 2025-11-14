import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import "../styles/admin.css";

function Admin() {
  const { user } = useAuth();

  // Si no hay usuario → redirige al login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Solo ADMIN puede entrar
  if (String(user.rol_usuario).toUpperCase() !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const cards = [
    { title: "Usuarios", desc: "Gestionar usuarios del sistema", to: "/admin/usuarios" },
<<<<<<< HEAD
    { title: "Productos", desc: "Gestionar productos e inventario", to: "/admin/productos" },
    { title: "Ventas", desc: "Revisar y gestionar ventas", to: "/admin/ventas" },
    { title: "Proveedores", desc: "Gestionar proveedores y contactos", to: "/proveedores" },
    { title: "Ajustes de Inventario", desc: "Movimientos y ajustes", to: "/inventario/ajuste" },
    { title: "Registrar Venta", desc: "Registrar una nueva venta", to: "/registrarVenta" },
    { title: "Categorías", desc: "Gestionar categorías de productos", to: "/categorias" },
    { title: "Reporte de Ventas", desc: "Reportes y estadísticas", to: "/inventario/ReporteVentas" },
    { title: "Historial de Ventas", desc: "Ventas realizadas", to: "/ventas/historial" },
    { title: "Sucursales", desc: "Gestionar sucursales", to: "/admin/Sucursales" },
    { title: "Gastos", desc: "Control de gastos", to: "/gastos" },
=======
    { title: "Registrar Venta", desc: "Registro de Ventas", to: "/registrarVenta" },
    { title: "categorías", desc: "Gestionar categorías de productos", to: "/categorias" },
    { title: "Ajustes", desc: "Ajustes de inventario y movimientos", to: "/inventario/ajuste" },
    { title: "Reporte de Ventas", desc: "Ver reportes y estadísticas de ventas", to: "/inventario/ReporteVentas" },
    { title: "Historial de Ventas", desc: "Consulta todas las ventas realizadas", to: "/ventas/historial" },
    { title: "Sucursales", desc: "Gestionar sucursales de la empresa", to: "/admin/Sucursales" },
    { title: "Gastos", desc: "Gestionar gastos y tipos de gasto", to: "/gastos" },
>>>>>>> origin/main
  ];

  return (
    <>
      <Navbar />

      <main className="admin-page">
        <div className="admin-header">
          <div className="admin-welcome">
            <h2 className="muted-small">Bienvenido al</h2>
            <h1 className="title">Panel de Administración</h1>
            <p className="lead muted">
              Accesos rápidos y herramientas administrativas para gestionar el sistema.
            </p>
          </div>

          <div className="admin-user">
            <div className="admin-user-name">{user.nombre_usuario}</div>
            <div className="admin-user-role">{user.rol_usuario ?? "Usuario"}</div>
          </div>
        </div>

        <section className="admin-grid">
          {cards.map((c) => (
            <article key={c.title} className="admin-card">
              <div>
                <h3 className="admin-card-title">{c.title}</h3>
                <p className="admin-card-desc">{c.desc}</p>
              </div>

              <div className="admin-card-actions">
                <Link to={c.to} className="btn btn-primary">
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
