const database = require("../config/database");

class VentasModel {
  constructor() {
    this.table = "ventas";
  }


  // REPORTE DE VENTAS

  async reporteVentaProducto(fechaInicio, fechaFin) {
    try {
      const pool = database.getPool();

      const query = `
        SELECT 
          p.id_producto,
          p.nombre AS nombre_producto,
          SUM(dv.cantidad) AS cantidad_vendida,
          SUM(dv.subtotal) AS total_recaudado
        FROM 
          detalle_venta dv
          JOIN producto p ON dv.id_producto = p.id_producto
          JOIN ventas v ON dv.id_venta = v.id_venta
        WHERE 
          DATE(v.fecha_venta) BETWEEN ? AND ?
          AND v.estado_venta = 'COMPLETADA'
        GROUP BY 
          p.id_producto, p.nombre
        ORDER BY 
          cantidad_vendida DESC
      `;

      const [rows] = await pool.query(query, [fechaInicio, fechaFin]);
      return rows;
    } catch (error) {
      throw new Error("Error al generar reporte de ventas por producto: " + error.message);
    }
  }

  // REGISTRAR VENTA

  async registrarVenta(ventaData = {}, estado_venta = "PENDIENTE") {
    const connection = await database.getPool().getConnection();

    try {
      await connection.beginTransaction();

      // Validar estructura mínima
      if (
        !ventaData.id_usuario ||
        !ventaData.id_caja ||
        !ventaData.tipo_cliente ||
        !ventaData.metodo_pago ||
        !ventaData.productos ||
        ventaData.productos.length === 0
      ) {
        throw new Error("Faltan datos requeridos para registrar la venta.");
      }

      // Validar estado_venta
      estado_venta = estado_venta.toUpperCase().trim();
      const estadosPermitidos = ["PENDIENTE", "COMPLETADA"];
      if (!estadosPermitidos.includes(estado_venta)) {
        throw new Error("El estado_venta debe ser 'PENDIENTE' o 'COMPLETADA'.");
      }

      // Verificar usuario
      const [usuarioRows] = await connection.query(
        "SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND estado = 1",
        [ventaData.id_usuario]
      );
      if (usuarioRows.length === 0) throw new Error("El usuario no existe o está inactivo.");

      // Verificar caja
      const [cajaRows] = await connection.query(
        "SELECT id_caja, id_sucursal FROM caja WHERE id_caja = ? AND estado_caja = 'ABIERTA' AND estado = 1",
        [ventaData.id_caja]
      );
      if (cajaRows.length === 0) throw new Error("La caja no existe, está cerrada o inactiva.");

      const id_sucursal = ventaData.id_sucursal || cajaRows[0].id_sucursal;

      // Validar productos y calcular total
      let totalVenta = 0;
      const productosValidados = [];

      for (const producto of ventaData.productos) {
        if (!producto.id_producto || !producto.cantidad || producto.cantidad <= 0) {
          throw new Error("Datos de producto inválidos.");
        }

        const [productoRows] = await connection.query(
          "SELECT id_producto, stock, nombre, precio FROM producto WHERE id_producto = ? AND estado = 1",
          [producto.id_producto]
        );

        if (productoRows.length === 0)
          throw new Error(`El producto con ID ${producto.id_producto} no existe o está inactivo.`);

        const productoDB = productoRows[0];

        if (productoDB.stock < producto.cantidad)
          throw new Error(
            `Stock insuficiente para "${productoDB.nombre}". Disponible: ${productoDB.stock}, Solicitado: ${producto.cantidad}`
          );

        const precioUnitario = parseFloat(producto.precio_unitario || productoDB.precio);
        const subtotal = parseFloat((producto.cantidad * precioUnitario).toFixed(2));
        totalVenta += subtotal;

        productosValidados.push({
          id_producto: producto.id_producto,
          cantidad: producto.cantidad,
          precio_unitario: precioUnitario,
          subtotal: subtotal,
        });
      }

      totalVenta = parseFloat(totalVenta.toFixed(2));

      // Insertar venta
      const [resultVenta] = await connection.query(
        `INSERT INTO ${this.table} (
          id_usuario, id_caja, id_sucursal, tipo_cliente, metodo_pago, total, estado_venta
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          ventaData.id_usuario,
          ventaData.id_caja,
          id_sucursal,
          ventaData.tipo_cliente,
          ventaData.metodo_pago,
          totalVenta,
          estado_venta,
        ]
      );

      const id_venta = resultVenta.insertId;

      // Si es PENDIENTE, solo guardar en carrito_venta
      if (estado_venta === "PENDIENTE") {
        for (const producto of productosValidados) {
          await connection.query(
            `INSERT INTO carrito_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
             VALUES (?, ?, ?, ?, ?)`,
            [id_venta, producto.id_producto, producto.cantidad, producto.precio_unitario, producto.subtotal]
          );
        }

        await connection.commit();
        return {
          id_venta,
          total: totalVenta,
          estado: "PENDIENTE",
          productos_en_carrito: productosValidados.length,
        };
      }

      // Si es COMPLETADA: registrar en detalle_venta y actualizar stock
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

      // Actualizar caja (ingreso)
      await connection.query(
        "UPDATE caja SET total_ingresos = total_ingresos + ? WHERE id_caja = ?",
        [totalVenta, ventaData.id_caja]
      );

      await connection.commit();

      return {
        id_venta,
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


  // CANCELAR VENTA

  async cancelarVenta(id_venta, id_motivo_cancelacion) {
    const connection = await database.getPool().getConnection();

    try {
      await connection.beginTransaction();

      const [ventaRows] = await connection.query(
        `SELECT id_venta, estado_venta FROM ${this.table} WHERE id_venta = ?`,
        [id_venta]
      );

      if (ventaRows.length === 0)
        throw new Error("La venta con el id proporcionado no existe.");
      if (ventaRows[0].estado_venta === "CANCELADA")
        throw new Error("La venta ya está cancelada.");

      const [motivoRows] = await connection.query(
        "SELECT id_motivo_cancelacion FROM motivos_cancelacion WHERE id_motivo_cancelacion = ? AND estado = 1",
        [id_motivo_cancelacion]
      );

      if (motivoRows.length === 0)
        throw new Error("El motivo de cancelación no existe o está inactivo.");

      // Restaurar stock
      const [detallesVenta] = await connection.query(
        "SELECT id_producto, cantidad FROM detalle_venta WHERE id_venta = ?",
        [id_venta]
      );

      for (const detalle of detallesVenta) {
        await connection.query(
          "UPDATE producto SET stock = stock + ? WHERE id_producto = ?",
          [detalle.cantidad, detalle.id_producto]
        );
      }

      // Actualizar estado de venta
      await connection.query(
        `UPDATE ${this.table} 
         SET estado_venta = 'CANCELADA', id_motivo_cancelacion = ? 
         WHERE id_venta = ?`,
        [id_motivo_cancelacion, id_venta]
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


  // OBTENER VENTA POR ID
  async obtenerVentaPorId(id_venta) {
    try {
      const pool = database.getPool();

      const [ventaRows] = await pool.query(
        `SELECT * FROM ${this.table} WHERE id_venta = ?`,
        [id_venta]
      );

      if (ventaRows.length === 0) return null;

      const venta = ventaRows[0];

      const [detalleRows] = await pool.query(
        `SELECT dv.*, p.nombre AS nombre_producto
         FROM detalle_venta dv
         INNER JOIN producto p ON dv.id_producto = p.id_producto
         WHERE dv.id_venta = ?`,
        [id_venta]
      );

      venta.detalles = detalleRows;
      return venta;
    } catch (error) {
      throw new Error("Error al obtener venta por ID: " + error.message);
    }
  }

  // MOTIVOS DE CANCELACIÓN
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
      throw new Error("Error al registrar motivo de cancelación: " + error.message);
    }
  }

  async obtenerMotivosCancelacion() {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(
        `SELECT id_motivo_cancelacion, descripcion 
         FROM motivos_cancelacion 
         WHERE estado = 1`
      );
      return rows;
    } catch (error) {
      throw new Error("Error al obtener motivos de cancelación: " + error.message);
    }
  }

  async desactivarMotivoCancelacion(id_motivo_cancelacion) {
    try {
      const pool = database.getPool();

      if (!id_motivo_cancelacion || !Number.isInteger(id_motivo_cancelacion) || id_motivo_cancelacion <= 0)
        throw new Error("El id_motivo_cancelacion debe ser un número entero positivo.");

      const [result] = await pool.query(
        `UPDATE motivos_cancelacion SET estado = 0 WHERE id_motivo_cancelacion = ?`,
        [id_motivo_cancelacion]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Error al desactivar motivo de cancelación: " + error.message);
    }
  }
}

module.exports = VentasModel;
