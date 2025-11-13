import React from "react";
import { AlertTriangle } from "lucide-react";

interface AlertaStockProps {
  stock: number;
  children: React.ReactNode;
}

const AlertaStock: React.FC<AlertaStockProps> = ({ stock, children }) => {
  const esBajo = stock <= 5;

  return (
    <tr
      style={{
        backgroundColor: esBajo ? "#ffe5e5" : "transparent",
        transition: "background 0.3s ease",
      }}
    >
      <td style={{ width: "30px", textAlign: "center" }}>
        {esBajo && (
          <AlertTriangle
            size={18}
            color="#c0392b"
            aria-label={`Stock bajo (${stock})`}
          />
        )}
      </td>
      {children}
    </tr>
  );
};

export default AlertaStock;