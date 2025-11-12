import { useState, useEffect } from "react";
import "./GastoCard.css";
import { actualizarGasto, eliminarGasto } from "../../api/gastos";
import type { Gasto, TipoGasto } from "../../types/gastos";

interface Props {
  gasto: Gasto;
  tiposGasto: TipoGasto[];
  onClose: () => void;
  onUpdated: () => void;
  onDeleted: () => void;
}

export default function GastoCard({ gasto, tiposGasto, onClose, onUpdated, onDeleted }: Props) {
  const [editData, setEditData] = useState({
    descripcion: gasto.descripcion,
    monto: gasto.monto,
    metodo_pago: gasto.metodo_pago,
    id_tipo_gasto: gasto.id_tipo_gasto ?? "",
  });

  useEffect(() => {
    setEditData({
      descripcion: gasto.descripcion,
      monto: gasto.monto,
      metodo_pago: gasto.metodo_pago,
      id_tipo_gasto: gasto.id_tipo_gasto ?? "",
    });
  }, [gasto]);

  const handleChange = (field: string, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        descripcion: editData.descripcion,
        monto: Number(editData.monto),
        metodo_pago: editData.metodo_pago,
        id_tipo_gasto: typeof editData.id_tipo_gasto === "number" ? editData.id_tipo_gasto : null,
      };
      await actualizarGasto(gasto.id_gasto, payload);
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Error guardando:", err);
      alert("No se pudo guardar los cambios.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Seguro quieres eliminar este gasto?")) return;
    try {
      await eliminarGasto(gasto.id_gasto);
      onDeleted();
      onClose();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Detalles del Gasto</h2>

        <p><strong>ID Gasto:</strong> {gasto.id_gasto}</p>
        <label>Descripción</label>
        <input
          type="text"
          value={editData.descripcion}
          onChange={(e) => handleChange("descripcion", e.target.value)}
        />
        <label>Monto</label>
        <input
          type="number"
          value={editData.monto}
          onChange={(e) => handleChange("monto", Number(e.target.value))}
        />
        <label>Tipo de Gasto</label>
        <select
          value={editData.id_tipo_gasto}
          onChange={(e) => handleChange("id_tipo_gasto", Number(e.target.value))}
        >
          <option value="">--SELECCIONA--</option>
          {tiposGasto.map((t) => (
            <option key={t.id_tipo_gasto} value={t.id_tipo_gasto}>
              {t.nombre}
            </option>
          ))}
        </select>
        <label>Método de Pago</label>
        <select
          value={editData.metodo_pago}
          onChange={(e) => handleChange("metodo_pago", e.target.value)}
        >
          <option value="EFECTIVO">EFECTIVO</option>
          <option value="YAPE">YAPE</option>
          <option value="PLIN">PLIN</option>
          <option value="OTROS">OTROS</option>
        </select>

        <hr />

        <p><strong>Usuario:</strong> {gasto.nombre_usuario ?? "—"}</p>
        <p><strong>Fecha Creación:</strong> {gasto.fecha_creacion ?? "—"}</p>
        <p><strong>Última Actualización:</strong> {gasto.fecha_actualizacion ?? "—"}</p>

        <div className="actions">
          <button className="guardar" onClick={handleSave}>Guardar</button>
          <button className="eliminar" onClick={handleDelete}>Eliminar</button>
          <button className="cerrar" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
