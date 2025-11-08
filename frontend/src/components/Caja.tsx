import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

interface Producto {
  id_producto: number;
  nombre: string;
  precio_venta: number;
  stock: number;
}

interface CarritoItem {
  id_producto: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    padding: "1rem",
  },
  menu: {
    border: "1px solid #023e8a",
    borderRadius: "8px",
    padding: "1rem",
  },
  carrito: {
    border: "1px solid #00b4d8",
    borderRadius: "8px",
    padding: "1rem",
    background: "#f8f9fa",
  },
  producto: {
    borderBottom: "1px solid #ccc",
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carritoItem: {
    fontSize: "0.9rem",
    borderBottom: "1px dashed #999",
    padding: "5px 0",
  },
  total: {
    marginTop: "1rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#023e8a",
  },
  button: {
    background: "#0077b6",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
    marginLeft: "10px",
  },
  registrarButton: {
    background: "#00b4d8",
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    width: "100%",
    fontSize: "1.1rem",
    marginTop: "10px",
  },
};
function Caja() {

  const [menuDeProductos, setMenuDeProductos] = useState<Producto[]>([]); //lista de prodcutos
  const [carrito, setCarrito] = useState<CarritoItem[]>([]); //carrito que guarda productos escogidos
  const [total, setTotal] = useState(0); //precio total
const { user } = useAuth();

  useEffect(() => {
    const cargarMenu = async () => {
      try{
        //aqui se deberia traer la lista de PRODUCTOS pero aun no hay el modelo, ruta o controlaador de ello
        //entonces pondre datos de prueba
        const menuSimulado: Producto[] = [
          { id_producto: 7, nombre: "Gaseosa", precio_venta: 3.00, stock: 50 },
          { id_producto: 8, nombre: "Papas Fritas", precio_venta: 5.00, stock: 30 },
          { id_producto: 9, nombre: "Hamburguesa", precio_venta: 12.00, stock: 20 }
        ];
        setMenuDeProductos(menuSimulado);

      }catch(error){
        console.error("error al cargar el menu: ", error);
      }
    };
     cargarMenu();
  }, []);

  const agregarAlCarrito = (producto: Producto) =>{
    const itemExistente = carrito.find(item => item.id_producto === producto.id_producto);
    const cantidad = 1;

    if(cantidad > producto.stock){
      alert(`No hay stock suficiente. Solo quedan ${producto.stock} unidades`); //stock esta en otra tabla REVISAR
      return;
    }
    
    const itemNuevo : CarritoItem ={
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      cantidad:cantidad,
      precio_unitario:producto.precio_venta,
      subtotal:cantidad * producto.precio_venta
    };

    setCarrito(carritoActual => [...carritoActual, itemNuevo]);

    setTotal(totalActual => totalActual + itemNuevo.subtotal);

    console.log("item agregado al carrito: ", itemNuevo);
  }

  const handleRegistrarVenta = async () => {
    if(carrito.length === 0){
      alert("no hay productos en el carrito.");
      return;
    }
    const idUsuarioLogueado = 2;
    if( !idUsuarioLogueado){
      alert("Error: no se encontro el usuario. Vuelve a iniciar sesion");
      return;
    }

    const datosVenta ={
      id_usuario: idUsuarioLogueado,
      id_caja: 1,
      tipo_cliente: "ALUMNO",
      metodo_pago: "YAPE",
      total: total,
      detalles:carrito
    };

    console.log("Enviando este paquete al backend", datosVenta);
    try{
      const respuesta = await api.post("/ventas/registrar", datosVenta);

      alert(`Venta registrada exitosamente!`)
      setCarrito([]);
      setTotal(0);
    } catch(error:any){
      console.error("Error al registrar la venta: ", error);
      alert("Error al registrar la venta: "+(error.response?.data?.message|| error.message));
    }
  };

  // --- EL HTML (JSX) PARA MOSTRAR TODO ---
  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.menu}>
          <h3>Lista de Productos</h3>
          {menuDeProductos.map((prod) => (
            <div key={prod.id_producto} style={styles.producto}>
              <div>
                <strong>{prod.nombre}</strong>
                <br />
                Precio: S/ {prod.precio_venta.toFixed(2)} | Stock: {prod.stock}
              </div>
              <button
                style={styles.button}
                onClick={() => agregarAlCarrito(prod)}
              >
                Agregar
              </button>
            </div>
          ))}
        </div>

        <div style={styles.carrito}>
          <h3>Carrito de Venta</h3>
          {carrito.length === 0 && <p>El carrito está vacío.</p>}

          {carrito.map((item) => (
            <div key={item.id_producto} style={styles.carritoItem}>
              {item.cantidad} x {item.nombre} (S/ {item.precio_unitario.toFixed(2)})
              <strong style={{ float: "right" }}>
                S/ {item.subtotal.toFixed(2)}
              </strong>
            </div>
          ))}

          <div style={styles.total}>
            TOTAL: S/ {total.toFixed(2)}
          </div>

          <button
            style={styles.registrarButton}
            onClick={handleRegistrarVenta}
            disabled={carrito.length === 0}
          >
            Registrar Venta
          </button>
        </div>
      </div>
    </>
  );
}
export default Caja;
