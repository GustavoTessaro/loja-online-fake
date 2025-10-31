import React, { useState } from "react";
import { Layout, Menu, Space, Button, Modal, Form, Input, Typography, Dropdown } from "antd";
import {
  ShoppingCartOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar = () => {
  const { user, login, logout } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

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
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#e6f0ff",
        padding: "0 40px",
        height: 70,
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontWeight: "bold",
          fontSize: "22px",
          color: "#ff6600",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        🛒 <span style={{ color: "#000" }}>Online Shop</span>
      </div>

      {/* Menu */}
      <Menu
        mode="horizontal"
        defaultSelectedKeys={["products"]}
        items={[
          { key: "home", label: "Home" },
          { key: "products", label: "Produtos" }
        ]}
        style={{
          borderBottom: "none",
          background: "transparent",
          fontWeight: 500,
        }}
      />

      {/* Botões Login e Carrinho */}
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
