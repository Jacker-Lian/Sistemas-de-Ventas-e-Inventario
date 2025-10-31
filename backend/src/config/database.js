const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

let pool;

function createPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      decimalNumbers: true
    });
  }
  return pool;
}

module.exports = {
  getPool: () => createPool(),

  connect: async () => {
    try {
      const pool = createPool();
      await pool.query('SELECT 1');
      console.log('MySQL conectado correctamente');
      return pool;
    } catch (error) {
      console.error('Error al conectar con MySQL:', error.message);
      throw error;
    }
  }
};
