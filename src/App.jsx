import { useState, useEffect } from 'react';
import { Layout, Menu, theme, Switch } from 'antd';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  CalendarOutlined,
  BarChartOutlined,
  UserOutlined,
  PlusOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';
import Courts from './pages/Courts';
import Login from './pages/Login';
import Register from './pages/Register';
import useStore from './store';
import logo from './assets/logo.png';
import './App.css';

const { Header, Content, Sider } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (!user && !location.pathname.includes('/login') && !location.pathname.includes('/register')) {
      navigate('/login');
    }
  }, [user, navigate, location]);

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/reservations',
      icon: <CalendarOutlined />,
      label: 'Reservas',
    },
    {
      key: '/courts',
      icon: <PlusOutlined />,
      label: 'Canchas',
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
  ];

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme={isDarkMode ? 'dark' : 'light'}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '12px'
        }}>
          <img 
            src={logo} 
            alt="Logo" 
            style={{ 
              width: collapsed ? '50px' : '80px',
              height: 'auto',
              transition: 'all 0.2s'
            }} 
          />
        </div>
        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: '0 24px', 
          background: isDarkMode ? '#141414' : colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
        }}>
          {/* <Switch
            checkedChildren={<BulbOutlined />}
            unCheckedChildren={<BulbOutlined />}
            checked={isDarkMode}
            onChange={setIsDarkMode}
            style={{ marginRight: 16 }}
          /> */}
          <span style={{ marginRight: 16 }}>{user.name}</span>
          <a onClick={logout} style={{ color: '#1890ff', cursor: 'pointer' }}>
            Cerrar sesión
          </a>
        </Header>
        <Content style={{ 
          margin: '24px 16px',
          padding: 24,
          background: isDarkMode ? '#141414' : colorBgContainer,
          borderRadius: borderRadiusLG,
          minHeight: 280,
        }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/courts" element={<Courts />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
