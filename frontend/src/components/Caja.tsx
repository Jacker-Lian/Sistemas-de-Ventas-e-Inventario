import Navbar from "./Navbar";
import "../styles/cajas.css";
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function Caja() {

  // DATOS SIMULADOS
  const totales = {
    ventasHoy: 1580,
    totalCaja: 5240
  };

  const [alertasStock] = useState(3);

  const [graficaVentas] = useState([
    { dia: "Lun", total: 150 },
    { dia: "Mar", total: 220 },
    { dia: "Mié", total: 180 },
    { dia: "Jue", total: 300 },
    { dia: "Vie", total: 260 },
    { dia: "Sáb", total: 310 },
    { dia: "Dom", total: 190 }
  ]);

  const [productosMasVendidos] = useState([
    { producto: "Arroz", cantidad: 120 },
    { producto: "Aceite", cantidad: 95 },
    { producto: "Leche", cantidad: 70 },
    { producto: "Atún", cantidad: 50 }
  ]);

  return (
    <>
      <Navbar />

      <div className="caja-container">

        {/* ==== BOTONES DE ACCESO ==== */}
        <div className="acciones-rapidas">
          <Link to="/caja/registrar-venta" className="btn-acceso">Registrar Venta</Link>
          <Link to="/caja/historial-ventas" className="btn-acceso">Historial de Ventas</Link>
          <Link to="/caja/reporte-ventas" className="btn-acceso">Reporte de Ventas</Link>
        </div>

        <h2 className="titulo">Resumen general</h2>

        {/* Tarjetas */}
        <div className="caja-cards">

          <div className="card">
            <h3>Ventas del día</h3>
            <p className="valor">S/. {totales.ventasHoy}</p>
          </div>

          <div className="card">
            <h3>Caja actual</h3>
            <p className="valor">S/. {totales.totalCaja}</p>
          </div>

          <div className="card alerta-card">
            <h3>Alertas de Stock</h3>
            <p className="valor rojo">{alertasStock}</p>
          </div>

        </div>

        {/* Gráficas */}
        <div className="caja-graficas">

          <div className="grafica">
            <h3>Gráfica de ventas</h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={graficaVentas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grafica">
            <h3>Productos más vendidos</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={productosMasVendidos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="producto" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
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
    { title: "Ajustes", desc: "Ajustes de inventario y movimientos", to: "/inventario/ajuste" },
    { title: "Gastos", desc: "Gestionar gastos y tipos de gasto", to: "/gastos" },
    //{ title: "Reporte Diario", desc: "Ver reporte diario de ventas realizadas", to: "/caja/reporte-diario" },
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
