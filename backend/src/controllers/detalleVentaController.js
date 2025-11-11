const DetalleVentaModel =require('../models/detalleVentaModel');
const detalleVentaModel = new DetalleVentaModel();
const detalleVentaController = {};

detalleVentaController.registrarDetalleVenta = async (req, res) =>{
    const datosDetalle = req.body;
    const {id_venta, id_producto, cantidad, precio_unitario, subtotal}= datosDetalle;

    if(!id_venta || !id_producto || !cantidad || !precio_unitario || !subtotal){
        return res.status(400).json({
            ok: false,
            msg: 'Faltan campos obligatorios para registrar el detalle de venta.'
        });
    }

    let connection;
    try{
        connection = await database.getConnection();
        const resultado = await detalleVentaModel.registrarDetalleVenta(datosDetalle, connection);

        res.status(201).json({
            ok: true,
            msg: 'Detalle de venta registrado con éxito.',
            detalle_id: resultado.insertId
        });
    }catch(error){
        console.error('Error en el controlador registrarDetalle:', error.message);
        res.status(500).json({
            ok:false,
            msg:'Error del servidor al registrar detalle de la venta.',
            error:error.message
        });
    }finally{
        //liberar conexion
        if(connection){
            connection.release();
        }
    }
};

detalleVentaController.obtenerDetallesPorVenta = async (req, res) => {
    const { idVenta } = req.params; 

    try {
        const detalles = await detalleVentaModelInstance.getDetallesPorVenta(idVenta);

        if (detalles.length > 0) {
            return res.status(200).json(detalles);
        } else {
            return res.status(404).json({ 
                mensaje: `No se encontraron detalles para la Venta con ID: ${idVenta}` 
            });
        }
    } catch (error) {
        console.error("Error en obtenerDetallesPorVenta:", error);
        return res.status(500).json({ 
            mensaje: "Error interno del servidor al obtener detalles de venta.",
            error: error.message 
        });
    }
};

module.exports = detalleVentaController;
