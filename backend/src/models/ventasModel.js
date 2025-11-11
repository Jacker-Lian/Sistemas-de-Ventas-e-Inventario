const database = require("../config/database");
const UsuarioModel = require("./usuarioModel");
const ProductoModel = require("./productoModel");

class VentasModel {
  constructor() {
    this.table = "ventas";
  }

  // Instancia de models nesesarios
  usuarioModel = new UsuarioModel();
  productoModel = new ProductoModel();

  // Registrar una nueva venta
  async registrarVenta(ventaData = {}, estado_venta = "PENDIENTE") {
    /*
    Estructura esperada de ventaData:
      {
        // DATOS DE LA VENTA (Encabezado)
        "id_usuario": 2,                    // ID del cajero (REQUERIDO)
        "id_caja": 1,                       // ID de la caja abierta (REQUERIDO)
        "id_sucursal": 1,                   // ID de la sucursal (OPCIONAL)
        "tipo_cliente": "ALUMNO",           // DOCENTE | ALUMNO | OTRO (REQUERIDO)
        "metodo_pago": "EFECTIVO",          // EFECTIVO | YAPE | PLIN | OTROS (REQUERIDO)
        "estado_venta": "COMPLETADA",     // PENDIENTE | COMPLETADA (OPCIONAL, por defecto PENDIENTE)
        // PRODUCTOS VENDIDOS (Detalles)
        "productos": [                      // Array de productos (REQUERIDO, mínimo 1)
          {
            "id_producto": 101,             // ID del producto (REQUERIDO)
            "cantidad": 2,                  // Cantidad vendida (REQUERIDO, > 0)
          },
          {
            "id_producto": 102,
            "cantidad": 3,
          }
        ]
      }
    
    */

    // Validar que estado_venta sea válido
    if (!estado_venta || typeof estado_venta !== "string") {
      throw new Error(
        "El estado_venta es requerido y debe ser una cadena de texto."
      );
    }

    // Normalizar a mayúsculas para evitar errores
    estado_venta = estado_venta.toUpperCase().trim();

    // Validar que estado_venta sea válido
    const estadosPermitidos = ["PENDIENTE", "COMPLETADA"];
    if (!estadosPermitidos.includes(estado_venta)) {
      throw new Error("El estado_venta debe ser 'PENDIENTE' o 'COMPLETADA'.");
    }

    const pool = database.getPool();

    try {
      // 1. Validaciones de datos requeridos
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

      // 2. Verificar que id_usuario exista y esté activo
      const userVerfication = await this.usuarioModel.getUserById(
        ventaData.id_usuario
      );
      if (!userVerfication) {
        throw new Error("El usuario no existe o está inactivo.");
      }

      // 3. Verificar que id_caja exista y esté abierta
      // En espera a PR para usasr el model de caja
      const [cajaRows] = await pool.query(
        "SELECT id_caja, id_sucursal FROM caja WHERE id_caja = ? AND estado_caja = 'ABIERTA' AND estado = 1",
        [ventaData.id_caja]
      );
      if (cajaRows.length === 0) {
        throw new Error("La caja no existe, está cerrada o inactiva.");
      }

      // 4. Obtener id_sucursal de la caja si no se proporciona
      const id_sucursal = ventaData.id_sucursal || cajaRows[0].id_sucursal;

      // 5. Validar productos y calcular total
      let totalVenta = 0;
      const productosValidados = [];

      for (const producto of ventaData.productos) {
        if (
          !producto.id_producto ||
          !producto.cantidad ||
          producto.cantidad <= 0
        ) {
          throw new Error("Datos de producto inválidos.");
        }

        // Verificar que el producto exista, tenga stock suficiente y obtener su precio unitario actual
        const productoDB = await this.productoModel.obtenerProductoPorId(
          producto.id_producto
        );

        if (!productoDB) {
          throw new Error(
            `El producto con ID ${producto.id_producto} no existe o está inactivo.`
          );
        }

        if (productoDB.stock < producto.cantidad) {
          throw new Error(
            `Stock insuficiente para "${productoDB.nombre}". Disponible: ${productoDB.stock}, Solicitado: ${producto.cantidad}`
          );
        }

        // Calcular el total de la venta usando el precio de la BD
        const subTotal = parseFloat(
          (producto.cantidad * productoDB.precio).toFixed(2)
        );
        totalVenta += subTotal;

        productosValidados.push({
          id_producto: producto.id_producto,
          cantidad: producto.cantidad,
          precio_unitario: productoDB.precio,
          subtotal: subTotal,
        });
      }

      totalVenta = parseFloat(totalVenta.toFixed(2)); // Asegurar dos decimales

      // 6. Insertar la venta
      const [resultVenta] = await pool.query(
        `INSERT INTO ${this.table} (
          id_usuario,
          id_caja,
          id_sucursal,
          tipo_cliente,
          metodo_pago,
          total,
          estado_venta
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

      // Si la venta es pendiente, guardar productos en carrito_venta
      // NO se actualiza stock ni ingresos de caja
      if (estado_venta === "PENDIENTE") {
        for (const producto of productosValidados) {
          await pool.query(
            `INSERT INTO carrito_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)`,
            [
              id_venta,
              producto.id_producto,
              producto.cantidad,
              producto.precio_unitario,
              producto.subtotal,
            ]
          );
        }
        return {
          id_venta: id_venta,
          total: totalVenta,
          estado: "PENDIENTE",
          productos_en_carrito: productosValidados.length,
        };
      }

      // 7. Si la venta es COMPLETADA: Insertar en detalle_venta y actualizar stock
      for (const producto of productosValidados) {
        // Insertar detalle de venta
        // En espera a PR para usasr el model de detalle_venta
        await pool.query(
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
        const stockActualizado = await this.productoModel.updateStock(
          producto.id_producto,
          producto.cantidad
        );

        if (!stockActualizado) {
          throw new Error(
            `No se pudo actualizar el stock del producto ID ${producto.id_producto}. Stock insuficiente o producto inactivo.`
          );
        }
      }

      // 8. Actualizar ingresos de la caja
      // En espera a PR para usasr el model de caja
      await pool.query(
        "UPDATE caja SET total_ingresos = total_ingresos + ? WHERE id_caja = ?",
        [totalVenta, ventaData.id_caja]
      );

      return {
        id_venta: id_venta,
        total: totalVenta,
        productos_registrados: productosValidados.length,
      };
    } catch (error) {
      throw new Error("Error al registrar venta: " + error.message);
    }
  }

  // Cancelar una venta
  async cancelarVenta(id_venta, id_motivo) {
    try {
      const pool = database.getPool();

      // Verificar que la venta exista
      const [ventaRows] = await pool.query(
        `SELECT id_venta, estado_venta FROM ${this.table} WHERE id_venta = ?`,
        [id_venta]
      );
      if (ventaRows.length === 0)
        throw new Error("La venta con el id proporcionado no existe.");

      // Verificar que la venta no esté ya cancelada
      if (ventaRows[0].estado_venta === "CANCELADA")
        throw new Error("La venta ya está cancelada.");

      // Verificar que el motivo de cancelación exista
      const [motivoRows] = await pool.query(
        "SELECT COUNT(*) AS count FROM motivos_cancelacion WHERE id_motivo = ?",
        [id_motivo]
      );
      if (motivoRows[0].count === 0)
        throw new Error(
          "El motivo de cancelación con el id proporcionado no existe."
        );

      // Actualizar la venta con el estado "CANCELADA" y el id_motivo_cancelacion
      await pool.query(
        `UPDATE ${this.table} SET estado_venta = 'CANCELADA', id_motivo_cancelacion = ? WHERE id_venta = ?`,
        [id_motivo, id_venta]
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

  // Desactivar la ventana de ventas de una sucursal
  async desactivarVentas(id_venta) {
    try {
      const pool = database.getPool();

      if (!id_venta || !Number.isInteger(id_venta) || id_venta <= 0)
        throw new Error(
          "El id_venta es requerido y debe ser un número entero positivo."
        );

      const [result] = await pool.query(
        `UPDATE ventas SET estado_venta = 0 WHERE id_venta = ?`,
        [id_venta]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(
        "Error al desactivar las ventas: " + error.message
      );
    }
  }

  async obtenerCategorias() {
    try {
      const pool = database.getPool();
      const [rows] = await pool.query(
        `SELECT id_categoria, nombre, descripcion FROM categoria WHERE estado = 1`
      );
      if (rows.length === 0) {
        throw new Error("No hay categorías activas disponibles.");
      }
      return rows;
    } catch (error) {
      throw new Error("Error al obtener categorías: " + error.message);
    }
  }
}

module.exports = VentasModel;
