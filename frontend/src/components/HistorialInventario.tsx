import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";


import api from "../api/axios"; 


import "../styles/admin.css"; 
import "./HistorialVentas/HistorialVentas.css"; 


interface FiltrosInventario {
  fecha_inicio?: string;
  fecha_fin?: string;
  nombre_producto?: string;
  nombre_usuario?: string;
  tipo_ajuste?: string; // "AUMENTO" o "DISMINUCION"
}


interface AjusteInventario {
  id_ajuste: number;
  fecha_creacion: string; 
  nombre_producto: string;
  nombre_usuario: string;
  tipo_ajuste: 'AUMENTO' | 'DISMINUCION';
  observaciones: string;
  stock_nuevo: number;
}


const filtrosVacios: FiltrosInventario = {
  fecha_inicio: "",
  fecha_fin: "",
  nombre_producto: "",
  nombre_usuario: "",
  tipo_ajuste: "",
};



export default function HistorialInventario() {
  const { user } = useAuth(); 
  
 
  const [historial, setHistorial] = useState<AjusteInventario[]>([]);
  
  const [filtros, setFiltros] = useState<FiltrosInventario>(filtrosVacios);
  
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 
  const fetchHistorial = async (filtrosAplicados: FiltrosInventario) => {
    setLoading(true);
    setError(null); 
    
    try {
      
      const params = new URLSearchParams();
      if (filtrosAplicados.fecha_inicio) params.append('fecha_inicio', filtrosAplicados.fecha_inicio);
      if (filtrosAplicados.fecha_fin) params.append('fecha_fin', filtrosAplicados.fecha_fin);
      if (filtrosAplicados.nombre_producto) params.append('nombre_producto', filtrosAplicados.nombre_producto);
      if (filtrosAplicados.nombre_usuario) params.append('nombre_usuario', filtrosAplicados.nombre_usuario);
      if (filtrosAplicados.tipo_ajuste) params.append('tipo_ajuste', filtrosAplicados.tipo_ajuste);

      
      const response = await api.get('/api/ajustes-inventario', {
        params: params
      });

      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al cargar el historial.');
      }

      
      setHistorial(response.data.data || []);
      
      
      if (response.data.data.length === 0) {
        setError("No se encontraron registros que coincidan con los filtros.");
      }

    } catch (err: any) {
      
      console.error(err);
      setError(err.response?.data?.message || err.message || "No se pudo obtener el historial.");
      setHistorial([]); 
    } finally {
      setLoading(false); 
    }
  };

  
  useEffect(() => {
    fetchHistorial(filtros); 
  }, []); 

 
  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prevFiltros => ({
      ...prevFiltros,
      [name]: value 
    }));
  };

  
  const limpiarFiltros = () => {
    setFiltros(filtrosVacios);
    fetchHistorial(filtrosVacios);
  };

  
  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault(); 
    fetchHistorial(filtros); 
  };

  
  return (
    <>
      <Navbar />
      <main className="admin-page">
        
        <header className="admin-header">
          <div className="admin-welcome">
            <h2 className="muted-small">Inventario</h2>
            <h1 className="title">Historial de Ajustes</h1>
            <p className="lead muted">Consulta todos los movimientos manuales del stock.</p>
          </div>
          <div className="admin-user">
            <div className="admin-user-name">{user?.nombre_usuario}</div>
            <div className="admin-user-role">{user?.rol_usuario}</div>
          </div>
        </header>

       
        {error && !loading && (
          <p style={{ color: "orange", textAlign: "center", margin: "1rem 0" }}>
            {error}
          </p>
        )}

        {/* Sección de Filtros */}
        <section className="card filtros">
         
          <form className="filtros-grid" onSubmit={handleBuscar}>
            
            {/* Filtros de Fecha */}
            <div className="fecha-rango">
              <label htmlFor="fecha_inicio">Desde:</label>
              <input
                type="date"
                id="fecha_inicio"
                name="fecha_inicio" 
                value={filtros.fecha_inicio}
                onChange={handleFiltroChange}
              />
              <label htmlFor="fecha_fin">Hasta:</label>
              <input
                type="date"
                id="fecha_fin"
                name="fecha_fin" 
                value={filtros.fecha_fin}
                onChange={handleFiltroChange}
              />
            </div>

            {/* Filtros de Texto */}
            <input
              type="text"
              name="nombre_producto" 
              placeholder="Filtrar por producto..."
              value={filtros.nombre_producto}
              onChange={handleFiltroChange}
              style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <input
              type="text"
              name="nombre_usuario"
              placeholder="Filtrar por usuario..."
              value={filtros.nombre_usuario}
              onChange={handleFiltroChange}
              style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />

            
            <select name="tipo_ajuste" value={filtros.tipo_ajuste} onChange={handleFiltroChange}>
              <option value="">Tipo (todos)</option>
              <option value="AUMENTO">Aumento</option>
              <option value="DISMINUCION">Disminución</option>
            </select>

        
            <button type="submit" className="btn-filtrar" disabled={loading}>
              {loading ? "Buscando..." : "Filtrar"}
            </button>
            <button type="button" className="btn-limpiar" onClick={limpiarFiltros} disabled={loading}>
              Limpiar
            </button>
          </form>
        </section>

        
        <section className="historial-card">
          {loading && historial.length === 0 ? (
            <p style={{ textAlign: "center" }}>Cargando...</p>
          ) : (
            <table className="ventas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Usuario</th>
                  <th>Tipo</th>
                  <th>Observaciones</th>
                  <th>Stock Nuevo</th>
                </tr>
              </thead>
              <tbody>
                
                {historial.map((ajuste) => (
                  <tr key={ajuste.id_ajuste}>
                    <td>{ajuste.id_ajuste}</td>
                    <td>{new Date(ajuste.fecha_creacion).toLocaleString()}</td>
                    <td>{ajuste.nombre_producto}</td>
                    <td>{ajuste.nombre_usuario}</td>
                    <td>
                     
                      <span className={`estado-badge ${ajuste.tipo_ajuste === 'AUMENTO' ? 'completada' : 'cancelada'}`}>
                        {ajuste.tipo_ajuste}
                      </span>
                    </td>
                    <td>{ajuste.observaciones}</td>
                    <td>{ajuste.stock_nuevo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </>
  );
}