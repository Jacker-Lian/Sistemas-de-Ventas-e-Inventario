import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import gastosRoutes from "./src/routes/gastos.router.mjs";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// mi backend
app.use("/api/gastos", gastosRoutes);

app.listen(PORT, () => {
  console.log(`el servidor se esta corriendo en http://localhost:${PORT}`);
});