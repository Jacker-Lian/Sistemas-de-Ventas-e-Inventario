import React, { useState, useEffect } from 'react';

interface Producto {
  id_producto: number;
  nombre: string;
  stock: number;
  vendidos: number;
  stock_minimo: number;
  alerta_stock: 0 | 1;
}

const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
const ENDPOINT = `${API_URL}/api/stock/productos`;

const ControlStock: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const res = await fetch(ENDPOINT);
      const data = await res.json();
      if (data.success) setProductos(data.data);
      setCargando(false);
    };
    cargar();
  }, []);

  if (cargando) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1> Inventario por Producto</h1>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
        <thead>
          <tr style={{ background: "#f2f2f2" }}>
            <th style={th}>Producto</th>
            <th style={th}>Stock</th>
            <th style={th}>Vendidos</th>
          </tr>
        </thead>

        <tbody>
          {productos.map(p => (
            <tr key={p.id_producto} style={p.alerta_stock === 1 ? { backgroundColor: '#ffe6e6' } : {}}>
              <td style={td}>{p.nombre}</td>
              {/* Estilo para la celda de stock */}
              <td style={{ ...td, color: p.alerta_stock === 1 ? 'red' : 'inherit', fontWeight: p.alerta_stock === 1 ? 'bold' : 'normal' }}>
                {p.stock}
                {p.alerta_stock === 1 && ' '} 
              </td>
              <td style={td}>{p.vendidos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const th: React.CSSProperties = {
  padding: 10,
  borderBottom: "2px solid #ddd",
  textAlign: "left"
};

const td: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #eee"
};

export default ControlStock;
