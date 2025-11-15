import React, { useState, useEffect, useCallback } from "react"; 
const Server = import.meta.env.Server || "http://38.250.161.15:3000";

// 1. Definición de Tipos (Interface)
interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string;
  estado: boolean; // TRUE = Activa, FALSE = Inactiva
}

interface EditCategoriaState {
  id_categoria: number;
  nombre: string;
  descripcion: string;
}

interface NuevaCategoriaState {
  nombre: string;
  descripcion: string;
}

interface CategoriaRaw {
  id_categoria: number;
  nombre: string;
  descripcion: string;
  estado: number | boolean | string | null | undefined; 
}
// Define los valores posibles para el filtro
type FilterState = 'ALL' | 'ACTIVE' | 'INACTIVE'; 
// --- Fin Interfaces ---

// Función auxiliar para obtener el mensaje de error de forma segura
const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    // Para manejar errores que no son instancias de Error (como objetos JSON del backend)
    if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
        return (error as { message: string }).message;
    }
    return "Error desconocido del servidor.";
};


export default function CrudCategorias() {
  const [busqueda, setBusqueda] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [editando, setEditando] = useState<EditCategoriaState | null>(null);
  
  const [nuevaCategoria, setNuevaCategoria] = useState<NuevaCategoriaState>({
    nombre: "",
    descripcion: "",
  });
  
  // ESTADO DEL FILTRO: Por defecto, mostrar solo Activas
  const [filter, setFilter] = useState<FilterState>('ACTIVE'); 

  // 2. Función para Cargar/Recargar Datos (GET)
  const buscarCategorias = useCallback(async () => {
    const trimmedBusqueda = busqueda.trim();
    setMensaje("Cargando...");

    try {
      let url = `${Server}/api/categorias`; // URL por defecto (Activas, sin búsqueda)

      // 🛑 LÓGICA CLAVE: Determinar la URL basada en la Búsqueda y el Filtro
      
      // 1. Si hay TÉRMINO DE BÚSQUEDA por nombre
      if (trimmedBusqueda) {
        const encodedBusqueda = encodeURIComponent(trimmedBusqueda);
        
        if (filter === 'ACTIVE') {
          // Ruta para buscar en ACTIVAS: /buscar/:nombre
          url = `${Server}/api/categorias/buscar/${encodedBusqueda}`;
        } else if (filter === 'INACTIVE') {
          // Ruta para buscar en INACTIVAS: /buscar/inactivas/:nombre
          url = `${Server}/api/categorias/buscar/inactivas/${encodedBusqueda}`;
        } else { // filter === 'ALL'
          // Ruta para buscar en TODAS: /buscar/all/:nombre
          url = `${Server}/api/categorias/buscar/all/${encodedBusqueda}`;
        }
      } 
      // 2. Si NO hay BÚSQUEDA por nombre (Solo Listado Filtrado por estado)
      else {
        if (filter === 'INACTIVE') {
          // Ruta para Listar SOLO INACTIVAS: /inactivas
          url = `${Server}/api/categorias/inactivas`;
        } else if (filter === 'ALL') {
          // Ruta para Listar TODAS: /all
          url = `${Server}/api/categorias/all`;
        }
        // Si filter === 'ACTIVE', la URL por defecto (`${Server}/api/categorias`) ya es correcta.
      }
      
      const res = await fetch(url);

      if (!res.ok) {
        if (res.status === 404) {
            setCategorias([]);
            // Mensaje de 404 más específico
            const filterLabel = filter === 'ACTIVE' ? 'activas' : filter === 'INACTIVE' ? 'inactivas' : 'disponibles';
            setMensaje(trimmedBusqueda 
                ? `No se encontraron coincidencias para "${trimmedBusqueda}" en categorías ${filterLabel.split(' ')[0]}.` 
                : `No hay categorías ${filterLabel} registradas.`);
            return;
        }
        // En caso de un error HTTP (ej. 500)
        const errorData = await res.json().catch(() => ({ message: `Error HTTP: ${res.status}` }));
        throw new Error(errorData.message || `Error HTTP: ${res.status}`);
      }

      const data = await res.json();
      const categoriasRaw: CategoriaRaw[] = Array.isArray(data) ? data : [];
      
      const categoriasNormalizadas: Categoria[] = categoriasRaw.map((c: CategoriaRaw) => ({
        id_categoria: Number(c.id_categoria),
        nombre: c.nombre ?? "",
        descripcion: c.descripcion ?? "",
        // Asume que 1/true es activo, 0/false es inactivo
        estado: c.estado === undefined || c.estado === null ? true : Boolean(Number(c.estado)), 
      }));

      setCategorias(categoriasNormalizadas);
      
      // Ajuste del mensaje de éxito
      const filterLabel = filter === 'ACTIVE' ? 'activas' : filter === 'INACTIVE' ? 'inactivas' : 'todas';
      setMensaje(
        categoriasNormalizadas.length && trimmedBusqueda 
        ? `Resultados de búsqueda para "${trimmedBusqueda}" (${filterLabel}).` 
        : categoriasNormalizadas.length 
        ? `Mostrando ${categoriasNormalizadas.length} categorías (${filterLabel}).`
        : `No hay categorías ${filterLabel} registradas.`
      );
      
    } catch (err) {
      console.error(err);
      setMensaje(getErrorMessage(err)); 
    }
  }, [busqueda, filter]); 
  
  useEffect(() => {
      buscarCategorias();
  }, [buscarCategorias]); 

  // 1. Función para CREAR nueva categoría (POST)
  const crearCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaCategoria.nombre.trim()) {
      setMensaje("El nombre de la nueva categoría es obligatorio.");
      return;
    }

    try {
      setMensaje("Creando categoría...");
      const payload = {
        nombre: String(nuevaCategoria.nombre).trim(),
        descripcion: String(nuevaCategoria.descripcion).trim(),
      };

      const res = await fetch(
        `${Server}/api/categorias/crear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `Error HTTP: ${res.status}` }));
        throw new Error(errorData.message || `Error del servidor al crear (${res.status})`);
      }

      const nueva = await res.json();

      setMensaje(`Categoría "${nueva.nombre}" creada con éxito.`);
      setNuevaCategoria({ nombre: "", descripcion: "" }); // Limpiar formulario
      buscarCategorias(); // Recargar la lista
    } catch (err) {
      console.error("Error de creación:", err);
      setMensaje(getErrorMessage(err)); 
    }
  };

  // 3. Guardar cambios de edición (PUT)
  const guardarCambios = async () => {
    if (!editando) return;
    if (!editando.nombre.trim()) {
      setMensaje("El nombre no puede estar vacío");
      return;
    }

    try {
      setMensaje("Guardando cambios...");
      const payload = {
        nombre: String(editando.nombre).trim(),
        descripcion: String(editando.descripcion).trim(),
      };

      const res = await fetch(
        `${Server}/api/categorias/actualizar/${editando.id_categoria}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `Error HTTP: ${res.status}` }));
        throw new Error(errorData.message || `Error del servidor (${res.status})`);
      }

      const data = await res.json();

      setMensaje(data.message || "Categoría actualizada correctamente");
      setEditando(null);
      buscarCategorias(); // Recargar para mostrar el cambio
    } catch (err) {
      console.error(err);
      setMensaje(getErrorMessage(err)); 
    }
  };
  
  // 4. Desactivar (Eliminación Lógica) (DELETE)
  const desactivarCategoria = async (id: number) => {
    const categoriaEncontrada = categorias.find(c => c.id_categoria === id);
    if (!categoriaEncontrada || !confirm(`¿Deseas marcar la categoría "${categoriaEncontrada.nombre}" como inactiva?`)) return;

    try {
      setMensaje("Desactivando categoría...");
      const res = await fetch(
        `${Server}/api/categorias/eliminar/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `Error HTTP: ${res.status}` }));
        throw new Error(errorData.message || `Error del servidor (${res.status})`);
      }

      const data = await res.json();

      setMensaje(data.message || "Categoría marcada como inactiva");
      buscarCategorias(); 
    } catch (err) {
      console.error(err);
      setMensaje(getErrorMessage(err)); 
    }
  };

  // 5. Función para REACTIVAR categoría (PUT)
  const reactivarCategoria = async (id: number) => {
    const categoriaEncontrada = categorias.find(c => c.id_categoria === id);
    if (!categoriaEncontrada || !confirm(`¿Deseas reactivar la categoría "${categoriaEncontrada.nombre}"?`)) return;

    try {
      setMensaje("Reactivando categoría...");
      // Ruta de reactivación implementada en el backend: /api/categorias/reactivar/:id 
      const res = await fetch(
        `${Server}/api/categorias/reactivar/${id}`, 
        {
          method: "PUT",
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `Error HTTP: ${res.status}` }));
        throw new Error(errorData.message || `Error del servidor (${res.status})`);
      }

      const data = await res.json();

      setMensaje(data.message || "Categoría reactivada correctamente");
      buscarCategorias(); 
    } catch (err) {
      console.error(err);
      setMensaje(getErrorMessage(err)); 
    }
  };


  // 6. Handlers tipados para inputs
  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setBusqueda(e.target.value);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEditando((prev) => 
          prev ? { ...prev, [name]: value } : prev
      );
  };
  
  const handleNuevaCategoriaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handler para el filtro de estado
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilter(e.target.value as FilterState);
      setBusqueda(""); // Limpiar búsqueda al cambiar el filtro para priorizar el filtro de estado
  };


  // 7. Renderizado (Se mantiene sin cambios)
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
        Gestión de Categorías
      </h1>
      <p style={{ textAlign: "center", marginBottom: "30px" }}>
        Crea, busca, edita, desactiva y reactiva categorías.
      </p>
      
      {/* Formulario de Creación */}
      <div
        style={{
          border: "1px dashed #333",
          padding: "20px",
          marginBottom: "30px",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3 style={{ marginTop: 0, borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
          ➕ Crear Nueva Categoría
        </h3>
        <form onSubmit={crearCategoria} style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre (obligatorio)"
              value={nuevaCategoria.nombre}
              onChange={handleNuevaCategoriaChange}
              required
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
            <input
              type="text"
              name="descripcion"
              placeholder="Descripción (opcional)"
              value={nuevaCategoria.descripcion}
              onChange={handleNuevaCategoriaChange}
              style={{
                flex: 2,
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              border: "2px solid #000",
              background: "#000",
              color: "#fff",
              fontWeight: "bold",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
          >
            Guardar Categoría
          </button>
        </form>
      </div>
      
      <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "30px 0" }} />


      {/* Barra de búsqueda y Filtro */}
      <div
        className="search-and-filter-bar"
        style={{
          display: "flex",
          justifyContent: "space-between", 
          gap: "10px",
          margin: "20px 0",
        }}
      >
        {/* Input de Búsqueda */}
        <input
          type="text"
          placeholder="Buscar categoría por nombre..."
          value={busqueda}
          onChange={handleBusquedaChange}
          style={{
            flexGrow: 1, 
            padding: "8px",
            border: "2px solid #000",
            borderRadius: "5px",
          }}
        />
        
        {/* Selector de Filtro */}
        <select
            value={filter}
            onChange={handleFilterChange}
            style={{
              width: "150px", 
              padding: "8px",
              border: "2px solid #000",
              borderRadius: "5px",
            }}
        >
            <option value="ACTIVE">Activas</option>
            <option value="INACTIVE">Inactivas</option>
            <option value="ALL">Todas</option>
        </select>
        
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
                  
                  {/* Nombre y Descripción */}
                  <td style={{ padding: "10px", border: "1px solid #000" }}>
                    {isEditing ? (
                      <input type="text" name="nombre" value={editando?.nombre || ""} onChange={handleEditChange} style={{ border: "1px solid #000", padding: "4px", width: "100%", }} />
                    ) : (
                      c.nombre
                    )}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #000" }}>
                    {isEditing ? (
                      <input type="text" name="descripcion" value={editando?.descripcion || ""} onChange={handleEditChange} style={{ border: "1px solid #000", padding: "4px", width: "100%", }} />
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
                    {isEditing ? (
                      <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                        <button onClick={guardarCambios} style={{ border: "2px solid #000", background: "#000", color: "#fff", fontWeight: "bold", padding: "6px 10px", borderRadius: "5px", cursor: "pointer", }} title="Guardar">Guardar</button>
                        <button onClick={() => setEditando(null)} style={{ border: "2px solid #000", background: "#fff", color: "#000", fontWeight: "bold", padding: "6px 10px", borderRadius: "5px", cursor: "pointer", }} title="Cancelar edición">Cancelar</button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                        {isInactive ? (
                          // 🟢 Mostrar botón REACTIVAR si está Inactiva
                          <button
                            onClick={() => reactivarCategoria(c.id_categoria)}
                            style={{
                              border: "2px solid #000",
                              background: "#d4edda", // Fondo ligeramente verde
                              color: "#000",
                              fontWeight: "bold",
                              padding: "6px 10px",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                            title="Reactivar categoría"
                          >
                            Reactivar
                          </button>
                        ) : (
                          // ✏️🗑️ Mostrar botones EDITAR y DESACTIVAR si está Activa
                          <>
                            <button
                              onClick={() => setEditando(c)}
                              style={{ border: "2px solid #000", background: "transparent", color: "#000", fontWeight: "bold", padding: "6px 10px", borderRadius: "5px", cursor: "pointer", }} title="Editar categoría"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => desactivarCategoria(c.id_categoria)}
                              style={{ border: "2px solid #000", background: "#fff", color: "#000", fontWeight: "bold", padding: "6px 10px", borderRadius: "5px", cursor: "pointer", }} title="Marcar como inactiva"
                            >
                              Inactivar
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", color: "#999", padding: "12px", }}>
                Sin resultados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}