import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import axios from 'axios';

type Proveedor = {
  id_proveedor: number;
  nombre: string;
  ruc?: string;
  telefono?: string;
  direccion?: string;
  correo?: string;
  producto_principal?: string;
};

const Proveedor = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(false);
  const [proveedorActual, setProveedorActual] = useState<Proveedor | null>(
    null
  );
  const [form] = Form.useForm();

  // ✅ URL base configurable desde .env
  const baseURL = import.meta.env.VITE_SERVER_URL;

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'RUC',
      dataIndex: 'ruc',
      key: 'ruc',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
    },
    {
      title: 'Correo',
      dataIndex: 'correo',
      key: 'correo',
    },
    {
      title: 'Producto Principal',
      dataIndex: 'producto_principal',
      key: 'producto_principal',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_: any, record: Proveedor) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditar(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Está seguro de eliminar este proveedor?"
            onConfirm={() => handleEliminar(record.id_proveedor)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ✅ Cargar proveedores al montar el componente
  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/api/proveedores`);
      setProveedores(response.data);
    } catch (error) {
      message.error('Error al cargar proveedores');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevo = () => {
    setEditando(false);
    setProveedorActual(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditar = (proveedor: Proveedor) => {
    setEditando(true);
    setProveedorActual(proveedor);
    form.setFieldsValue(proveedor);
    setModalVisible(true);
  };

  const handleEliminar = async (id: number) => {
    try {
      await axios.delete(`${baseURL}/api/proveedores/${id}`);
      message.success('Proveedor eliminado exitosamente');
      cargarProveedores();
    } catch (error) {
      message.error('Error al eliminar proveedor');
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editando && proveedorActual) {
        await axios.put(
          `${baseURL}/api/proveedores/${proveedorActual.id_proveedor}`,
          values
        );
        message.success('Proveedor actualizado exitosamente');
      } else {
        await axios.post(`${baseURL}/api/proveedores`, values);
        message.success('Proveedor creado exitosamente');
      }
      setModalVisible(false);
      form.resetFields();
      cargarProveedores();
    } catch (error) {
      message.error('Error al guardar proveedor');
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2>Gestión de Proveedores</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleNuevo}>
          Nuevo Proveedor
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={proveedores}
        rowKey="id_proveedor"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title={editando ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'El nombre es requerido' }]}
          >
            <Input placeholder="Nombre del proveedor" />
          </Form.Item>

          <Form.Item label="RUC" name="ruc">
            <Input type="number" placeholder="RUC del proveedor" maxLength={11} />
          </Form.Item>

          <Form.Item label="Teléfono" name="telefono">
            <Input placeholder="Teléfono de contacto" maxLength={20} />
          </Form.Item>

          <Form.Item label="Dirección" name="direccion">
            <Input placeholder="Dirección del proveedor" maxLength={150} />
          </Form.Item>

          <Form.Item
            label="Correo"
            name="correo"
            rules={[{ type: 'email', message: 'Ingrese un correo válido' }]}
          >
            <Input placeholder="correo@ejemplo.com" maxLength={100} />
          </Form.Item>

          <Form.Item label="Producto Principal" name="producto_principal">
            <Input
              placeholder="Producto principal que suministra"
              maxLength={100}
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>Cancelar</Button>
              <Button type="primary" htmlType="submit">
                {editando ? 'Actualizar' : 'Crear'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Proveedor;
