import conexion from "../db.js";

export const ProductoModel = {
  obtenerTodos: (callback) => {
    conexion.query("SELECT * FROM producto ORDER BY id DESC", callback);
  },

  obtenerPorId: (id, callback) => {
    conexion.query("SELECT * FROM producto WHERE id = ?", [id], callback);
  },

  crear: (data, callback) => {
    const { nombre, precio_venta } = data;
    conexion.query(
      "INSERT INTO producto (nombre, precio_venta) VALUES (?, ?)",
      [nombre, precio_venta],
      callback
    );
  },

  actualizar: (id, data, callback) => {
    const { nombre, precio_venta } = data;
    conexion.query(
      "UPDATE producto SET nombre = ?, precio_venta = ? WHERE id = ?",
      [nombre, precio_venta, id],
      callback
    );
  },

  eliminar: (id, callback) => {
    conexion.query("DELETE FROM producto WHERE id = ?", [id], callback);
  },
};

module.exports = ProductoModel;