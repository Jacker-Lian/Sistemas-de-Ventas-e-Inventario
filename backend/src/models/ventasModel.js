const database = require("../config/database");

class VentasModel {
  constructor() {
    this.table = "ventas";
  }

  // Registrar una nueva venta con transacción
  async registrarVenta(ventaData) {
    /*
    Estructura esperada de ventaData:
      {
        "id_usuario": 2,                    // REQUERIDO
        "id_caja": 1,                       // REQUERIDO  
        "id_sucursal": 1,                   // OPCIONAL
        "tipo_cliente": "ALUMNO",           // REQUERIDO
        "metodo_pago": "EFECTIVO",          // REQUERIDO
        "estado_venta": "COMPLETADA",       // OPCIONAL (default: COMPLETADA)
        "productos": [                      // REQUERIDO, mínimo 1
          {
            "id_producto": 101,             // REQUERIDO
            "cantidad": 2,                  // REQUERIDO, > 0
            "precio_unitario": 5.00         // REQUERIDO
          }
        ]
      }
    */

    const connection = await database.getPool().getConnection();

    try {
      await connection.beginTransaction();

      // 1. Validaciones de datos requeridos
      if (!ventaData.id_usuario || !ventaData.id_caja || !ventaData.tipo_cliente || 
          !ventaData.metodo_pago || !ventaData.productos || ventaData.productos.length === 0) {
        throw new Error("Faltan datos requeridos para registrar la venta.");
      }

      // 2. Verificar que usuario exista y esté activo
      const [usuarioRows] = await connection.query(
        "SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND estado = 1",
        [ventaData.id_usuario]
      );
      if (usuarioRows.length === 0) {
        throw new Error("El usuario no existe o está inactivo.");
      }

      // 3. Verificar que caja exista y esté abierta
      const [cajaRows] = await connection.query(
        "SELECT id_caja, id_sucursal FROM caja WHERE id_caja = ? AND estado_caja = 'ABIERTA' AND estado = 1",
        [ventaData.id_caja]
      );
      if (cajaRows.length === 0) {
        throw new Error("La caja no existe, está cerrada o inactiva.");
      }

      // 4. Obtener id_sucursal de la caja si no se proporciona
      const id_sucursal = ventaData.id_sucursal || cajaRows[0].id_sucursal;
      let totalVenta = 0;
      const productosValidados = [];

      // 5. Validar productos y calcular total
      for (const producto of ventaData.productos) {
        if (!producto.id_producto || !producto.cantidad || producto.cantidad <= 0 || 
            !producto.precio_unitario || producto.precio_unitario <= 0) {
          throw new Error("Datos de producto inválidos.");
        }

        // Verificar que el producto exista y tenga stock suficiente
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

        const subtotal = Number.parseFloat((producto.cantidad * producto.precio_unitario).toFixed(2));
        totalVenta += subtotal;

        productosValidados.push({
          id_producto: producto.id_producto,
          cantidad: producto.cantidad,
          precio_unitario: producto.precio_unitario,
          subtotal: subtotal,
        });
      }

      totalVenta = Number.parseFloat(totalVenta.toFixed(2));

      // 6. Insertar venta principal
      const [resultVenta] = await connection.query(
        `INSERT INTO ${this.table} (id_usuario, id_caja, id_sucursal, tipo_cliente, metodo_pago, total, estado_venta)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [ventaData.id_usuario, ventaData.id_caja, id_sucursal, ventaData.tipo_cliente, 
         ventaData.metodo_pago, totalVenta, ventaData.estado_venta || "COMPLETADA"]
      );

      const id_venta = resultVenta.insertId;

      // 7. Insertar detalles de venta y actualizar stock
      for (const producto of productosValidados) {
        // Insertar detalle de venta
        await connection.query(
          `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
           VALUES (?, ?, ?, ?, ?)`,
          [id_venta, producto.id_producto, producto.cantidad, producto.precio_unitario, producto.subtotal]
        );

        // Actualizar stock del producto
        await connection.query(
          "UPDATE producto SET stock = stock - ? WHERE id_producto = ?",
          [producto.cantidad, producto.id_producto]
        );
      }

      // 8. Actualizar ingresos de caja
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

  // Cancelar una venta
  async cancelarVenta(id_venta, id_motivo) {
    const connection = await database.getPool().getConnection();
    
    try {
      await connection.beginTransaction();

      // Verificar que la venta exista y no esté ya cancelada
      const [ventaRows] = await connection.query(
        `SELECT id_venta, estado_venta FROM ${this.table} WHERE id_venta = ?`,
        [id_venta]
      );
      
      if (ventaRows.length === 0) {
        throw new Error("La venta con el id proporcionado no existe.");
      }

      if (ventaRows[0].estado_venta === 'CANCELADA') {
        throw new Error("La venta ya está cancelada.");
      }

      // Verificar que el motivo de cancelación exista
      const [motivoRows] = await connection.query(
        "SELECT id_motivo FROM motivos_cancelacion WHERE id_motivo = ? AND estado = 1",
        [id_motivo]
      );
      
      if (motivoRows.length === 0) {
        throw new Error("El motivo de cancelación no existe o está inactivo.");
      }

      // Obtener detalles de la venta para restaurar stock
      const [detallesVenta] = await connection.query(
        "SELECT id_producto, cantidad FROM detalle_venta WHERE id_venta = ?",
        [id_venta]
      );

      // Restaurar stock de productos
      for (const detalle of detallesVenta) {
        await connection.query(
          "UPDATE producto SET stock = stock + ? WHERE id_producto = ?",
          [detalle.cantidad, detalle.id_producto]
        );
      }

      // Actualizar la venta con estado "CANCELADA" y el motivo
      await connection.query(
        `UPDATE ${this.table} SET estado_venta = 'CANCELADA', id_motivo = ? WHERE id_venta = ?`,
        [id_motivo, id_venta]
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw new Error("Error al cancelar venta: " + error.message);
    } finally {
      connection.release();
    }
  }

  // Registrar un nuevo motivo de cancelación
  async registrarMotivoCancelacion(descripcion) {
    try {
      const pool = database.getPool();

      if (!descripcion || descripcion.trim().length === 0) {
        throw new Error("La descripción de cancelación no puede estar vacía.");
      }

      const [result] = await pool.query(
        `INSERT INTO motivos_cancelacion (descripcion) VALUES (?)`,
        [descripcion.trim()]
      );

      return result.insertId;
    } catch (error) {
      throw new Error("Error al registrar motivo de cancelación: " + error.message);
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
      throw new Error("Error al obtener motivos de cancelación: " + error.message);
    }
  }

  // Desactivar un motivo de cancelación
  async desactivarMotivoCancelacion(id_motivo) {
    try {
      const pool = database.getPool();

      if (!id_motivo || !Number.isInteger(id_motivo) || id_motivo <= 0) {
        throw new Error("El id_motivo es requerido y debe ser un número entero positivo.");
      }

      const [result] = await pool.query(
        `UPDATE motivos_cancelacion SET estado = 0 WHERE id_motivo = ?`,
        [id_motivo]
      );
      
      if (result.affectedRows === 0) {
        throw new Error("No se encontró el motivo de cancelación especificado.");
      }
      
      return true;
    } catch (error) {
      throw new Error("Error al desactivar motivo de cancelación: " + error.message);
    }
  }
}

module.exports = VentasModel;