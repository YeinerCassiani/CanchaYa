import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import useStore from '../store';

const Courts = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const { courts, loading, loadCourts, addCourt, updateCourt, deleteCourt } = useStore();

  useEffect(() => {
    loadCourts();
  }, [loadCourts]);

  const handleSubmit = async (values) => {
    try {
      if (editingCourt) {
        await updateCourt(editingCourt.id, values);
        message.success('Cancha actualizada exitosamente');
      } else {
        await addCourt(values);
        message.success('Cancha creada exitosamente');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingCourt(null);
    } catch (error) {
      message.error('Error al guardar la cancha');
    }
  };

  const handleEdit = (court) => {
    setEditingCourt(court);
    form.setFieldsValue(court);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCourt(id);
      message.success('Cancha eliminada exitosamente');
    } catch (error) {
      message.error('Error al eliminar la cancha');
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Capacidad',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: 'Precio por Hora',
      dataIndex: 'pricePerHour',
      key: 'pricePerHour',
      render: (price) => `$${price}`,
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
            setEditingCourt(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Nueva Cancha
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={courts}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingCourt ? 'Editar Cancha' : 'Nueva Cancha'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingCourt(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Tipo"
            rules={[{ required: true, message: 'Por favor ingrese el tipo' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Capacidad"
            rules={[{ required: true, message: 'Por favor ingrese la capacidad' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="pricePerHour"
            label="Precio por Hora"
            rules={[{ required: true, message: 'Por favor ingrese el precio' }]}
          >
            <InputNumber
              min={0}
              prefix="$"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCourt ? 'Actualizar' : 'Crear'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Courts; 