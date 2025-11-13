import Navbar from "./Navbar";
import Dashboard from "./Dashboard"; // 👈 Importamos el Dashboard

function Caja() {
  return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2>Bienvenido al Módulo de Caja</h2>
        <p>Registra ventas, imprime boletas y consulta inventario.</p>
      </div>

      <Dashboard />
    </>
  );
}

export default Caja;
