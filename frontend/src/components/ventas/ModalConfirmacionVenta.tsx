//Aca estamos importanto todo lo necesario de la libreria react y lo estamos guardando en la variable React 
import React from "react";
//importamos los estilos de para la confirmacion del archivo registrarVenta
import "./registrarVenta.css";

//estamos creando un nuevo tipo llamado Props que define las propiedades que el componente ModalConfirmacionVenta va a recibir
type Props = {
    isOpen: boolean; // indica si algo esta abierto o cerrado (ventana modal en este caso)
    onConfirm: () => void; //se ejecuta cuando el usuario confirma la accion 
    onCancel: () => void; // se ejecuta cuando el usuario cancela la accion 
};
//definimos el componente ModalConfirmacionVenta como una funcion de React que recibe las propiedades definidas en el tipo Props
const ModalConfirmacionVenta: React.FC<Props> = ({ 
    isOpen = false, // valor por defecto es false
    onConfirm = () => {}, // funcion vacia por defecto
    onCancel = () => {} // funcion vacia por defecto
}) => {
    if (!isOpen) return null; // si isOpen es falso, no se renderiza nada y se retorna null

    return (
        
        <div className="modal-overlay" onClick={onCancel} role="presentation">
            <div
                className="modal" 
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-confirm-title"
                onClick={(e) => e.stopPropagation()}
            >
                <p id="modal-confirm-title" className="modal-message">  //esta linea es el mensaje que se muestra en la ventana modal
                    ¿Seguro que quieres ingresar esta venta?
                </p>
                <div className="modal-actions">
                    <button className="btn btn-confirm" onClick={onConfirm}> //este boton es para confirmar la accion
                        Confirmar
                    </button>
                    <button className="btn btn-cancel" onClick={onCancel}> // este boton es para cancelar la accion
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmacionVenta; // lo que estamos haciendo es exportando el componente ModalConfirmacionVenta para que pueda ser utilizado en otras partes de la aplicacion