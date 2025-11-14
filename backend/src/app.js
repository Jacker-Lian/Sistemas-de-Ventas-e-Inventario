const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// 📌 Importar rutas
const UsuarioRoutes = require("./routes/usuarioRoutes");
const VentasRoutes = require("./routes/ventasRoutes");
const CategoriaRoutes = require("./routes/categoriaRoutes");
const AjusteInventarioRoutes = require("./routes/ajusteInventarioRoutes");
const CajaRoutes = require("./routes/cajaRoutes");
const ProductoRouters = require("./routes/productoRouters");
const HistorialVentasRoutes = require('./routes/historial-ventas.routes.js');
const DetalleVentaRoutes = require('./routes/detalleVentaRoutes');
const SucursalRoutes = require("./routes/sucursalRoutes");
const ProveedorRoutes = require("./routes/proveedorRoutes");
const GastoRoutes = require('./routes/gastoRoutes');

class App {
  constructor() {
    this.app = express();
    this.configurarMiddlewares();
    this.configurarRutas();
  }

  configurarMiddlewares() {

    const ALLOWED_ORIGINS = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://38.250.161.15"
    ];

    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
          } else {
            console.log("❌ ORIGEN BLOQUEADO POR CORS:", origin);
            callback(new Error("CORS bloqueó el origen: " + origin));
          }
        },
        credentials: true,
      })
    );

    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // 📌 Log de solicitudes
    this.app.use((req, res, next) => {
      console.log(`➡️  ${req.method} ${req.originalUrl}`);
      next();
    });
  }

  configurarRutas() {

    // ============================
    // 📌 Ruta principal
    // ============================
    this.app.get("/", (req, res) => {
      res.json({
        mensaje: "Backend de Sistema de Ventas e Inventario funcionando correctamente",
        endpoints: {
          Login: "/api/usuario",
          Ventas: "/api/ventas",
          AjustesInventario: "/api/ajustes-inventario",
          Productos: "/api/productos",
          Categorias: "/api/categorias",
          HistorialVentas: "/api/historial-ventas",
          Proveedores: "/api/proveedores",
          DetalleVenta: "/api/detalle-venta",
          Sucursales: "/api/sucursales",
          Gastos: "/api/gastos",
        },
      });
    });

    // ============================
    // 📌 Rutas de la API
    // ============================
    this.app.use("/api/usuario", new UsuarioRoutes().getRouter());
    this.app.use("/api/ventas", new VentasRoutes().getRouter());
    this.app.use("/api/categorias", new CategoriaRoutes().getRouter());
    this.app.use("/api/ajustes-inventario", new AjusteInventarioRoutes().getRouter());
    this.app.use("/api/caja", new CajaRoutes().getRouter());
    this.app.use("/api/productos", new ProductoRouters().getRouter());
    this.app.use("/api/historial-ventas", new HistorialVentasRoutes().getRouter());
    this.app.use("/api/detalle-venta", new DetalleVentaRoutes().getRouter());
    this.app.use("/api/proveedores", new ProveedorRoutes().getRouter());
    this.app.use("/api/sucursales", new SucursalRoutes().getRouter());
    this.app.use("/api/gastos", new GastoRoutes().getRouter());

    // ============================
    // ❌ Ruta no encontrada
    // ============================
    this.app.use((req, res) => {
      console.log("❌ 404 - Ruta no encontrada:", req.originalUrl);
      res.status(404).json({ success: false, mensaje: "Ruta no encontrada" });
    });
  }

  getApp() {
    return this.app;
  }
}

module.exports = App;
