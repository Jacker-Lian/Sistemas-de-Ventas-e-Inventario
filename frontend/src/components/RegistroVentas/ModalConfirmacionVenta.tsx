//Aca estamos importanto todo lo necesario de la libreria react y lo estamos guardando en la variable React 
import React from "react";
//importamos los estilos de para la confirmacion del archivo registrarVenta
import "../../styles/registrarVenta.css";

//estamos creando un nuevo tipo llamado Props que define las propiedades que el componente ModalConfirmacionVenta va a recibir
type Props = {
    isOpen: boolean; // indica si algo esta abierto o cerrado (ventana modal en este caso)
    titulo?: string; // titulo del modal (opcional)
    mensaje?: string; // mensaje del modal (opcional)
    labelConfirm?: string; // etiqueta del botón confirmar (opcional)
    labelCancel?: string; // etiqueta del botón cancelar (opcional)
    onConfirm: () => void; //se ejecuta cuando el usuario confirma la accion 
    onCancel: () => void; // se ejecuta cuando el usuario cancela la accion 
};
//definimos el componente ModalConfirmacionVenta como una funcion de React que recibe las propiedades definidas en el tipo Props
const ModalConfirmacionVenta: React.FC<Props> = ({ 
    isOpen = false, // valor por defecto es false
    titulo = "¿Seguro que quieres ingresar esta venta?", // titulo por defecto
    mensaje, // mensaje personalizado
    labelConfirm = "Confirmar", // etiqueta por defecto para botón confirmar
    labelCancel = "Cancelar", // etiqueta por defecto para botón cancelar
    onConfirm = () => {}, // funcion vacia por defecto
    onCancel = () => {} // funcion vacia por defecto
}) => {
    if (!isOpen) return null; // si isOpen es falso, no se renderiza nada y se retorna null

    const handleConfirm = () => {
        onConfirm();
        onCancel();
    };

    return (
        <div className="modal-overlay" onClick={onCancel} role="presentation">
            <div
                className="modal" 
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-confirm-title"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="modal-confirm-title" className="modal-title">
                    {titulo}
                </h2>
                {mensaje && (
                    <p className="modal-message">
                        {mensaje}
                    </p>
                )}
                <div className="modal-actions">
                    <button className="btn btn-confirm" onClick={handleConfirm}>
                        {labelConfirm}
                    </button>
                    <button className="btn btn-cancel" onClick={onCancel}>
                        {labelCancel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmacionVenta; // lo que estamos haciendo es exportando el componente ModalConfirmacionVenta para que pueda ser utilizado en otras partes de la aplicacion