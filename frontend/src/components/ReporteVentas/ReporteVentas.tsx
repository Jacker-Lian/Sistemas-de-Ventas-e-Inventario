import { useState, useEffect } from 'react';
import { Table, Space, DatePicker, Button, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
const Base_url = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

interface VentaProducto {
  id_producto: number;
  nombre: string;
  cantidad_vendida: string;
  total_recaudado: string;
}

const { RangePicker } = DatePicker;

const ReporteVentas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [fechas, setFechas] = useState({
    fechaInicio: dayjs().startOf('month').format('YYYY-MM-DD'),
    fechaFin: dayjs().format('YYYY-MM-DD')
  });

  const columns: ColumnsType<VentaProducto> = [
    {
      title: 'Producto',
      dataIndex: 'nombre_producto',
      key: 'nombre_producto',
    },
    {
      title: 'Cantidad Vendida',
      dataIndex: 'cantidad_vendida',
      key: 'cantidad_vendida',
      align: 'right',
    },
    {
      title: 'Total Recaudado (S/)',
      dataIndex: 'total_recaudado',
      key: 'total_recaudado',
      align: 'right',
      render: (text) => `S/ ${parseFloat(text).toFixed(2)}`
    },
  ];

  const cargarReporte = async () => {
    try {
      setLoading(true);
      setError(undefined);
      const response = await axios.get(`${Base_url}/api/ventas/reporte-ventas-por-producto`, {
        params: {
          fechaInicio: fechas.fechaInicio,
          fechaFin: fechas.fechaFin
        }
      });
      setData(response.data);
    } catch (err) {
      setError('Error al cargar el reporte. Intente nuevamente.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReporte();
  }, []);

  const handleBuscar = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setFechas({
        fechaInicio: dates[0].format('YYYY-MM-DD'),
        fechaFin: dates[1].format('YYYY-MM-DD')
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Reporte de Ventas por Producto</h2>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space>
          <RangePicker 
            format="YYYY-MM-DD"
            onChange={handleBuscar}
            defaultValue={[dayjs(fechas.fechaInicio), dayjs(fechas.fechaFin)]}
          />
          <Button 
            type="primary" 
            icon={<SearchOutlined />} 
            onClick={cargarReporte}
            loading={loading}
          >
            Buscar
          </Button>
        </Space>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id_producto"
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
          summary={(pageData: VentaProducto[]) => {
            let totalVentas = 0;
            let totalUnidades = 0;

            pageData.forEach(({ total_recaudado, cantidad_vendida }) => {
              totalVentas += parseFloat(total_recaudado);
              totalUnidades += parseInt(cantidad_vendida);
            });

            return (
              <Table.Summary.Row style={{ fontWeight: 'bold' }}>
                <Table.Summary.Cell index={0} align="center">Total</Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">{totalUnidades}</Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right">S/ {totalVentas.toFixed(2)}</Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      </Space>
    </div>
  );
};

export default ReporteVentas;