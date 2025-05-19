import { useEffect, useState } from 'react';
import { Row, Col, Card, Select, DatePicker } from 'antd';
import { Line, Pie, Column } from '@ant-design/charts';
import useStore from '../store';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Statistics = () => {
  const { reservations, courts, loadReservations } = useStore();
  const [dateRange, setDateRange] = useState([moment().subtract(30, 'days'), moment()]);
  const [selectedCourt, setSelectedCourt] = useState('all');

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const reservationsByDay = reservations
    .filter(r => {
      const date = moment(r.date);
      return date.isBetween(dateRange[0], dateRange[1], 'day', '[]') &&
             (selectedCourt === 'all' || r.courtId === parseInt(selectedCourt));
    })
    .reduce((acc, curr) => {
      const date = moment(curr.date).format('YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {});

  const lineData = Object.entries(reservationsByDay).map(([date, count]) => ({
    date,
    count,
  })).sort((a, b) => moment(a.date).diff(moment(b.date)));

  const reservationsByCourt = reservations
    .filter(r => moment(r.date).isBetween(dateRange[0], dateRange[1], 'day', '[]'))
    .reduce((acc, curr) => {
      const court = courts.find(c => c.id === curr.courtId);
      const courtName = court ? court.name : 'Desconocida';
      if (!acc[courtName]) {
        acc[courtName] = 0;
      }
      acc[courtName]++;
      return acc;
    }, {});

  const pieData = Object.entries(reservationsByCourt).map(([court, count]) => ({
    type: court,
    value: count,
  }));

  const reservationsByHour = reservations
    .filter(r => {
      const date = moment(r.date);
      return date.isBetween(dateRange[0], dateRange[1], 'day', '[]') &&
             (selectedCourt === 'all' || r.courtId === parseInt(selectedCourt));
    })
    .reduce((acc, curr) => {
      const hour = curr.time.split(':')[0];
      if (!acc[hour]) {
        acc[hour] = 0;
      }
      acc[hour]++;
      return acc;
    }, {});

  const columnData = Object.entries(reservationsByHour)
    .map(([hour, count]) => ({
      hour: `${hour}:00`,
      count,
    }))
    .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

  const lineConfig = {
    data: lineData,
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
  };

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
    },
  };

  const columnConfig = {
    data: columnData,
    xField: 'hour',
    yField: 'count',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12}>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={12}>
          <Select
            value={selectedCourt}
            onChange={setSelectedCourt}
            style={{ width: '100%' }}
          >
            <Option value="all">Todas las canchas</Option>
            {courts.map(court => (
              <Option key={court.id} value={court.id.toString()}>
                {court.name}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Reservas por Día">
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Reservas por Cancha">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="Reservas por Hora">
            <Column {...columnConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics; 