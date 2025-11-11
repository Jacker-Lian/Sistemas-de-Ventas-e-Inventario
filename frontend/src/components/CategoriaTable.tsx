import React, { useState, useEffect, useCallback } from "react"; 

// 1. Definición de Tipos (Interface)
interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string;
  estado: boolean; // TRUE = Activa, FALSE = Inactiva
}

// Interfaz para los datos que se pueden editar
interface EditCategoriaState {
  id_categoria: number;
  nombre: string;
  descripcion: string;
}

// INTERFAZ AGREGADA para tipificar los datos tal como vienen de la API (RAW)
interface CategoriaRaw {
  id_categoria: number;
  nombre: string;
  descripcion: string;
  estado: number | boolean | string | null | undefined; 
}

export default function CrudCategorias() {
  const [busqueda, setBusqueda] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [editando, setEditando] = useState<EditCategoriaState | null>(null);

  // 🎯 DEFINICIÓN CONSISTENTE DE LA URL BASE (Usaremos esto en todas las llamadas)
  const BASE_URL = "http://localhost:3000"; // Ajusta según tu configuración

  // 2. Función para Cargar/Recargar Datos (Estabilizada con useCallback)
  const buscarCategorias = useCallback(async () => {
    const trimmedBusqueda = busqueda.trim();
    setMensaje("Cargando...");

    try {
      // ✅ Usa BASE_URL: Construir la URL: /api/categorias o /api/categorias/buscar/:nombre
      const url = trimmedBusqueda
        ? `${BASE_URL}/api/categorias/buscar/${encodeURIComponent(trimmedBusqueda)}`
        : `${BASE_URL}/api/categorias`;

      const res = await fetch(url);

      // ✅ Manejar 404: Si el backend envía 404 (lista vacía o no encontrada)
      if (res.status === 404) {
        setCategorias([]);
        setMensaje(trimmedBusqueda 
            ? `No se encontraron coincidencias para "${trimmedBusqueda}"` 
            : "No hay categorías disponibles."); 
        return;
      }
      
      if (!res.ok) {
        // Lanza el error si es 500, 401, etc.
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();

      const categoriasRaw: CategoriaRaw[] = Array.isArray(data) ? data : [];
      
      const categoriasNormalizadas: Categoria[] = categoriasRaw.map((c: CategoriaRaw) => ({
        id_categoria: Number(c.id_categoria),
        nombre: c.nombre ?? "",
        descripcion: c.descripcion ?? "",
        // Conversión robusta: asume 'estado' es 1 o 0, o ya es booleano
        estado: c.estado === undefined || c.estado === null ? true : Boolean(Number(c.estado)),
      }));

      // Actualizar estado
      setCategorias(categoriasNormalizadas);
      setMensaje(
        categoriasNormalizadas.length && trimmedBusqueda ? `Resultados para "${trimmedBusqueda}"` : ""
      );
      if (!categoriasNormalizadas.length && !trimmedBusqueda) {
          setMensaje("No hay categorías activas registradas.");
      }
      
    } catch (err) {
      console.error(err);
      setMensaje("Error al buscar categorías");
    }
  // 🚨 Dependencia de useCallback: solo busqueda cambia.
  }, [busqueda]); 
  
  // Cargar datos al montar el componente
  useEffect(() => {
      buscarCategorias();
  }, [buscarCategorias]); 

  // 3. ✍️ Guardar cambios de edición (PUT)
  const guardarCambios = async () => {
    if (!editando) return;
    if (!editando.nombre.trim()) {
      setMensaje("El nombre no puede estar vacío");
      return;
    }

    try {
      // Validar datos antes de enviar
      const payload = {
        nombre: String(editando.nombre).trim(),
        descripcion: String(editando.descripcion).trim(),
      };

      // ✅ Usa BASE_URL
      const res = await fetch(
        `${BASE_URL}/api/categorias/actualizar/${editando.id_categoria}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error(`Error del servidor (${res.status})`);
      }

      const data = await res.json();

      setMensaje(data.message || "Categoría actualizada correctamente");
      setEditando(null);
      buscarCategorias(); // Recargar para mostrar el cambio
    } catch (err) {
      console.error(err);
      setMensaje("Error al actualizar la categoría");
    }
  };
  
  // 4. 🗑️ Desactivar (Eliminación Lógica) (DELETE)
  const desactivarCategoria = async (id: number) => {
    const categoriaEncontrada = categorias.find(c => c.id_categoria === id);
    if (!categoriaEncontrada || !confirm(`¿Deseas marcar la categoría "${categoriaEncontrada.nombre}" como inactiva?`)) return;

    try {
      // ✅ Usa BASE_URL
      const res = await fetch(
        `${BASE_URL}/api/categorias/eliminar/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error(`Error del servidor (${res.status})`);
      }

      const data = await res.json();

      setMensaje(data.message || "Categoría marcada como inactiva");
      buscarCategorias(); // Recargar la lista (que filtra por estado=TRUE)
    } catch (err) {
      console.error(err);
      setMensaje("Error al cambiar el estado de la categoría");
    }
  };

  // 5. Handlers tipados para inputs
  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setBusqueda(e.target.value);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEditando((prev) => 
          prev ? { ...prev, [name]: value } : prev
      );
  };

  // 6. 🖼️ Renderizado
  return (
    <div
      className="crud-container"
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        border: "2px solid #000",
        borderRadius: "10px",
        backgroundColor: "#fff",
        color: "#000",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "10px",
        }}
      >
        Gestion de Categorías
      </h1>
      <p style={{ textAlign: "center", marginBottom: "30px" }}>
        Busca, edita o marca categorías como inactivas.
      </p>

      {/* Barra de búsqueda */}
      <div
        className="search-bar"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          margin: "20px 0",
        }}
      >
        <input
          type="text"
          placeholder="Buscar categoría por nombre..."
          value={busqueda}
          onChange={handleBusquedaChange}
          style={{
            width: "60%",
            padding: "8px",
            border: "2px solid #000",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={buscarCategorias}
          style={{
            padding: "8px 16px",
            border: "2px solid #000",
            background: "#000",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Buscar
        </button>
      </div>

      <p
        className="status"
        style={{ textAlign: "center", fontStyle: "italic", color: "#555" }}
      >
        {mensaje}
      </p>

      {/* Tabla de resultados */}
      <table
        className="tabla-productos"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
          border: "1px solid #000",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#000",
              color: "#fff",
              textTransform: "uppercase",
            }}
          >
            <th style={{ padding: "10px", border: "1px solid #000" }}>ID</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Nombre</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Descripción</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Estado</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length > 0 ? (
            categorias.map((c) => {
              const isInactive = !c.estado;
              const isEditing = editando?.id_categoria === c.id_categoria;
              
              return (
                <tr
                  key={c.id_categoria}
                  style={{
                    opacity: isInactive ? 0.6 : 1,
                    textDecoration: isInactive ? "line-through" : "none",
                  }}
                >
                  <td style={{ padding: "10px", border: "1px solid #000" }}>{c.id_categoria}</td>
                  
                  {/* Nombre */}
                  <td style={{ padding: "10px", border: "1px solid #000" }}>
                    {isEditing ? (
                      <input
                        type="text"
                        name="nombre"
                        value={editando?.nombre || ""}
                        onChange={handleEditChange}
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          width: "100%",
                        }}
                      />
                    ) : (
                      c.nombre
                    )}
                  </td>
                  
                  {/* Descripción */}
                  <td style={{ padding: "10px", border: "1px solid #000" }}>
                    {isEditing ? (
                      <input
                        type="text"
                        name="descripcion"
                        value={editando?.descripcion || ""}
                        onChange={handleEditChange}
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          width: "100%",
                        }}
                      />
                    ) : (
                      c.descripcion
                    )}
                  </td>
                  
                  {/* Estado */}
                  <td style={{ padding: "10px", border: "1px solid #000" }}>
                    {isInactive ? "Inactiva" : "Activa"}
                  </td>
                  
                  {/* Acciones */}
                  <td style={{ padding: "10px", border: "1px solid #000" }}>
                    {!isInactive && (
                      <>
                        {isEditing ? (
                          <div
                            style={{
                              display: "flex",
                              gap: "6px",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              onClick={guardarCambios}
                              style={{
                                border: "2px solid #000",
                                background: "#000",
                                color: "#fff",
                                fontWeight: "bold",
                                padding: "6px 10px",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                              title="Guardar"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditando(null)}
                              style={{
                                border: "2px solid #000",
                                background: "#fff",
                                color: "#000",
                                fontWeight: "bold",
                                padding: "6px 10px",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                              title="Cancelar edición"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              gap: "6px",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              onClick={() => setEditando(c)}
                              style={{
                                border: "2px solid #000",
                                background: "transparent",
                                color: "#000",
                                fontWeight: "bold",
                                padding: "6px 10px",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                              title="Editar categoría"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => desactivarCategoria(c.id_categoria)}
                              style={{
                                border: "2px solid #000",
                                background: "#fff",
                                color: "#000",
                                fontWeight: "bold",
                                padding: "6px 10px",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                              title="Marcar como inactiva"
                            >
                              Inactivar
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={5} // Colspan ajustado para 5 columnas
                style={{
                  textAlign: "center",
                  color: "#999",
                  padding: "12px",
                }}
              >
                Sin resultados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}