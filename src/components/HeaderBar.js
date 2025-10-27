import React from "react";
import { Layout, Menu, Input, Space, Button } from "antd";
import {
  ShoppingCartOutlined,
  LoginOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const HeaderBar = () => {
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
        defaultSelectedKeys={["home"]}
        items={[{ key: "home", label: "Home" }]}
        style={{
          borderBottom: "none",
          background: "transparent",
          fontWeight: 500,
        }}
      />

      {/* Barra de busca */}
      <Input
        placeholder="Search..."
        prefix={<SearchOutlined />}
        style={{
          width: 250,
          borderRadius: 6,
          background: "#fff",
        }}
      />

      {/* Botões Login e Carrinho */}
      <Space>
        <Button type="link" icon={<LoginOutlined />} style={{ fontWeight: 500 }}>
          Login
        </Button>
        <Button
          type="link"
          icon={<ShoppingCartOutlined />}
          style={{ fontWeight: 500 }}
        >
          Cart
        </Button>
      </Space>
    </Header>
  );
};

export default HeaderBar;
