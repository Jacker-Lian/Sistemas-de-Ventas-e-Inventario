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
  const [totales] = useState({
    ventasHoy: 1580,
    totalCaja: 5240
  });

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
    </>
  );
}

export default Caja;
