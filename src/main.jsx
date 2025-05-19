import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, theme } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import esES from 'antd/locale/es_ES';
import App from './App';
import './index.css';

const { darkAlgorithm, defaultAlgorithm } = theme;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        locale={esES}
        theme={{
          algorithm: darkAlgorithm,
          token: {
            colorPrimary: '#1890ff',
            colorSuccess: '#52c41a',
            colorWarning: '#faad14',
            colorError: '#ff4d4f',
            colorInfo: '#1890ff',
            borderRadius: 6,
            colorBgContainer: '#141414',
            colorBgElevated: '#1f1f1f',
            colorBgLayout: '#000000',
            colorText: '#ffffff',
            colorTextSecondary: '#a6a6a6',
            colorBorder: '#303030',
            colorBorderSecondary: '#1f1f1f',
            colorFill: '#262626',
            colorFillSecondary: '#1f1f1f',
            colorFillTertiary: '#141414',
            colorFillQuaternary: '#000000',
          },
          components: {
            Card: {
              colorBgContainer: '#1f1f1f',
              colorBorderSecondary: '#303030',
            },
            Table: {
              colorBgContainer: '#1f1f1f',
              colorBorderSecondary: '#303030',
              headerBg: '#141414',
              headerColor: '#ffffff',
              rowHoverBg: '#262626',
            },
            Button: {
              colorPrimary: '#1890ff',
              colorPrimaryHover: '#40a9ff',
              colorPrimaryActive: '#096dd9',
            },
            Input: {
              colorBgContainer: '#141414',
              colorBorder: '#303030',
              colorText: '#ffffff',
              colorTextPlaceholder: '#666666',
            },
            Select: {
              colorBgContainer: '#141414',
              colorBorder: '#303030',
              colorText: '#ffffff',
            },
            DatePicker: {
              colorBgContainer: '#141414',
              colorBorder: '#303030',
              colorText: '#ffffff',
            },
            Modal: {
              colorBgElevated: '#1f1f1f',
              colorText: '#ffffff',
            },
            Drawer: {
              colorBgElevated: '#1f1f1f',
              colorText: '#ffffff',
            },
            Menu: {
              colorItemBg: '#141414',
              colorItemText: '#ffffff',
              colorItemTextSelected: '#1890ff',
              colorItemBgSelected: '#1f1f1f',
              colorItemBgHover: '#262626',
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
