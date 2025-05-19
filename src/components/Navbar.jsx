import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  CalendarOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Inicio',
    },
    {
      key: '/reservations',
      icon: <CalendarOutlined />,
      label: 'Reservas',
    },
    // {
    //   key: '/statistics',
    //   icon: <BarChartOutlined />,
    //   label: 'Estadísticas',
    // },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Perfil',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar Sesión',
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('user');
      navigate('/login');
    } else {
      navigate(key);
    }
  };

  return (
    <Header className="header">
      <div className="logo" />
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Header>
  );
};

export default Navbar; 