import React from "react";

interface BotonesCRUDProps {
  modoEdicion: boolean; 
  onGuardar: () => void;
  onCancelar: () => void;
  onActualizarLista: () => void;
  onNuevo?: () => void; 
}

const BotonesCRUD: React.FC<BotonesCRUDProps> = ({
  modoEdicion,
  onGuardar,
  onCancelar,
  onActualizarLista,
  onNuevo,
}) => {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {onNuevo && (
        <button className="btn" onClick={onNuevo} type="button">
          Nuevo
        </button>
      )}

      <button className="btn primary" onClick={onGuardar} type="button">
        {modoEdicion ? "Actualizar" : "Guardar"}
      </button>

      <button className="btn" onClick={onCancelar} type="button">
        Cancelar
      </button>

      <button className="btn" onClick={onActualizarLista} type="button">
        Actualizar lista
      </button>
    </div>
  );
};

export default BotonesCRUD;
