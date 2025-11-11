const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const UsuarioRoutes = require("./routes/usuarioRoutes");
const ventasRoutes = require("./routes/ventasRoutes");
const AjusteInventarioRoutes = require("./routes/ajusteInventarioRoutes");
const HistorialVentasRoutes = require('./routes/historial-ventas.routes.js');
const AlertasRoutes = require("./routes/alertasRoutes");
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
      "http://localhost:5173",       // para desarrollo local
      "http://38.250.161.15"         // para producción
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
    // Middleware para logear todas las peticiones
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
          HistorialVentas: "api/historial-ventas",
          Alertas: "/api/alertas",
          Stock: "/api/stock"
        },
      });
    });

    // 🌟 MONTAJE DE PRUEBA 1: Solo Usuario
    // Montar tus rutas de login
    const usuarioRoutes = new UsuarioRoutes();
    this.app.use("/api/usuario", usuarioRoutes.getRouter()); // <--- Probamos esta

    // Montar rutas de ventas (COMENTADA)
  //  const ventasRoutesInstance = new ventasRoutes();
    //this.app.use("/api/ventas", ventasRoutesInstance.getRouter());

    // Montar rutas de ajustes de inventario (COMENTADA)
   // const ajusteInventarioRoutesInstance = new AjusteInventarioRoutes();
    //this.app.use("/api/ajustes-inventario", ajusteInventarioRoutesInstance.getRouter());

    // Montar ruta para mostrar historial ventas (COMENTADA)
   // const historialVentasRoutesInstance = new HistorialVentasRoutes();
   // this.app.use(
   //   "/api/historial-ventas",
    //  historialVentasRoutesInstance.getRouter()
   // );


    // Montar ruta alertas de inventario (COMENTADA)
    //const alertasRoutesInstance = new AlertasRoutes();
    //this.app.use("/api/alertas", alertasRoutesInstance.getRouter());

    this.app.use("/api", stockRouter);
    console.log("DEBUG A.4: Router de Stock montado en /api.");





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
  