import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import './AlertasInventario.css';

interface AlertaStockProps {
  stock: number;
  children: React.ReactNode;
}

export default function AlertaStock({ stock, children }: AlertaStockProps) {
  const esBajo = stock <= 5;

  return (
    <tr className={`alert-row ${esBajo ? 'alert-row--bajo' : ''}`}>
      {/* Columna del ícono de alerta */}
      <td style={{ width: "40px", textAlign: "center" }}>
        {esBajo && (
          <div className="alert-group">
            <ExclamationTriangleIcon width={18} height={18} style={{ color: '#b91c1c' }} />
            {/* Tooltip */}
            <span className="alert-tooltip">Stock bajo: {stock} unidades</span>
          </div>
        )}
      </td>

      {/* Contenido normal de la fila */}
      {children}
    </tr>
  );
}