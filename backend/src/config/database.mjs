import mysql from "mysql2";
import dotenv from 'dotenv';
dotenv.config();

/**  módulo de conexión a la base de datos mysql
**/
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true //para que las fechas se vean bien
}).promise();

// verificar la conexión a la base de datos (solo una vez)
(async () => {
  try {
    const conexion = await pool.getConnection();
    console.log("Conexión a MySQL establecida.");
    conexion.release();
  } catch (error) {
    console.error("Error al conectar con MySQL:", error.message);
  }
})();

// error de conexion por servidor safjiasnj
pool.on("error", (err) => {
  console.error("error con la base de datos:", err);
});

export default pool;