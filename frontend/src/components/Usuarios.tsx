import React, { useState, useEffect, useCallback } from "react";

const Server = (import.meta as any).env?.Server || (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";

interface UsuarioRaw {
  id_usuario: number;
  nombre_usuario: string;
  email_usuario: string;
  rol_usuario: string;
  estado: number | boolean | string | null | undefined;
  fecha_creacion?: string;
}

interface EditUsuarioState {
  id_usuario: number;
  nombre_usuario: string;
  email_usuario: string;
}

export default function Usuarios() {
  const [busqueda, setBusqueda] = useState("");
  const [usuarios, setUsuarios] = useState<UsuarioRaw[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [editando, setEditando] = useState<EditUsuarioState | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [cNombre, setCNombre] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [cRol, setCRol] = useState("CAJA");

  const buscarUsuarios = useCallback(async () => {
    const q = busqueda.trim();
    setMensaje("Cargando...");
    try {
      const url = q ? `${Server}/api/usuario/buscar/${encodeURIComponent(q)}` : `${Server}/api/usuario`;
      const res = await fetch(url);
      if (res.status === 404) {
        setUsuarios([]);
        setMensaje(q ? `No se encontraron coincidencias para "${q}"` : "No hay usuarios disponibles.");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const arr: UsuarioRaw[] = Array.isArray(data) ? data : data.users ?? [];
      const normalized = arr.map((u) => ({
        id_usuario: Number(u.id_usuario),
        nombre_usuario: u.nombre_usuario ?? "",
        email_usuario: u.email_usuario ?? "",
        rol_usuario: u.rol_usuario ?? "CAJA",
        estado: u.estado === undefined || u.estado === null ? 1 : Number(u.estado),
        fecha_creacion: u.fecha_creacion,
      }));
      setUsuarios(normalized);
      setMensaje(normalized.length && q ? `Resultados para "${q}"` : "");
      if (!normalized.length && !q) setMensaje("No hay usuarios registrados.");
    } catch (err) {
      console.error(err);
      setMensaje("Error al obtener usuarios");
    }
  }, [busqueda]);

  useEffect(() => {
    buscarUsuarios();
  }, [buscarUsuarios]);

  const guardarCambios = async () => {
    if (!editando) return;
    if (!editando.nombre_usuario.trim()) {
      setMensaje("El nombre no puede estar vacío");
      return;
    }
    try {
      const payload = {
        nombre_usuario: String(editando.nombre_usuario).trim(),
        email_usuario: String(editando.email_usuario).trim(),
      };
      const res = await fetch(`${Server}/api/usuario/${editando.id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMensaje(data.message || "Usuario actualizado");
      setEditando(null);
      buscarUsuarios();
    } catch (err) {
      console.error(err);
      setMensaje("Error al actualizar usuario");
    }
  };

  const desactivarUsuario = async (id: number) => {
    const u = usuarios.find((x) => x.id_usuario === id);
    if (!u || !confirm(`¿Deseas desactivar a "${u.nombre_usuario}"?`)) return;
    try {
      const res = await fetch(`${Server}/api/usuario/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMensaje(data.message || "Usuario desactivado");
      buscarUsuarios();
    } catch (err) {
      console.error(err);
      setMensaje("Error al desactivar usuario");
    }
  };

  // Selección para eliminación masiva
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const selectAll = () => {
    if (selectedIds.length === usuarios.length) setSelectedIds([]);
    else setSelectedIds(usuarios.map((u) => u.id_usuario));
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return alert('Selecciona al menos un usuario');
    if (!confirm(`¿Desactivar los ${selectedIds.length} usuarios seleccionados?`)) return;
    try {
      for (const id of selectedIds) {
        const res = await fetch(`${Server}/api/usuario/${id}`, { method: 'DELETE' });
        if (!res.ok) console.error('Error al eliminar', id);
      }
      setMensaje(`${selectedIds.length} usuario(s) desactivado(s)`);
      setSelectedIds([]);
      buscarUsuarios();
    } catch (err) {
      console.error(err);
      setMensaje('Error al eliminar usuarios');
    }
  };

  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cNombre.trim() || !cEmail.trim() || !cPassword.trim()) {
      setMensaje('Nombre, email y contraseña son requeridos');
      return;
    }
    try {
      const payload = { nombre_usuario: cNombre.trim(), email_usuario: cEmail.trim(), password: cPassword, rol_usuario: cRol };
      const res = await fetch(`${Server}/api/usuario/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMensaje(data.message || 'Usuario creado');
  setShowCreate(false);
  setCNombre(''); setCEmail(''); setCPassword(''); setCRol('CAJA');
      buscarUsuarios();
    } catch (err) {
      console.error(err);
      setMensaje('Error al crear usuario');
    }
  };

  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => setBusqueda(e.target.value);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditando((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  return (
    <div
      className="crud-container"
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        maxWidth: "1000px",
        margin: "24px auto",
        padding: "18px",
        border: "1px solid #000",
        borderRadius: "8px",
        backgroundColor: "#fff",
        color: "#000",
      }}
    >
      <h1 style={{ textAlign: "center", textTransform: "uppercase", marginBottom: 8 }}>Gestión de Usuarios</h1>
      <p style={{ textAlign: "center", marginBottom: 18 }}>Busca, edita o desactiva usuarios.</p>

      <div style={{ display: "flex", justifyContent: "center", gap: 10, margin: "10px 0" }}>
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={busqueda}
          onChange={handleBusquedaChange}
          style={{ width: "60%", padding: 8, border: "1px solid #000", borderRadius: 6 }}
        />
      </div>

      <p style={{ textAlign: "center", fontStyle: "italic", color: "#555" }}>{mensaje}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <div>
          <button title="Nuevo usuario" onClick={() => setShowCreate(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, border: '2px solid #000', background: '#fff', cursor: 'pointer' }}>
            {/* plus icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Nuevo
          </button>
        </div>
        <div>
          <button title="Eliminar seleccionados" onClick={handleBulkDelete} disabled={selectedIds.length === 0} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, border: selectedIds.length ? '2px solid crimson' : '2px solid #ddd', background: selectedIds.length ? '#fff' : '#f7f7f7', cursor: selectedIds.length ? 'pointer' : 'not-allowed', color: 'crimson' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M8 6v13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="crimson" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, border: "1px solid #000" }}>
        <thead>
          <tr style={{ background: "#000", color: "#fff", textTransform: "uppercase" }}>
            <th style={{ padding: 10, border: "1px solid #000" }}>
              <input type="checkbox" onChange={selectAll} checked={selectedIds.length === usuarios.length && usuarios.length > 0} />
            </th>
            <th style={{ padding: 10, border: "1px solid #000" }}>ID</th>
            <th style={{ padding: 10, border: "1px solid #000" }}>Nombre</th>
            <th style={{ padding: 10, border: "1px solid #000" }}>Email</th>
            <th style={{ padding: 10, border: "1px solid #000" }}>Rol</th>
            <th style={{ padding: 10, border: "1px solid #000" }}>Estado</th>
            <th style={{ padding: 10, border: "1px solid #000" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
                usuarios.map((u) => {
              const isInactive = Number(u.estado) === 0;
              const isEditing = editando?.id_usuario === u.id_usuario;
              return (
                <tr key={u.id_usuario} style={{ opacity: isInactive ? 0.6 : 1, textDecoration: isInactive ? "line-through" : "none" }}>
                  <td style={{ padding: 10, border: "1px solid #000", textAlign: 'center' }}>
                    <input type="checkbox" checked={selectedIds.includes(u.id_usuario)} onChange={() => toggleSelect(u.id_usuario)} />
                  </td>
                  <td style={{ padding: 10, border: "1px solid #000" }}>{u.id_usuario}</td>
                  <td style={{ padding: 10, border: "1px solid #000" }}>
                    {isEditing ? (
                      <input name="nombre_usuario" value={editando?.nombre_usuario || ""} onChange={handleEditChange} style={{ width: "100%", padding: 6, border: "1px solid #000" }} />
                    ) : (
                      u.nombre_usuario
                    )}
                  </td>
                  <td style={{ padding: 10, border: "1px solid #000" }}>
                    {isEditing ? (
                      <input name="email_usuario" value={editando?.email_usuario || ""} onChange={handleEditChange} style={{ width: "100%", padding: 6, border: "1px solid #000" }} />
                    ) : (
                      u.email_usuario
                    )}
                  </td>
                  <td style={{ padding: 10, border: "1px solid #000" }}>{u.rol_usuario}</td>
                  <td style={{ padding: 10, border: "1px solid #000" }}>{isInactive ? "Inactivo" : "Activo"}</td>
                  <td style={{ padding: 10, border: "1px solid #000", textAlign: "center" }}>
                    {!isInactive && (
                      isEditing ? (
                        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                          <button onClick={guardarCambios} style={{ border: "2px solid #000", background: "#000", color: "#fff", padding: "6px 10px", borderRadius: 6 }}>Guardar</button>
                          <button onClick={() => setEditando(null)} style={{ border: "2px solid #000", background: "#fff", color: "#000", padding: "6px 10px", borderRadius: 6 }}>Cancelar</button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: 'center' }}>
                          <button title="Editar" onClick={() => setEditando({ id_usuario: u.id_usuario, nombre_usuario: u.nombre_usuario, email_usuario: u.email_usuario })} style={{ border: "none", background: "transparent", color: "#000", padding: "6px", borderRadius: 6, cursor: 'pointer' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21l3-1 11-11 1-3-3 1L4 20z" stroke="#000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                          <button title="Eliminar / Desactivar" onClick={() => desactivarUsuario(u.id_usuario)} style={{ border: "none", background: "transparent", color: "crimson", padding: "6px", borderRadius: 6, cursor: 'pointer' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M8 6v13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="crimson" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                        </div>
                      )
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", color: "#999", padding: 12 }}>Sin resultados</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Create modal */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '1rem', borderRadius: 8, width: 520, maxWidth: '95%', color: '#000' }}>
            <h3>Nuevo usuario</h3>
            <form onSubmit={handleCreate}>
              <label style={{ display: 'block', marginBottom: 8 }}>Nombre
                <input value={cNombre} onChange={(e) => setCNombre(e.target.value)} required style={{ width: '100%', padding: 6, border: '1px solid #000' }} />
              </label>
              <label style={{ display: 'block', marginBottom: 8 }}>Email
                <input type="email" value={cEmail} onChange={(e) => setCEmail(e.target.value)} required style={{ width: '100%', padding: 6, border: '1px solid #000' }} />
              </label>
              <label style={{ display: 'block', marginBottom: 8 }}>Contraseña
                <input type="password" value={cPassword} onChange={(e) => setCPassword(e.target.value)} required style={{ width: '100%', padding: 6, border: '1px solid #000' }} />
              </label>
              <label style={{ display: 'block', marginBottom: 8 }}>Rol
                <select value={cRol} onChange={(e) => setCRol(e.target.value)} style={{ width: '100%', padding: 6, border: '1px solid #000' }}>
                  <option value="CAJA">Caja</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </label>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button type="submit" className="btn-primary" style={{ padding: '8px 14px' }}>Crear</button>
                <button type="button" onClick={() => setShowCreate(false)} style={{ padding: '8px 14px' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
