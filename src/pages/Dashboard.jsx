import { useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, DatePicker } from 'antd';
import { CalendarOutlined, TeamOutlined, FieldTimeOutlined, DollarOutlined } from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import useStore from '../store';
import moment from 'moment';

const Dashboard = () => {
  const { user, reservations, courts, loading, loadReservations, loadCourts } = useStore();

  useEffect(() => {
    loadReservations();
    loadCourts();
  }, [loadReservations, loadCourts]);

  const chartData = reservations
    .filter(reservation => moment(reservation.date).isAfter(moment().subtract(30, 'days')))
    .map(reservation => ({
      date: moment(reservation.date).format('YYYY-MM-DD'),
      count: 1,
    }))
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.date === curr.date);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push(curr);
      }
      return acc;
    }, [])
    .sort((a, b) => moment(a.date).diff(moment(b.date)));

  const courtData = courts.map(court => ({
    type: court.name,
    value: reservations.filter(r => r.courtId === court.id).length,
  }));

  const lineConfig = {
    data: chartData,
    xField: 'date',
    yField: 'count',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    height: 300,
  };

  const pieConfig = {
    data: courtData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    height: 300,
  };

  const columns = [
    {
      title: 'Cancha',
      dataIndex: 'courtId',
      key: 'courtId',
      render: (courtId) => courts.find(c => c.id === courtId)?.name || 'N/A',
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Hora',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ 
          color: status === 'confirmada' ? '#52c41a' : 
                 status === 'pendiente' ? '#faad14' : '#f5222d' 
        }}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
  ];

  const totalReservations = reservations.length;
  const activeReservations = reservations.filter(r => r.status === 'confirmada').length;
  const totalRevenue = reservations.reduce((acc, curr) => {
    const court = courts.find(c => c.id === curr.courtId);
    return acc + (court?.pricePerHour || 0);
  }, 0);

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Reservas Totales"
              value={totalReservations}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Reservas Activas"
              value={activeReservations}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Ingresos Totales"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Reservas Recientes" style={{ height: '100%' }}>
            <Table
              dataSource={reservations.slice(0, 5)}
              columns={columns}
              loading={loading}
              pagination={false}
              rowKey="id"
              scroll={{ y: 300 }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Reservas por Día" style={{ height: '100%' }}>
            <Line {...lineConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="Distribución de Reservas por Cancha">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 