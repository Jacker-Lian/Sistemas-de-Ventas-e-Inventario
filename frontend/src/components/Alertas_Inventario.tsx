import React from "react";
import { AlertTriangle } from "lucide-react"; // npm install lucide-react

interface AlertaStockProps {
  stock: number;
  children: React.ReactNode;
}

export default function AlertaStock({ stock, children }: AlertaStockProps) {
  const esBajo = stock <= 5;

  return (
    <tr
      className={`transition-all duration-200 ${
        esBajo ? "bg-red-100 hover:bg-red-200 relative" : ""
      }`}
    >
      {/* Columna del ícono de alerta */}
      <td style={{ width: "40px", textAlign: "center" }}>
        {esBajo && (
          <div className="group relative flex justify-center items-center">
            <AlertTriangle
              size={18}
              color="#b91c1c"
              className="cursor-pointer"
            />
            {/* Tooltip */}
            <span className="absolute left-6 top-1/2 -translate-y-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Stock bajo: {stock} unidades
            </span>
          </div>
        )}
      </td>

      {/* Contenido normal de la fila */}
      {children}
    </tr>
  );
}
