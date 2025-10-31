import React, { useState } from "react";
import { Layout, Space, Button, Modal, Form, Input, Typography, Dropdown } from "antd";
import {
  ShoppingCartOutlined,
  LoginOutlined,
  LogoutOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSearch } from '../context/SearchContext';
import { useAuth } from "../context/AuthContext";

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar = () => {
  const { user, login, logout } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { setSearchTerm } = useSearch();

  const handleLogin = async (values) => {
    // Simular uma chamada à API
    const mockUser = {
      ...values,
      id: 1,
    };
    
    login(mockUser);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleLogout = () => {
    logout();
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: (
        <div style={{ padding: '8px 16px' }}>
          <Text strong>{user?.name} {user?.surname}</Text>
          <br />
          <Text type="secondary">{user?.email}</Text>
        </div>
      )
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sair',
      onClick: handleLogout
    }
  ];

  return (
    <Header
      style={{
        display: 'grid',
        gridTemplateColumns: '220px 1fr 220px',
        alignItems: 'center',
        backgroundColor: '#eaf4ff',
        padding: '0 24px',
        height: 72,
      }}
    >
      {/* Logo + Home + Products */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src="/logo.png" alt="Online Shop" style={{ height: 46 }} onError={(e) => { try { e.currentTarget.src = '/favicon.ico'; } catch (err) {} }} />
        <Button type="link" style={{ fontWeight: 600, color: '#0a58ca' }}>Home</Button>
        <Button type="link" style={{ fontWeight: 600, color: '#0a58ca' }}>Products</Button>
      </div>

      {/* Center: search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
        <Input.Search
          placeholder="Find Product"
          prefix={<SearchOutlined />}
          style={{ width: 360, borderRadius: 6 }}
          onSearch={(value) => setSearchTerm(value)}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Right: user and cart */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Space>
        {user ? (
          <>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
            >
              <Button type="text" icon={<UserOutlined />}>
                {user.name}
              </Button>
            </Dropdown>
          </>
        ) : (
          <Button 
            type="link" 
            icon={<LoginOutlined />} 
            style={{ fontWeight: 500 }}
            onClick={() => setIsModalVisible(true)}
          >
            Login
          </Button>
        )}
        <Button
          type="link"
          icon={<ShoppingCartOutlined />}
          style={{ fontWeight: 500 }}
        >
          Cart
        </Button>
        </Space>
      </div>
      <Modal
        title="Login"
        open={isModalVisible}
        onOk={form.submit}
        onCancel={() => setIsModalVisible(false)}
        maskClosable={false}
        keyboard={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleLogin}
        >
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Por favor, insira seu nome' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="surname"
            label="Sobrenome"
            rules={[{ required: true, message: 'Por favor, insira seu sobrenome' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              { required: true, message: 'Por favor, insira seu e-mail' },
              { type: 'email', message: 'Por favor, insira um e-mail válido' }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Header>
  );
};

export default HeaderBar;
