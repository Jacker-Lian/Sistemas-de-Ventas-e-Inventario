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
  const [proveedorActual, setProveedorActual] = useState<Proveedor | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [form] = Form.useForm();

  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const columns = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'RUC', dataIndex: 'ruc', key: 'ruc' },
    { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono' },
    { title: 'Dirección', dataIndex: 'direccion', key: 'direccion' },
    { title: 'Correo', dataIndex: 'correo', key: 'correo' },
    { title: 'Producto Principal', dataIndex: 'producto_principal', key: 'producto_principal' },
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
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
    } finally {
      setLoading(false);
    }
  };

  const buscarProveedores = async () => {
    const query = busqueda.trim();
    if (!query) {
      message.warning('Ingrese un texto de búsqueda');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/api/proveedores/buscar`, {
        params: { query },
      });
      setProveedores(response.data);
    } catch {
      message.error('Error al buscar proveedores');
    } finally {
      setLoading(false);
    }
  };

  const handleMostrarTodo = () => {
    setBusqueda('');
    cargarProveedores();
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
      message.success('Proveedor eliminado');
      cargarProveedores();
    } catch {
      message.error('Error al eliminar proveedor');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editando && proveedorActual) {
        await axios.put(`${baseURL}/api/proveedores/${proveedorActual.id_proveedor}`, values);
        message.success('Proveedor actualizado');
      } else {
        await axios.post(`${baseURL}/api/proveedores`, values);
        message.success('Proveedor creado');
      }
      setModalVisible(false);
      form.resetFields();
      cargarProveedores();
    } catch {
      message.error('Error al guardar proveedor');
    }
  };

  return (
    <div style={{ padding: '20px' }}>

      {/* ------------------------------ */}
      {/* 🔵 Encabezado estilizado */}
      {/* ------------------------------ */}
      <div
        style={{
          background: '#0077b6',
          padding: '14px 20px',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            margin: 0,
            color: 'white',
            fontSize: '26px',
            fontWeight: 'bold',
            letterSpacing: '1px',
          }}
        >
          Gestión de Proveedores
        </h2>
      </div>

      {/* BUSCADOR */}
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Input
            placeholder="Buscar por nombre, RUC, teléfono, dirección..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ maxWidth: 320 }}
            allowClear
          />
          <Button type="primary" onClick={buscarProveedores}>
            Buscar
          </Button>
          <Button onClick={handleMostrarTodo}>Mostrar todo</Button>
        </div>

        <Button type="primary" icon={<PlusOutlined />} onClick={handleNuevo}>
          Nuevo proveedor
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
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Nombre" name="nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="RUC" name="ruc">
            <Input maxLength={11} />
          </Form.Item>

          <Form.Item label="Teléfono" name="telefono">
            <Input maxLength={20} />
          </Form.Item>

          <Form.Item label="Dirección" name="direccion">
            <Input maxLength={150} />
          </Form.Item>

          <Form.Item label="Correo" name="correo" rules={[{ type: 'email' }]}>
            <Input maxLength={100} />
          </Form.Item>

          <Form.Item label="Producto Principal" name="producto_principal">
            <Input maxLength={100} />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>Cancelar</Button>
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
