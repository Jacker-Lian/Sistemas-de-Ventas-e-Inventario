const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const UsuarioRoutes = require("./routes/usuarioRoutes");
const ventasRoutes = require("./routes/ventasRoutes");
const AjusteInventarioRoutes = require("./routes/ajusteInventarioRoutes");
const ProductoRouters = require("./routes/productoRouters");
const HistorialVentasRoutes = require('./routes/historial-ventas.routes.js');
const alertasRoutes = require("./routes/alertasRoutes");
const stockRouter = require("./routes/stockRoutes");


class App {
  constructor() {
    this.app = express();
    this.configurarMiddlewares();
    this.configurarRutas();
  }

  configurarMiddlewares() {
    const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

    const ALLOWED_ORIGINS = [
      "http://localhost:5173",
      "http://38.250.161.15"
    ];

    this.app.use(cors({
      origin: function (origin, callback) {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("CORS no permitido para este origen: " + origin));
        }
      },
      credentials: true
    }));

    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Log de peticiones
    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
  }

  configurarRutas() {
    this.app.get("/", (req, res) => {
      res.json({
        mensaje: "Backend de Sistema de Ventas e Inventario funcionando",
        endpoints: {
          Login: "/api/usuario",
          Ventas: "/api/ventas",
          AjustesInventario: "/api/ajustes-inventario",
          Productos: "/api/productos",
          HistorialVentas: "/api/historial-ventas",
          Alertas: "/api/alertas",
          Stock: "/api/stock"
        },
      });
    });

    // Usuario
    const usuarioRoutes = new UsuarioRoutes();
    this.app.use("/api/usuario", usuarioRoutes.getRouter());

    // Productos
    const productoRoutersInstance = new ProductoRouters();
    this.app.use("/api/productos", productoRoutersInstance.getRouter());

    // Historial de Ventas
    const historialVentasRoutesInstance = new HistorialVentasRoutes();
    this.app.use("/api/historial-ventas", historialVentasRoutesInstance.getRouter());

    this.app.use("/api", alertasRoutes);
    console.log("DEBUG A.5: Router de Alertas montado en /api.");

    // 2. Montar Router de STOCK
    this.app.use("/api", stockRouter);
    console.log("DEBUG A.4: Router de Stock montado en /api.");

    // 404
    this.app.use((req, res) => {
      res.status(404).json({ success: false, mensaje: "Ruta no encontrada" });
    });
  }

  getApp() {
    return this.app;
  }
}

module.exports = App;
