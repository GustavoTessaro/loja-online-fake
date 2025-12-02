import React, { useState } from "react";
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Badge } from "antd";
import { useSelector } from "react-redux";
import logo from "../assets/logo.png";
import CartDrawer from "./CartDrawer";

export const Header: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const cartItems = useSelector((s: any) => s.cart.items);
  const cartCount = cartItems.length;

  return (
    <>
      <header
        style={{
          background: "#e6f4ff",
          padding: "0.8rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "fixed",   // <-- FIXO
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
        }}
      >
        {/* Logo + Home */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <img src={logo} alt="Logo" style={{ height: "40px" }} />
          <a href="/" style={{marginLeft:"1rem", color: "#1677ff", fontSize: "1rem" }}>
          Início
          </a>
          <a href="/products" style={{ color: "#1677ff", fontSize: "1rem" }}>
          Produtos
          </a>
          <a href="/clients" style={{ color: "#1677ff", fontSize: "1rem" }}>
          Clientes
          </a>
        </div>

        {/* Barra de busca */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            margin: "0 2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: "20px",
              padding: "0.3rem 1rem",
              width: "60%",
              boxShadow: "0 1px 4px rgba(215, 215, 215, 0.1)",
            }}
          >
            <input
              type="text"
              placeholder="Pesquise por produtos..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "1rem",
                backgroundColor: "white",
                color: "black",
              }}
            />
            <SearchOutlined style={{ color: "#1677ff", fontSize: "18px" }} />
          </div>
        </div>

        {/* Login + Cart */}
        <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a
            href="#"
            style={{
              color: "#1677ff",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <UserOutlined /> Login
          </a>
          <button
            onClick={() => setCartOpen(true)}
            style={{
              background: "none",
              border: "none",
              color: "#1677ff",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
              <ShoppingCartOutlined /> Carrinho
          </button>
        </nav>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};
