const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Importar todas las rutas
const UsuarioRoutes = require("./routes/usuarioRoutes");
const VentasRoutes = require("./routes/ventasRoutes");
const CategoriaRoutes = require('./routes/categoriaRoutes');
const AjusteInventarioRoutes = require("./routes/ajusteInventarioRoutes");
const CajaRoutes = require("./routes/cajaRoutes");
const ProductoRouters = require("./routes/productoRouters");
const HistorialVentasRoutes = require("./routes/historial-ventas.routes.js");
const ProveedorRoutes = require("./routes/proveedorRoutes");
const DetalleVentaRoutes = require("./routes/detalleVentaRoutes");

class App {
  constructor() {
    this.app = express();
    this.configurarMiddlewares();
    this.configurarRutas();
  }

  configurarMiddlewares() {
    const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

    const ALLOWED_ORIGINS = [
      "http://localhost:5173",       // desarrollo local
      "http://127.0.0.1:5173",       // posible entorno local alternativo
      "http://38.250.161.15"         // producción
    ];

    this.app.use(
      cors({
        origin: function (origin, callback) {
          if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("CORS no permitido para este origen: " + origin));
          }
        },
        credentials: true,
      })
    );

    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Middleware para registrar todas las peticiones
    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
  }

  configurarRutas() {
    // Ruta principal
    this.app.get("/", (req, res) => {
      res.json({
        mensaje: "Backend de Sistema de Ventas e Inventario funcionando",
        endpoints: {
          Login: "/api/usuario",
          Ventas: "/api/ventas",
          AjustesInventario: "/api/ajustes-inventario",
          Productos: "/api/productos",
          Categorias: "/api/categorias",
          HistorialVentas: "/api/historial-ventas",
          Proveedores: "/api/proveedores",
          DetalleVenta: "/api/detalle-venta",
          Caja: "/api/caja"
        },
      });
    });

    // Rutas de la API
    const usuarioRoutes = new UsuarioRoutes();
    this.app.use("/api/usuario", usuarioRoutes.getRouter());

    const ventasRoutesInstance = new VentasRoutes();
    this.app.use("/api/ventas", ventasRoutesInstance.getRouter());

    const categoriaRoutes = new CategoriaRoutes();
    this.app.use('/api/categorias', categoriaRoutes.getRouter());

    const ajusteInventarioRoutesInstance = new AjusteInventarioRoutes();
    this.app.use("/api/ajustes-inventario", ajusteInventarioRoutesInstance.getRouter());

    const cajaRoutesInstance = new CajaRoutes();
    this.app.use("/api/caja", cajaRoutesInstance.getRouter());

    const productoRoutersInstance = new ProductoRouters();
    this.app.use("/api/productos", productoRoutersInstance.getRouter());

    const historialVentasRoutesInstance = new HistorialVentasRoutes();
    this.app.use("/api/historial-ventas", historialVentasRoutesInstance.getRouter());

    const proveedorRoutesInstance = new ProveedorRoutes();
    this.app.use("/api/proveedores", proveedorRoutesInstance.getRouter());

    const detalleVentaRoutesInstance = new DetalleVentaRoutes();
    this.app.use("/api/detalle-venta", detalleVentaRoutesInstance.getRouter());

    // Ruta 404
    this.app.use((req, res) => {
      res.status(404).json({ success: false, mensaje: "Ruta no encontrada" });
    });
  }

  getApp() {
    return this.app;
  }
}

module.exports = App;
