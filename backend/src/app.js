const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const UsuarioRoutes = require("./routes/usuarioRoutes");
const ventasRoutes = require("./routes/ventasRoutes");
const CategoriaRoutes = require('./routes/categoriaRoutes');
const AjusteInventarioRoutes = require("./routes/ajusteInventarioRoutes");
const CajaRoutes = require("./routes/cajaRoutes");
const ProductoRouters = require("./routes/productoRouters");
const HistorialVentasRoutes = require('./routes/historial-ventas.routes.js');
const detalleVentaRoutes = require('./routes/detalleVentaRoutes');
//const alertasRoutes = require("./routes/alertasRoutes");
const stockRouter = require("./routes/stockRoutes");

const gastoRoutes = require('./routes/gastoRoutes');

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
      "http://127.0.0.1:5173",       // para desarrollo local (codespaces?)
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
          Categorias: "/api/categorias",
          HistorialVentas: "/api/historial-ventas",
          DetalleVenta: "/api/detalle-venta",

        
          Stock: "/api/stock",
      
          Proveedores: "/api/proveedores",
          Gastos: "/api/gastos",
        },
      });
    });

    // Montar tus rutas de login
    const usuarioRoutes = new UsuarioRoutes();
    this.app.use("/api/usuario", usuarioRoutes.getRouter());

    //RUTAS DE COMPAÑEROS (RESTAURADAS)
    // Montar rutas de ventas
    const ventasRoutesInstance = new ventasRoutes();
    this.app.use("/api/ventas", ventasRoutesInstance.getRouter());

    // Montar rutas de categorías
    const categoriaRoutes = new CategoriaRoutes();
    this.app.use('/api/categorias', categoriaRoutes.getRouter());

    // Montar rutas de ajustes de inventario
    const ajusteInventarioRoutesInstance = new AjusteInventarioRoutes();
    this.app.use("/api/ajustes-inventario", ajusteInventarioRoutesInstance.getRouter());

    // Montar rutas de detalle de venta
    const detalleVentaRoutesInstance = new detalleVentaRoutes();
    this.app.use(
      "/api/detalle-venta",
      detalleVentaRoutesInstance.getRouter()
    );


    // Montar rutas de gastos
    const gastoRoutesInstance = new gastoRoutes();
    this.app.use("/api/gastos", gastoRoutesInstance.getRouter());
    // Montar rutas para la gestion de caja
    const cajaRoutesInstance = new CajaRoutes();
    this.app.use("/api/caja", cajaRoutesInstance.getRouter());
    // Montar rutas de productos
    const productoRoutersInstance = new ProductoRouters();
    this.app.use("/api/productos", productoRoutersInstance.getRouter());

    // Montar ruta para mostrar historial ventas
    const historialVentasRoutesInstance = new HistorialVentasRoutes();
    this.app.use(
      "/api/historial-ventas",
      historialVentasRoutesInstance.getRouter()
    );


  
    // 2. Montar Router de STOCK
    this.app.use("/api", stockRouter);
    console.log("DEBUG: Router de Stock montado en /api.");




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