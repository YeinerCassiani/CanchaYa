import { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  TimePicker,
  Space,
  message,
  Popconfirm
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import useStore from '../store';
import moment from 'moment';

const { Option } = Select;

const Reservations = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const { reservations, courts, loading, loadReservations, loadCourts, addReservation, updateReservation, deleteReservation } = useStore();

  useEffect(() => {
    loadCourts();
    loadReservations();
  }, [loadCourts, loadReservations]);

  const handleSubmit = async (values) => {
    try {
      const reservationData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm'),
      };

      if (editingReservation) {
        await updateReservation(editingReservation.id, reservationData);
        message.success('Reserva actualizada exitosamente');
      } else {
        await addReservation(reservationData);
        message.success('Reserva creada exitosamente');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingReservation(null);
    } catch (error) {
      message.error('Error al guardar la reserva');
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    form.setFieldsValue({
      ...reservation,
      date: moment(reservation.date),
      time: moment(reservation.time, 'HH:mm'),
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteReservation(id);
      message.success('Reserva eliminada exitosamente');
    } catch (error) {
      message.error('Error al eliminar la reserva');
    }
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
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingReservation(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Nueva Reserva
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={reservations}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingReservation ? 'Editar Reserva' : 'Nueva Reserva'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingReservation(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="courtId"
            label="Cancha"
            rules={[{ required: true, message: 'Por favor seleccione una cancha' }]}
          >
            <Select
              placeholder="Seleccione una cancha"
              loading={loading}
            >
              {courts.map(court => (
                <Select.Option key={court.id} value={court.id}>
                  {court.name} - {court.type} (${court.pricePerHour}/hora)
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Fecha"
            rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              disabledDate={current => current && current < moment().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="time"
            label="Hora"
            rules={[{ required: true, message: 'Por favor seleccione una hora' }]}
          >
            <TimePicker 
              style={{ width: '100%' }}
              format="HH:mm"
              minuteStep={30}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingReservation ? 'Actualizar' : 'Crear'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Reservations; 