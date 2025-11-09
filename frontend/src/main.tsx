<<<<<<< HEAD
import React from "react";
import ReactDOM from "react-dom/client";
import { ProveedorForm } from "./pages/Proveedores/ProveedorForm";
import { ProveedoresList } from "./pages/Proveedores/ProveedoresList";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ProveedorForm />
    <hr />
    <ProveedoresList />
  </React.StrictMode>
=======
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
>>>>>>> origin/main
);
