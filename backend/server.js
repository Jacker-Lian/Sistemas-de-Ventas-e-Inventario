require('dotenv').config();
console.log("-----------------------------------------");
console.log("DIAGNÓSTICO INICIADO EN server.js");
console.log(`DEBUG S.1: Entorno de Node.js: ${process.version}`);
console.log(`DEBUG S.2: Variables de Entorno (.env) cargadas.`);
console.log("-----------------------------------------");

// Carga de módulos
try {
    const App = require('./src/app');
    console.log("DEBUG S.3: Módulo App cargado correctamente (Tipo:", typeof App, ").");
    global.AppModule = App; // Guardar en global por si la variable local se pierde
} catch (error) {
    console.error("ERROR CRÍTICO EN S.3 (require('./src/app')): ", error.message);
    process.exit(1);
}

try {
    const database = require('./src/config/database');
    console.log("DEBUG S.4: Módulo database cargado correctamente (Tipo:", typeof database, ").");
    global.DatabaseModule = database;
} catch (error) {
    console.error("ERROR CRÍTICO EN S.4 (require('./src/config/database')): ", error.message);
    process.exit(1);
}


class Server {
  constructor() {
    console.log("DEBUG S.5: Constructor de Server iniciado.");
    this.port = process.env.PORT || 3000;
    console.log(`DEBUG S.6: Puerto de la aplicación: ${this.port}`);

    try {
        // 🌟 ESTA LÍNEA EJECUTA EL CONSTRUCTOR DE APP Y CONFIGURARRUTAS
        this.app = new AppModule().getApp(); 
        console.log("DEBUG S.7: Instancia de Express (this.app) creada con éxito.");
    } catch (error) {
        console.error("ERROR CRÍTICO EN S.7 (new App().getApp()): ", error.message);
        console.error("Stacktrace del error de App (Busca el fallo en app.js):", error.stack);
        process.exit(1);
    }
  }

  async iniciar() {
    try {
      console.log('DEBUG S.8: Intentando conexión a MySQL...');
      await global.DatabaseModule.connect();
      console.log('DEBUG S.9: Conexión a MySQL exitosa.');

      this.app.listen(this.port, '0.0.0.0', () => {
        console.log("-----------------------------------------");
        console.log(`El Servidor esta corriendo en http://localhost:${this.port}`);
        console.log('Presiona Ctrl+C para detener el servidor');
        console.log("-----------------------------------------");
      });
    } catch (error) {
      console.error('\nERROR FATAL AL INICIAR/CONECTAR:', error);
      process.exit(1);
    }
  }
}

try {
    const server = new Server();
    console.log("DEBUG S.10: Instancia de Server creada.");
    server.iniciar();
} catch (error) {
    console.error("ERROR AL INSTANCIAR SERVER:", error.message);
    process.exit(1);
}