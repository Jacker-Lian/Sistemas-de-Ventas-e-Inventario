import { useState, useEffect } from "react";
import "./GastoCard.css";
import { crearGasto } from "../../api/gastos";
import { useAuth } from "../../context/AuthContext";
import type { TipoGasto } from "../../types/gastos";

interface Props {
  tiposGasto: TipoGasto[];
  onClose: () => void;
  onCreated: () => void;
}

export default function GastoCreateCard({ tiposGasto, onClose, onCreated }: Props) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    descripcion: "",
    precio_unitario: "",
    cantidad: "1",
    impuesto: "",
    metodo_pago: "EFECTIVO",
    id_tipo_gasto: "",
  });

  const [costoTotal, setCostoTotal] = useState(0);

  // Calcular costo total (subtotal + IGV)
  useEffect(() => {
    const precio = Number(formData.precio_unitario) || 0;
    const cantidad = Number(formData.cantidad) || 0;
    const subtotal = precio * cantidad;
    const igvPorcentaje = Number(formData.impuesto) / 100;
    const igv = subtotal * igvPorcentaje;
    setCostoTotal(subtotal + igv);
  }, [formData.precio_unitario, formData.cantidad, formData.impuesto]);

  const handleChange = (field: string, value: any) => {
    // Validar que no se permitan valores negativos
    if (["precio_unitario", "cantidad", "impuesto"].includes(field)) {
      const numValue = Number(value);
      if (numValue < 0) {
        return;
      }
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (
      !formData.descripcion ||
      !formData.precio_unitario ||
      !formData.cantidad ||
      !formData.id_tipo_gasto
    ) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }

    if (!user?.id_usuario) {
      alert("Error: no se encontró el usuario logueado.");
      return;
    }

    try {
      const payload = {
        descripcion: formData.descripcion,
        monto: costoTotal,
        metodo_pago: formData.metodo_pago,
        id_tipo_gasto: Number(formData.id_tipo_gasto),
        id_usuario: user.id_usuario,
      };

      const res = await crearGasto(payload);

      if (!res?.success) {
        alert(res?.message || "No se pudo crear el gasto.");
        return;
      }

      const historial = JSON.parse(localStorage.getItem("historial_gastos") || "[]");
      historial.push({ ...payload, fecha: new Date().toISOString() });
      localStorage.setItem("historial_gastos", JSON.stringify(historial));

      onCreated();
      onClose();
    } catch (err: any) {
      alert("No se pudo crear el gasto. Inténtelo de nuevo.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Agregar un nuevo gasto</h2>

        {user && (
          <p style={{ fontSize: "0.9rem", color: "#555" }}>
            Usuario: <strong>{user.nombre_usuario}</strong>
          </p>
        )}

        <label>Descripción</label>
        <input
          type="text"
          value={formData.descripcion}
          onChange={(e) => handleChange("descripcion", e.target.value)}
        />

        <label>Precio Unitario</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={formData.precio_unitario}
          onChange={(e) => handleChange("precio_unitario", e.target.value)}
        />

        <div className="fila-doble">
          <div className="campo">
            <label>Cantidad</label>
            <input
              type="number"
              min="1"
              step="1"
              value={formData.cantidad}
              onChange={(e) => handleChange("cantidad", e.target.value)}
            />
          </div>
          <div className="campo">
            <label>Impuesto (%)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.impuesto}
              onChange={(e) => handleChange("impuesto", e.target.value)}
            />
          </div>
        </div>

        <label>Tipo de Gasto</label>
        <select
          value={formData.id_tipo_gasto}
          onChange={(e) => handleChange("id_tipo_gasto", e.target.value)}
        >
          <option value="">-- SELECCIONA --</option>
          {tiposGasto.map((t) => (
            <option key={t.id_tipo_gasto} value={t.id_tipo_gasto}>
              {t.nombre}
            </option>
          ))}
        </select>

        <label>Método de Pago</label>
        <select
          value={formData.metodo_pago}
          onChange={(e) => handleChange("metodo_pago", e.target.value)}
        >
          <option value="EFECTIVO">EFECTIVO</option>
          <option value="YAPE">YAPE</option>
          <option value="PLIN">PLIN</option>
          <option value="OTROS">OTROS</option>
        </select>

        {formData.precio_unitario && formData.cantidad && (
          <div className="resumen-costos">
            <p>
              Subtotal: S/{" "}
              {(Number(formData.precio_unitario) * Number(formData.cantidad)).toFixed(2)}
            </p>
            <p>
              IGV: S/{" "}
              {(
                Number(formData.precio_unitario) *
                Number(formData.cantidad) *
                (Number(formData.impuesto) / 100)
              ).toFixed(2)}
            </p>
            <hr />
            <p>
              <strong>Total: S/ {costoTotal.toFixed(2)}</strong>
            </p>
          </div>
        )}

        <div className="actions">
          <button className="guardar" onClick={handleSave}>
            Guardar
          </button>
          <button className="cerrar" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
