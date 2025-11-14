import { useEffect, useState } from "react";
import apiVentas from "../../api/axiosHistorialVentas";
import Navbar from "../Navbar";
import "../../styles/admin.css";
import "./HistorialVentas.css";

interface Venta {
  id_venta: number;
  fecha_venta: string;
  cliente?: string;
  total: number;
  metodo_pago: string;
  estado_venta: string;
}

interface DetalleVenta {
  id_detalle: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export default function HistorialVentas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // filtros
  const [estado, setEstado] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // detalle de venta
  const [detalleVenta, setDetalleVenta] = useState<DetalleVenta[] | null>(null);
  const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(null);

  

  const fetchVentas = async () => {
    try {
      setLoading(true);
      setError(null); // Limpiar errores en cada fetch
      const params: any = { page, limit };
      if (estado) params.estado_venta = estado;
      if (fechaInicio) params.fecha_inicio = fechaInicio;
      if (fechaFin) params.fecha_fin = fechaFin;

      const { data } = await apiVentas.get("/api/historial-ventas", { params });
      setVentas(data.data || []);
      setTotalPaginas(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("No se pudo obtener el historial de ventas.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetalleVenta = async (id: number) => {
    try {
      setError(null); // Limpiar errores
      const { data } = await apiVentas.get(`/api/historial-ventas/${id}`);
      const venta = data.data;
      setDetalleVenta(venta.detalles || []);
      setVentaSeleccionada(venta);
    } catch (err) {
      console.error(err);
      setError("No se pudo obtener el detalle de la venta.");
    }
  };


  const convertirJsonA_CSV = (datos: DetalleVenta[], infoVenta: Venta) => {
    const headers = [
      "ID Venta",
      "Fecha Venta",
      "Producto",
      "Cantidad",
      "Precio Unitario",
      "Subtotal"
    ];
    
    const csvRows = [headers.join(',')]; 

    for (const item of datos) {
      const values = [
        infoVenta.id_venta,
        new Date(infoVenta.fecha_venta).toLocaleString(), 
        `"${item.nombre_producto.replace(/"/g, '""')}"`, 
        item.cantidad,
        item.precio_unitario.toFixed(2),
        item.subtotal.toFixed(2)
      ];
      csvRows.push(values.join(','));
    }

    csvRows.push(""); 
    csvRows.push(`,,,,Total:,S/ ${infoVenta.total.toFixed(2)}`);

    return csvRows.join('\n'); 
  };

  const descargarCSV = (csvString: string, idVenta: number) => {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `detalle_venta_${idVenta}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const [exportLoadingId, setExportLoadingId] = useState<number | null>(null);


  const handleExportarCSVDirecto = async (idVenta: number) => {
    if (exportLoadingId === idVenta) return; 
    
    setExportLoadingId(idVenta);
    setError(null);
    
    try {
      const { data: ventaData } = await apiVentas.get(`/api/historial-ventas/${idVenta}`);
      const ventaInfo: Venta = ventaData.data;


      const { data: detalleData } = await apiVentas.get(`/api/detalle-venta/${idVenta}`);
      const detalles: DetalleVenta[] = detalleData;

      if (!detalles || detalles.length === 0) {
        setError("No hay detalles para exportar en esta venta.");
        setExportLoadingId(null);
        return;
      }

      const csvString = convertirJsonA_CSV(detalles, ventaInfo);
      
      descargarCSV(csvString, idVenta);

    } catch (err: any) {
      console.error(err);
      setError("Error al generar el CSV: " + (err.response?.data?.message || err.message));
    } finally {
      setExportLoadingId(null); 
    }
  };

  useEffect(() => {
    fetchVentas();
  }, [page, estado, fechaInicio, fechaFin]);

  if (loading && ventas.length === 0) {
    return <p style={{ textAlign: "center" }}>Cargando ventas...</p>;
  }

  return (
    <>
      <Navbar />
      <main className="admin-page">
        <header className="admin-header">
          <div className="admin-welcome">
            <h2 className="muted-small">Historial de</h2>
            <h1 className="title">Ventas Registradas</h1>
            <p className="lead muted">Consulta, filtra y revisa los detalles de tus ventas.</p>
          </div>
        </header>

        {/* Mostrar error de forma no intrusiva */}
        {error && <p style={{ color: "red", textAlign: "center", margin: "1rem 0" }}>{error}</p>}

        {/* FILTROS */}
        <section className="card filtros">
          <div className="filtros-grid">
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Estado (todos)</option>
              <option value="COMPLETADA">Completada</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="CANCELADA">Cancelada</option>
            </select>


            <div className="fecha-rango">
              <label>Desde:</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
              <label>Hasta:</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>

            <button className="btn-filtrar" onClick={() => { setPage(1); fetchVentas(); }}>Filtrar</button>
            <button
              className="btn-limpiar"
              onClick={() => {
                setEstado("");
                setFechaInicio("");
                setFechaFin("");
                setPage(1);
              }}
            >
              Limpiar
            </button>
          </div>
        </section>

        {/* TABLA DE VENTAS */}
        <section className="historial-card">
          {/* Mostramos el 'loading' aquí para no ocultar filtros */}
          {loading ? (
            <p style={{ textAlign: "center" }}>Cargando...</p>
          ) : ventas.length === 0 ? (
            <p style={{ textAlign: "center" }}>No hay ventas registradas.</p>
          ) : (
            <table className="ventas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Método de Pago</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th> 
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta) => (
                  <tr
                    key={venta.id_venta}
                    onClick={() => fetchDetalleVenta(venta.id_venta)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{venta.id_venta}</td>
                    <td>{new Date(venta.fecha_venta).toLocaleDateString()}</td>
                    <td>{venta.cliente || "-"}</td>
                    <td>{venta.metodo_pago}</td>
                    <td>S/ {venta.total.toFixed(2)}</td>
                    <td>
                      <span className={`estado-badge ${venta.estado_venta.toLowerCase()}`}>
                        {venta.estado_venta}
                      </span>
                    </td>
                    
                    <td>
                      <button
                        className="btn-filtrar" //boton exportar
                        style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleExportarCSVDirecto(venta.id_venta);
                        }}
                        disabled={exportLoadingId === venta.id_venta} 
                      >
                        {exportLoadingId === venta.id_venta ? "..." : "Exportar"}
                      </button>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* PAGINACIÓN */}
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              ← Anterior
            </button>
            <span>
              Página {page} de {totalPaginas}
            </span>
            <button
              disabled={page === totalPaginas || totalPaginas === 0}
              onClick={() => setPage(page + 1)}
            >
              Siguiente →
            </button>
          </div>
        </section>

        {/* DETALLE DE VENTA */}
        {detalleVenta && ventaSeleccionada && (
          <section className="historial-card detalle-venta">
            <h3>Detalle de venta #{ventaSeleccionada.id_venta}</h3>
            <p><strong>Fecha:</strong> {new Date(ventaSeleccionada.fecha_venta).toLocaleString()}</p>
            <p><strong>Método de pago:</strong> {ventaSeleccionada.metodo_pago}</p>
            <p><strong>Estado:</strong> {ventaSeleccionada.estado_venta}</p>
            <hr />
            {detalleVenta.length > 0 ? (
              <table className="ventas-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detalleVenta.map((d) => (
                    <tr key={d.id_detalle}>
                      <td>{d.nombre_producto}</td>
                      <td>{d.cantidad}</td>
                      <td>S/ {d.precio_unitario.toFixed(2)}</td>
                      <td>S/ {d.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay productos en esta venta.</p>
            )}
            <button
              className="btn-cerrar"
              onClick={() => {
                setDetalleVenta(null);
                setVentaSeleccionada(null);
                setError(null); // Limpiar error al cerrar
              }}
            >
              Cerrar Detalle
            </button>
          </section>
        )}
      </main>
    </>
  );
}