import React, { useEffect, useState } from 'react';
import "./Gastos.css";
import type { Gasto, TipoGasto } from '../../types/gastos';
import { getGastos, getGasto, getTiposGasto } from '../../api/gastos';
import GastoCard from './GastoCard';
import GastoCreateCard from './GastoCreateCard';

const Gastos: React.FC = () => {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [tiposGasto, setTiposGasto] = useState<TipoGasto[]>([]);
  const [pagina, setPagina] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [gastoSeleccionado, setGastoSeleccionado] = useState<Gasto | null>(null);
  const [loadingGasto, setLoadingGasto] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  // Función para cargar gastos
  const cargarGastos = async () => {
    try {
      const data = await getGastos(pagina, limit);
      setGastos(data.data ?? []);
      setTotalPaginas(data.totalPaginas ?? 1);
    } catch (error) {
      console.error("Error al cargar gastos:", error);
    }
  };

  const cargarTipos = async () => {
    try {
      const res = await getTiposGasto();
      setTiposGasto(res.data ?? []);
    } catch (error) {
      console.error("Error cargando tipos:", error);
    }
  };

  const verGasto = async (id_gasto: number) => {
    try {
      setLoadingGasto(true);
      const res = await getGasto(id_gasto);
      setGastoSeleccionado(res.data);
    } catch (error) {
      console.error("Error cargando gasto completo:", error);
      alert("No se pudo cargar el gasto");
    } finally {
      setLoadingGasto(false);
    }
  };

  useEffect(() => {
    cargarTipos();
  }, []);

  useEffect(() => {
    cargarGastos();
  }, [pagina, limit]);

  const handleCreated = async () => {
    setShowCreateModal(false);
    setPagina(1);
    await cargarGastos();
  };

  return (
    <div className="gastos-table-container">
      <div className="gastos-header">
        <div className="gastos-limit-selector">
          <label htmlFor="limit">Mostrar</label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => {
              const newLimit = parseInt(e.target.value, 10);
              setLimit(newLimit);
              setPagina(1); // Resetear a página 1
            }}>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={75}>75</option>
            <option value={100}>100</option>
          </select>
          <span>gastos por página</span>
        </div>

        <button
          className="gasto-create-card"
          onClick={() => setShowCreateModal(true)}
        >
          + Nuevo gasto
        </button>
      </div>

      <div className="gastos-table-wrapper">
        <table className="gastos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Tipo de pago</th>
              <th>Método</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {gastos.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>No hay gastos</td>
              </tr>
            ) : (
              gastos.map((g) => (
                <tr key={g.id_gasto}>
                  <td>{g.id_gasto}</td>
                  <td title={g.descripcion}>{g.descripcion}</td>
                  <td>S/ {g.monto}</td>
                  <td>{g.tipo_gasto}</td>
                  <td>{g.metodo_pago}</td>
                  <td className="tres-puntitos">
                    <div
                      className="card-trigger"
                      onClick={() => verGasto(g.id_gasto)}
                      role="button"
                      title="ver gasto"
                    >
                      ⋮
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="gastos-pagination">
        <button disabled={pagina <= 1} onClick={() => setPagina(pagina - 1)}>Anterior</button>
        <span>{pagina} / {totalPaginas}</span>
        <button disabled={pagina >= totalPaginas} onClick={() => setPagina(pagina + 1)}>Siguiente</button>
      </div>

      {showCreateModal && (
        <GastoCreateCard
          tiposGasto={tiposGasto}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
        />
      )}

      {gastoSeleccionado && !loadingGasto && (
        <GastoCard
          gasto={gastoSeleccionado}
          tiposGasto={tiposGasto}
          onClose={() => setGastoSeleccionado(null)}
          onUpdated={() => cargarGastos()}
          onDeleted={() => cargarGastos()}
        />
      )}
    </div>
  );
};

export default Gastos;
