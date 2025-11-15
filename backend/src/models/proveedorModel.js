const database = require('../config/database');

class ProveedorModel {
  constructor() {
    this.pool = database.getPool();
  }

  // obtener todos los proveedores activos
  async obtenerProveedores() {
    const query = `
      SELECT 
        id_proveedor, 
        nombre, 
        ruc, 
        telefono, 
        direccion, 
        correo, 
        producto_principal
      FROM proveedor 
      WHERE estado = 1 
      ORDER BY nombre
    `;
    const [rows] = await this.pool.query(query);
    return rows;
  }

  // buscar proveedores 
  async buscarProveedores(query) {
    const sql = `
      SELECT 
        id_proveedor,
        nombre,
        ruc,
        telefono,
        direccion,
        correo,
        producto_principal
      FROM proveedor
      WHERE estado = 1
        AND (
          nombre LIKE ? OR
          ruc LIKE ? OR
          telefono LIKE ? OR
          direccion LIKE ? OR
          correo LIKE ? OR
          producto_principal LIKE ?
        )
      ORDER BY nombre
    `;

    const like = `%${query}%`;
    const params = [like, like, like, like, like, like];

    const [rows] = await this.pool.query(sql, params);
    return rows;
  }

  // obtener proveedor por ID
  async obtenerProveedorPorId(id) {
    const query = `
      SELECT 
        id_proveedor, 
        nombre, 
        ruc, 
        telefono, 
        direccion, 
        correo, 
        producto_principal
      FROM proveedor 
      WHERE id_proveedor = ? AND estado = 1
    `;
    const [rows] = await this.pool.query(query, [id]);
    return rows[0];
  }

  // crear nuevo proveedor
  async crearProveedor(proveedorData) {
    const query = `
      INSERT INTO proveedor (
        nombre, 
        ruc, 
        telefono, 
        direccion, 
        correo, 
        producto_principal
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await this.pool.query(query, [
      proveedorData.nombre,
      proveedorData.ruc || null,
      proveedorData.telefono || null,
      proveedorData.direccion || null,
      proveedorData.correo || null,
      proveedorData.producto_principal || null
    ]);
    return result.insertId;
  }

  // actualizar proveedor
  async actualizarProveedor(id, proveedorData) {
    const query = `
      UPDATE proveedor 
      SET 
        nombre = ?, 
        ruc = ?, 
        telefono = ?, 
        direccion = ?, 
        correo = ?, 
        producto_principal = ?
      WHERE id_proveedor = ? AND estado = 1
    `;
    const [result] = await this.pool.query(query, [
      proveedorData.nombre,
      proveedorData.ruc || null,
      proveedorData.telefono || null,
      proveedorData.direccion || null,
      proveedorData.correo || null,
      proveedorData.producto_principal || null,
      id
    ]);

    return result.affectedRows > 0;
  }

  // desactivar proveedor
  async desactivarProveedor(id) {
    const query = `
      UPDATE proveedor 
      SET estado = 0 
      WHERE id_proveedor = ?
    `;
    const [result] = await this.pool.query(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = ProveedorModel;
