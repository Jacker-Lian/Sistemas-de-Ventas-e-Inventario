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
);
