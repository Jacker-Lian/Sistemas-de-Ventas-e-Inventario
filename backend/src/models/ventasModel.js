const database = require("../config/database");
const UsuarioModel = require("./usuarioModel");
const ProductoModel = require("./productoModel");
const motivoCancelacionModel = require("./motivoCancelacionModel");
const CarritoVentaModel = require("./carritoVentaModel");
const DetalleVentaModel = require("./detalleVentaModel");
const cajaModel = require("./cajaModel");

class VentasModel {
  constructor() {
    this.table = "ventas";
  }

  // Instancia de models nesesarios
  usuarioModel = new UsuarioModel();
  productoModel = new ProductoModel();
  motivoCancelacionModel = new motivoCancelacionModel();
  carritoVentaModel = new CarritoVentaModel();
  detalleVentaModel = new DetalleVentaModel();
  cajaModel = new cajaModel();

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
      throw new Error(
        "Error al generar reporte de ventas por producto: " + error.message
      );
    }
  }

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
      const cajaAbierta = await this.cajaModel.obtenerCajaAbiertaPorId(
        ventaData.id_caja
      );
      if (!cajaAbierta) {
        throw new Error("La caja no existe, está cerrada o inactiva.");
      }

      // 4. Obtener id_sucursal de la caja si no se proporciona
      const id_sucursal = ventaData.id_sucursal || cajaAbierta.id_sucursal;

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
          await this.carritoVentaModel.agregarProductoAlCarrito(id_venta, {
            id_producto: producto.id_producto,
            cantidad: producto.cantidad,
            precio_unitario: producto.precio_unitario,
            subtotal: producto.subtotal,
          });
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
        await this.detalleVentaModel.registrarDetalleVenta({
          id_venta: id_venta,
          id_producto: producto.id_producto,
          cantidad: producto.cantidad,
          precio_unitario: producto.precio_unitario,
          subtotal: producto.subtotal,
        });

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
      await this.cajaModel.registrarMovimiento(
        ventaData.id_caja,
        "INGRESO",
        totalVenta
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

      const motivosRows = await this.motivoCancelacionModel.obtenerMotivoCancelacionByID(id_motivo);
      if (motivosRows.length === 0)
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



  // Desactivar la ventana de ventas de una sucursal
  async desactivarVentas(id_venta) {
    try {
      const pool = database.getPool();

      if (!id_venta || !Number.isInteger(id_venta) || id_venta <= 0)
        throw new Error(
          "El id_venta es requerido y debe ser un número entero positivo."
        );

      const [result] = await pool.query(
        `UPDATE ventas SET estado = 0 WHERE id_venta = ?`,
        [id_venta]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Error al desactivar las ventas: " + error.message);
    }
  }

  async obtenerCategorias() {
    try {
      const pool = database.getPool();
      // Obtener todas las categorías activas
      // En espera a PR para usasr el model de categoria
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
