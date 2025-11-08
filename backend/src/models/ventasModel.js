const database = require("../config/database");

class VentasModel {
  constructor() {
    this.table = "ventas";
  }

  // Registrar una nueva venta
  async registrarVenta(ventaData, connection) {
    try {
      const db= connection || database.getPool();

      // Verificar que id_usuario exista en la tabla usuarios
      const [usuarioRows] = await db.query(
        "SELECT id_usuario FROM usuarios WHERE id_usuario = ?",
        [ventaData.id_usuario]
      );
      if (usuarioRows.length === 0) {
        throw new Error("El usuario no existe o está inactivo.");
      }

      // Verificar que id_caja exista en la tabla cajas
      const [cajaRows] = await db.query(
        "SELECT id_caja FROM caja WHERE id_caja = ?",
        [ventaData.id_caja]
      );
      if (cajaRows.length === 0)
        throw new Error("El id_caja no existe en la tabla cajas.");

      // Insertar la nueva venta
      const [result] = await db.query(
        `INSERT INTO ${this.table} (
                    id_usuario,
                    id_caja,
                    tipo_cliente,
                    metodo_pago,
                    total,
                    estado_venta
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          ventaData.id_usuario,
          ventaData.id_caja,
          id_sucursal,
          ventaData.tipo_cliente,
          ventaData.metodo_pago,
          ventaData.total,
          ventaData.estado_venta || "PENDIENTE"
        ]
      );

      const id_venta = resultVenta.insertId;

      // 7. Insertar detalles de venta y actualizar stock
      for (const producto of productosValidados) {
        // Insertar detalle de venta
        await connection.query(
          `INSERT INTO detalle_venta (
            id_venta,
            id_producto,
            cantidad,
            precio_unitario,
            subtotal
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            id_venta,
            producto.id_producto,
            producto.cantidad,
            producto.precio_unitario,
            producto.subtotal,
          ]
        );

        // Actualizar stock del producto
        await connection.query(
          "UPDATE producto SET stock = stock - ? WHERE id_producto = ?",
          [producto.cantidad, producto.id_producto]
        );
      }

      // 8. Actualizar ingresos de la caja
      await connection.query(
        "UPDATE caja SET total_ingresos = total_ingresos + ? WHERE id_caja = ?",
        [totalVenta, ventaData.id_caja]
      );

      // Confirmar transacción
      await connection.commit();

      return {
        id_venta: id_venta,
        total: totalVenta,
        productos_registrados: productosValidados.length,
      };
    } catch (error) {
      // Revertir transacción en caso de error
      await connection.rollback();
      throw new Error("Error al registrar venta: " + error.message);
    } finally {
      // Liberar conexión
      connection.release();
    }
  }

  // Cancelar una venta
  async cancelarVenta(id_venta, id_motivo_cancelacion) {
    try {
      const pool = database.getPool();

      // Verificar que la venta exista
      const [ventaRows] = await pool.query(
        `SELECT id_venta FROM ${this.table} WHERE id_venta = ?`,
        [id_venta]
      );
      if (ventaRows.length === 0)
        throw new Error("La venta con el id proporcionado no existe.");

      // Verificar que el motivo de cancelación exista
      const [motivoRows] = await pool.query(
        "SELECT id_motivo_cancelacion FROM motivos_cancelacion WHERE id_motivo_cancelacion = ?",
        [id_motivo_cancelacion]
      );
      if (motivoRows.length === 0)
        throw new Error("El motivo de cancelación no existe.");

      // Actualizar la venta con el estado "CANCELADA" y el id_motivo_cancelacion
      await pool.query(
        `UPDATE ${this.table} SET estado_venta = 'CANCELADA', id_motivo_cancelacion = ? WHERE id_venta = ?`,
        [id_motivo_cancelacion, id_venta]
      );

      return true;
    } catch (error) {
      throw new Error("Error al cancelar venta: " + error.message);
    }
  }

  // Registrar un nuevo motivo de cancelación
  async registrarMotivoCancelacion(descripcion) {
    try {
      const pool = database.getPool();

      if (!descripcion || descripcion.length === 0)
        throw new Error("La descripción de cancelación no puede estar vacía.");

      const [result] = await pool.query(
        `INSERT INTO motivos_cancelacion (descripcion) VALUES (?)`,
        [descripcion]
      );

      return result.insertId;
    } catch (error) {
      throw new Error(
        "Error al registrar motivo de cancelación: " + error.message
      );
    }
  }

  // Obtener motivos de cancelación activos
  async obtenerMotivosCancelacion() {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(
        `SELECT id_motivo, descripcion FROM motivos_cancelacion WHERE estado = 1`
      );
      return rows;
    } catch (error) {
      throw new Error(
        "Error al obtener motivos de cancelación: " + error.message
      );
    }
  }

  // Desactivar un motivo de cancelación
  async desactivarMotivoCancelacion(id_motivo) {
    try {
      const pool = database.getPool();

      if (!id_motivo || !Number.isInteger(id_motivo) || id_motivo <= 0)
        throw new Error(
          "El id_motivo es requerido y debe ser un número entero positivo."
        );

      const [result] = await pool.query(
        `UPDATE motivos_cancelacion SET estado = 0 WHERE id_motivo = ?`,
        [id_motivo]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(
        "Error al desactivar motivo de cancelación: " + error.message
      );
    }
  }
}

module.exports = VentasModel;
