import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Row, Col, Statistic, Avatar } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import useStore from '../store';

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user, reservations, loadReservations } = useStore();

  useEffect(() => {
    if (user) {
      loadReservations();
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, form, loadReservations]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const db = await openDB('sports-courts-db', 1);
      const updatedUser = {
        ...user,
        ...values,
        updatedAt: new Date().toISOString(),
      };
      await db.put('users', updatedUser);
      useStore.setState({ user: updatedUser });
      message.success('Perfil actualizado correctamente');
    } catch (error) {
      message.error('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const userReservations = reservations.filter(r => r.userId === user?.id);
  const activeReservations = userReservations.filter(r => r.status === 'confirmada');

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar size={100} icon={<UserOutlined />} />
              <h2 style={{ marginTop: 16 }}>{user?.name}</h2>
              <p>{user?.email}</p>
            </div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Reservas Totales"
                  value={userReservations.length}
                  prefix={<CalendarOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Reservas Activas"
                  value={activeReservations.length}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card title="Información Personal">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                name: user?.name,
                email: user?.email,
                phone: user?.phone,
              }}
            >
              <Form.Item
                name="name"
                label="Nombre"
                rules={[{ required: true, message: 'Por favor ingrese su nombre' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item
                name="email"
                label="Correo Electrónico"
                rules={[
                  { required: true, message: 'Por favor ingrese su correo' },
                  { type: 'email', message: 'Ingrese un correo válido' }
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Teléfono"
                rules={[{ required: true, message: 'Por favor ingrese su teléfono' }]}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Actualizar Perfil
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile; 