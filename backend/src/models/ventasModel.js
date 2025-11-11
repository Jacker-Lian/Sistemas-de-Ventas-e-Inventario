const database = require("../config/database");

class VentasModel {
  constructor() {
    this.table = "ventas";
  }

  async registrarVenta(ventaData) {
    const connection = await database.getPool().getConnection();

    try {
      await connection.beginTransaction();

      if (!ventaData.id_usuario || !ventaData.id_caja || !ventaData.tipo_cliente || 
          !ventaData.metodo_pago || !ventaData.productos || ventaData.productos.length === 0) {
        throw new Error("Faltan datos requeridos para registrar la venta.");
      }

      const [usuarioRows] = await connection.query(
        "SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND estado = 1",
        [ventaData.id_usuario]
      );
      if (usuarioRows.length === 0) {
        throw new Error("El usuario no existe o está inactivo.");
      }

      const [cajaRows] = await connection.query(
        "SELECT id_caja, id_sucursal FROM caja WHERE id_caja = ? AND estado_caja = 'ABIERTA' AND estado = 1",
        [ventaData.id_caja]
      );
      if (cajaRows.length === 0) {
        throw new Error("La caja no existe, está cerrada o inactiva.");
      }

      const id_sucursal = ventaData.id_sucursal || cajaRows[0].id_sucursal;
      let totalVenta = 0;
      const productosValidados = [];

      for (const producto of ventaData.productos) {
        if (!producto.id_producto || !producto.cantidad || producto.cantidad <= 0 || 
            !producto.precio_unitario || producto.precio_unitario <= 0) {
          throw new Error("Datos de producto inválidos.");
        }

        const [productoRows] = await connection.query(
          "SELECT id_producto, stock, nombre FROM producto WHERE id_producto = ? AND estado = 1",
          [producto.id_producto]
        );

        if (productoRows.length === 0) {
          throw new Error(`El producto con ID ${producto.id_producto} no existe o está inactivo.`);
        }

        if (productoRows[0].stock < producto.cantidad) {
          throw new Error(`Stock insuficiente para el producto "${productoRows[0].nombre}". Stock disponible: ${productoRows[0].stock}`);
        }

        const subtotal = parseFloat((producto.cantidad * producto.precio_unitario).toFixed(2));
        totalVenta += subtotal;

        productosValidados.push({
          id_producto: producto.id_producto,
          cantidad: producto.cantidad,
          precio_unitario: producto.precio_unitario,
          subtotal: subtotal,
        });
      }

      totalVenta = parseFloat(totalVenta.toFixed(2));

      const [resultVenta] = await connection.query(
        `INSERT INTO ${this.table} (id_usuario, id_caja, id_sucursal, tipo_cliente, metodo_pago, total, estado_venta)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [ventaData.id_usuario, ventaData.id_caja, id_sucursal, ventaData.tipo_cliente, 
         ventaData.metodo_pago, totalVenta, ventaData.estado_venta || "COMPLETADA"]
      );

      const id_venta = resultVenta.insertId;

      for (const producto of productosValidados) {
        await connection.query(
          `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
           VALUES (?, ?, ?, ?, ?)`,
          [id_venta, producto.id_producto, producto.cantidad, producto.precio_unitario, producto.subtotal]
        );

        await connection.query(
          "UPDATE producto SET stock = stock - ? WHERE id_producto = ?",
          [producto.cantidad, producto.id_producto]
        );
      }

      await connection.query(
        "UPDATE caja SET total_ingresos = total_ingresos + ? WHERE id_caja = ?",
        [totalVenta, ventaData.id_caja]
      );

      await connection.commit();

      return {
        id_venta: id_venta,
        total: totalVenta,
        productos_registrados: productosValidados.length,
      };
    } catch (error) {
      await connection.rollback();
      throw new Error("Error al registrar venta: " + error.message);
    } finally {
      connection.release();
    }
  }

  async cancelarVenta(id_venta, id_motivo_cancelacion) {
    try {
      const pool = database.getPool();

      const [ventaRows] = await pool.query(`SELECT id_venta FROM ${this.table} WHERE id_venta = ?`, [id_venta]);
      if (ventaRows.length === 0) throw new Error("La venta con el id proporcionado no existe.");

      const [motivoRows] = await pool.query(
        "SELECT id_motivo_cancelacion FROM motivos_cancelacion WHERE id_motivo_cancelacion = ?",
        [id_motivo_cancelacion]
      );
      if (motivoRows.length === 0) throw new Error("El motivo de cancelación no existe.");

      await pool.query(
        `UPDATE ${this.table} SET estado_venta = 'CANCELADA', id_motivo_cancelacion = ? WHERE id_venta = ?`,
        [id_motivo_cancelacion, id_venta]
      );

      return true;
    } catch (error) {
      throw new Error("Error al cancelar venta: " + error.message);
    }
  }

  async registrarMotivoCancelacion(descripcion) {
    try {
      const pool = database.getPool();

      if (!descripcion || descripcion.length === 0)
        throw new Error("La descripción de cancelación no puede estar vacía.");

      const [result] = await pool.query(`INSERT INTO motivos_cancelacion (descripcion) VALUES (?)`, [descripcion]);
      return result.insertId;
    } catch (error) {
      throw new Error("Error al registrar motivo de cancelación: " + error.message);
    }
  }

  async obtenerMotivosCancelacion() {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(`SELECT id_motivo, descripcion FROM motivos_cancelacion WHERE estado = 1`);
      return rows;
    } catch (error) {
      throw new Error("Error al obtener motivos de cancelación: " + error.message);
    }
  }

  async desactivarMotivoCancelacion(id_motivo) {
    try {
      const pool = database.getPool();

      if (!id_motivo || !Number.isInteger(id_motivo) || id_motivo <= 0)
        throw new Error("El id_motivo es requerido y debe ser un número entero positivo.");

      const [result] = await pool.query(`UPDATE motivos_cancelacion SET estado = 0 WHERE id_motivo = ?`, [id_motivo]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Error al desactivar motivo de cancelación: " + error.message);
    }
  }
}

module.exports = VentasModel;