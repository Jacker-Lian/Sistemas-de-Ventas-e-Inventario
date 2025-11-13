import { useState, useEffect } from 'react';
import { Button, message, Spin, Form, InputNumber, Select } from 'antd';
import { CheckOutlined, LoadingOutlined, LoginOutlined, LogoutOutlined, PlusOutlined } from '@ant-design/icons';
import Navbar from '../Navbar'; // Mantenemos el Navbar
import { useAuth } from '../../context/AuthContext'; // Para obtener el user.id_usuario
import type { Caja as CajaType, MovimientoCaja } from '../../types/caja';
import * as cajaApi from '../../api/cajaApi';
import dayjs from 'dayjs';
import './Caja.css';

const { Option } = Select;

function Caja() {
  const { user } = useAuth();
  const [cajaAbierta, setCajaAbierta] = useState<CajaType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMovimiento] = Form.useForm<Omit<MovimientoCaja, 'id_caja'>>();

  // Cargar el estado de la caja al iniciar
  useEffect(() => {
    if (user?.id_usuario) {
      buscarCajaAbierta();
    }
  }, [user]);

  /**
   * Busca si el usuario actual tiene una caja abierta.
   */
  const buscarCajaAbierta = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // 1. Pedimos todas las cajas abiertas
      const { data: cajasAbiertas } = await cajaApi.fetchCajasPorEstado('ABIERTA');
      
      // 2. Filtramos en el frontend para encontrar la de este usuario
      // (Esta lógica es más robusta si el backend asegura una sola caja abierta por usuario)
      const miCaja = cajasAbiertas.find(c => c.id_usuario === user.id_usuario);

      if (miCaja) {
        setCajaAbierta(miCaja);
      } else {
        setCajaAbierta(null);
      }
    } catch (error) {
      console.error("Error al buscar caja abierta:", error);
      message.error('Error al verificar el estado de la caja.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejador para el botón de Abrir Caja
   */
  const handleAbrirCaja = async () => {
    if (!user) {
      message.error("No se ha podido identificar al usuario.");
      return;
    }
    
    // Asumimos que la sucursal está en el objeto user.
    // Si 'id_sucursal' puede ser null, asegúrate que el backend lo maneje.
    if (user.id_sucursal === undefined) {
       console.warn("ID de sucursal no encontrado en el objeto de usuario. Enviando null.");
    }

    setIsSubmitting(true);
    try {
      const { data } = await cajaApi.abrirCaja(user.id_usuario, user.id_sucursal ?? null);
      message.success(`Caja #${data.id_caja} abierta exitosamente.`);
      // Volvemos a buscar la caja para actualizar el estado
      await buscarCajaAbierta();
    } catch (error: any) {
      console.error("Error al abrir caja:", error);
      const errorMsg = error.response?.data?.message || 'Error al abrir la caja.';
      message.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  //Manejador para el formulario de registrar movimiento
  
  const handleRegistrarMovimiento = async (values: Omit<MovimientoCaja, 'id_caja'>) => {
    if (!cajaAbierta) return;

    const movimientoData: MovimientoCaja = {
      ...values,
      id_caja: cajaAbierta.id_caja,
    };

    setIsSubmitting(true);
    try {
      await cajaApi.registrarMovimiento(movimientoData);
      message.success('Movimiento registrado correctamente.');
      formMovimiento.resetFields();
      // Recargamos los datos de la caja para ver saldos actualizados
      await buscarCajaAbierta(); 
    } catch (error: any) {
      console.error("Error al registrar movimiento:", error);
      const errorMsg = error.response?.data?.message || 'Error al registrar el movimiento.';
      message.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Manejador para el botón de Cerrar Caja
   */
  const handleCerrarCaja = async () => {
    if (!cajaAbierta) return;

    setIsSubmitting(true);
    try {
      await cajaApi.cerrarCaja(cajaAbierta.id_caja);
      message.success(`Caja #${cajaAbierta.id_caja} cerrada exitosamente.`);
      setCajaAbierta(null); // Actualizamos estado a cerrado
    } catch (error: any) {
      console.error("Error al cerrar caja:", error);
      const errorMsg = error.response?.data?.message || 'Error al cerrar la caja.';
      message.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Renderizado ---

  const renderLoader = () => (
    <div className="caja-loader">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    </div>
  );

  const renderCajaCerrada = () => (
    <div className="caja-cerrada-container">
      <h2>Gestión de Caja</h2>
      <p>Actualmente no tienes una caja abierta.</p>
      <Button
        type="primary"
        size="large"
        icon={<LoginOutlined />}
        loading={isSubmitting}
        onClick={handleAbrirCaja}
      >
        Abrir Caja
      </Button>
    </div>
  );

  const renderCajaAbierta = () => {
    if (!cajaAbierta) return null;
    
    const ingresos = parseFloat(String(cajaAbierta.total_ingresos));
    const egresos = parseFloat(String(cajaAbierta.total_egresos));
    const neto = ingresos - egresos;

    return (
      <div className="caja-abierta-dashboard">
        {/* Columna Izquierda: Información y Saldos */}
        <div className="caja-info-card">
          <div className="caja-info-header">
            <h3>Caja Abierta (ID: {cajaAbierta.id_caja})</h3>
            <Button
              danger
              type="primary"
              icon={<LogoutOutlined />}
              loading={isSubmitting}
              onClick={handleCerrarCaja}
            >
              Cerrar Caja
            </Button>
          </div>
          <p>
            <strong>Usuario:</strong> {user?.nombre_usuario} <br />
            <strong>Apertura:</strong> {dayjs(cajaAbierta.fecha_apertura).format('DD/MM/YYYY hh:mm A')}
          </p>

          <div className="caja-info-saldos">
            <div className="saldo-item ingresos">
              <span>(+) Ingresos</span>
              <strong>S/ {ingresos.toFixed(2)}</strong>
            </div>
            <div className="saldo-item egresos">
              <span>(-) Egresos</span>
              <strong>S/ {egresos.toFixed(2)}</strong>
            </div>
            <div className="saldo-item neto">
              <span>(=) Saldo Neto</span>
              <strong>S/ {neto.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Registrar Movimiento */}
        <div className="caja-movimiento-card">
          <h3>Registrar Movimiento</h3>
          <Form
            form={formMovimiento}
            layout="vertical"
            onFinish={handleRegistrarMovimiento}
            disabled={isSubmitting}
          >
            <Form.Item
              label="Tipo de Movimiento"
              name="tipo"
              rules={[{ required: true, message: 'Seleccione el tipo' }]}
            >
              <Select placeholder="Seleccione Ingreso o Egreso">
                <Option value="INGRESO">INGRESO (Entrada de dinero)</Option>
                <Option value="EGRESO">EGRESO (Salida de dinero)</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Monto (S/)"
              name="monto"
              rules={[{ required: true, message: 'Ingrese el monto' }]}
            >
              <InputNumber
                min={0.01}
                precision={2}
                style={{ width: '100%' }}
                placeholder="Ej: 50.00"
              />
            </Form.Item>
            
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={isSubmitting}
                style={{ width: '100%' }}
              >
                Registrar Movimiento
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="caja-module-container">
        {isLoading ? renderLoader() : (cajaAbierta ? renderCajaAbierta() : renderCajaCerrada())}
      </div>
    </>
  );
}

export default Caja;
