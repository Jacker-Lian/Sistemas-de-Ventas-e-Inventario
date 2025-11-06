require('dotenv').config();
const App = require('./src/app');
const database = require('./src/config/database');

class Server {
  constructor() {
    this.port = process.env.PORT || 3000;
    this.app = new App().getApp();
  }

  async iniciar() {
    try {
      console.log('Conectando a MySQL...');
      await database.connect();

      this.app.listen(this.port, () => {
        console.log(`El Servidor esta corriendo en http://localhost:${this.port}`);
        console.log('Presiona Ctrl+C para detener el servidor');
      });
    } catch (error) {
      console.error('Error al iniciar el servidor:', error);
      process.exit(1);
    }
  }
}

const server = new Server();
server.iniciar();