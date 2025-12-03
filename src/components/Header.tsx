import React, { useState, useEffect } from "react";
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  BulbOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { useTheme } from '../context/ThemeContext';
import { Badge, Modal, Form, Input, Button, notification, message, Avatar, Space, Typography } from "antd";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addClient } from "../store/clientsSlice";
import { getProducts } from "../services/products";
import { addToCart, changeQty, clearCart } from "../store/cartSlice";
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../assets/logo.png";
import CartDrawer from "./CartDrawer";

export const Header: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const cartItems = useSelector((s: any) => s.cart.items);
  const cartCount = cartItems.length;
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();

  const clients = useSelector((s: any) => s.clients.list);
  const reduxProducts = useSelector((s: any) => s.products || []);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginValues, setLoginValues] = useState({ name: '', email: '' });
  const [loginForm] = Form.useForm();
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('current_user');
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch {}
  }, []);

  // listen for global requests to open the login modal
  useEffect(() => {
    const handler = () => setLoginOpen(true);
    window.addEventListener('open-login', handler as EventListener);
    return () => window.removeEventListener('open-login', handler as EventListener);
  }, []);

  useEffect(() => {
    if (location.pathname === '/products') {
      const q = new URLSearchParams(location.search).get('search') || '';
      setQuery(q);
    }
  }, [location]);

  const openLogin = () => setLoginOpen(true);
  const { theme, toggle } = (() => {
    try {
      return useTheme();
    } catch {
      return { theme: 'light', toggle: () => {} } as any;
    }
  })();

  const handleLogout = () => {
    try {
      // if there are items in the cart, save them per-user before clearing
      if (currentUser) {
        const backupKey = `saved_cart_${currentUser.id || currentUser.email}`;
        const items = cartItems || [];
        if (items.length > 0) {
          localStorage.setItem(backupKey, JSON.stringify(items));
        }
      }
    } catch (e) {
      // ignore
    }

    // clear the cart and logout
    try {
      dispatch(clearCart());
    } catch (e) {}
    localStorage.removeItem('current_user');
    setCurrentUser(null);
    notification.info({ message: 'Desconectado', description: 'Você saiu da sua conta.' });
  };

  const openProfile = () => setProfileOpen(true);

  const handleLogin = async (values: any) => {
    setLoginLoading(true);
    try {
      // values: { name, email } — only log in existing clients (match by name+email)
      const existing = clients.find((c: any) => c.email === values.email && c.name === values.name);
      if (existing) {
        setCurrentUser(existing);
        localStorage.setItem('current_user', JSON.stringify(existing));
        // restore saved cart for this user if present, but only for products that still exist
        try {
          const backupKey = `saved_cart_${existing.id || existing.email}`;
          const raw = localStorage.getItem(backupKey);
          if (raw) {
            const savedItems = JSON.parse(raw) as any[];
            if (Array.isArray(savedItems) && savedItems.length > 0) {
              // try to get API products to validate deletions
              let apiProducts: any[] = [];
              try {
                apiProducts = await getProducts();
              } catch (e) {
                apiProducts = [];
              }

              const allProducts = [...(reduxProducts || []), ...(apiProducts || [])];

              const validSavedItems = savedItems.filter((si) =>
                allProducts.some((p: any) => String(p.id) === String(si.productId))
              );

              const removedCount = savedItems.length - validSavedItems.length;

              if (validSavedItems.length > 0) {
                dispatch(clearCart());
                validSavedItems.forEach((si) => {
                  try {
                    dispatch(addToCart({ productId: si.productId, title: si.title, price: si.price, image: si.image || '' }));
                    if (si.qty && si.qty > 1) {
                      dispatch(changeQty({ productId: si.productId, qty: si.qty }));
                    }
                  } catch (e) {}
                });
              }

              // remove backup after attempting restore
              localStorage.removeItem(backupKey);

              if (removedCount > 0) {
                const removedItems = savedItems.filter((si) =>
                  !allProducts.some((p: any) => String(p.id) === String(si.productId))
                );
                const names = removedItems.map((r) => r.title).filter(Boolean);
                let desc = `${removedCount} produto(s) foram removidos porque não existem mais.`;
                if (names.length > 0) {
                  const preview = names.slice(0, 5).join(', ');
                  const more = names.length > 5 ? ` e mais ${names.length - 5}` : '';
                  desc = `Foram removidos: ${preview}${more}.`;
                }
                notification.info({
                  message: 'Itens removidos do carrinho',
                  description: desc,
                });
              }
            }
          }
        } catch (e) {
          // ignore
        }
        setLoginOpen(false);
        loginForm.resetFields();
        notification.success({ message: 'Bem-vindo de volta', description: `Olá ${existing.name}` });
      } else {
        // do not create new client — inform the user
        notification.error({
          message: 'Usuário ou Email inválidos',
          description: 'Verifique seu nome e email e tente novamente.',
        });
        // also show a message toast (in case notifications are hidden) and mark form fields as invalid
        try {
          message.error('Usuário ou Email inválidos');
          loginForm.setFields([
            { name: 'name', errors: ['Usuário ou Email inválidos'] },
            { name: 'email', errors: ['Usuário ou Email inválidos'] },
          ]);
        } catch (e) {
          // ignore
        }
      }
    } finally {
      setLoginLoading(false);
    }
  };

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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const q = query.trim();
                  if (q) navigate(`/products?search=${encodeURIComponent(q)}`);
                  else navigate('/products');
                }
              }}
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
            <SearchOutlined
              style={{ color: "#1677ff", fontSize: "18px", cursor: 'pointer' }}
              onClick={() => {
                const q = query.trim();
                if (q) navigate(`/products?search=${encodeURIComponent(q)}`);
                else navigate('/products');
              }}
            />
          </div>
        </div>

        {/* Login + Cart */}
        <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <button onClick={() => toggle()} title="Alternar tema" style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '1rem' }}>
            {theme === 'dark' ? <BulbOutlined /> : <MoonOutlined />}
          </button>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={openProfile} style={{ background: 'none', border: 'none', color: '#1677ff', cursor: 'pointer', fontSize: '1rem' }}>
                Olá, {currentUser.name}
              </button>
            </div>
          ) : (
            <button
              onClick={openLogin}
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
              <UserOutlined /> Login
            </button>
          )}
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

      <Modal
        title="Login / Criar Conta"
        open={loginOpen}
        onCancel={() => {
          setLoginOpen(false);
          loginForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
          <Avatar size={64} style={{ backgroundColor: '#1677ff' }}>
            { (loginValues.name ? loginValues.name.split(' ').map((n)=>n[0]).slice(0,2).join('') : (loginValues.email ? loginValues.email[0] : '?')).toUpperCase() }
          </Avatar>
          <div>
            <Typography.Title level={5} style={{ margin: 0 }}>{loginValues.name || 'Novo usuário'}</Typography.Title>
            <Typography.Text type="secondary">Entre com seu email para criar ou acessar sua conta.</Typography.Text>
          </div>
        </div>

        <Form form={loginForm} layout="vertical" onFinish={handleLogin} initialValues={{ name: '', email: '' }} onValuesChange={(_, all) => setLoginValues({ name: all.name || '', email: all.email || '' })}>
          <Form.Item name="name" label="Nome" rules={[{ required: true, message: 'Informe seu nome' }]}>
            <Input autoFocus />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Informe seu email' }, { type: 'email', message: 'Email inválido' }]}>
            <Input />
          </Form.Item>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => { setLoginOpen(false); loginForm.resetFields(); }}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={loginLoading}>Entrar</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Meu Perfil"
        open={profileOpen}
        onCancel={() => setProfileOpen(false)}
        footer={null}
        destroyOnClose
      >
        {currentUser ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Avatar size={64} style={{ backgroundColor: '#1677ff' }}>{(currentUser.name || '').split(' ').map((n:any)=>n[0]).slice(0,2).join('').toUpperCase()}</Avatar>
              <div>
                <Typography.Title level={4} style={{ margin: 0 }}>{currentUser.name}</Typography.Title>
                <Typography.Text type="secondary">{currentUser.email}</Typography.Text>
              </div>
            </div>

            <div>
              <Typography.Text strong>Telefone:</Typography.Text>
              <div>{currentUser.phone || '-'}</div>
            </div>

            <div>
              <Typography.Text strong>Endereço:</Typography.Text>
              <div>{currentUser.address || '-'}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={() => { setProfileOpen(false); }}>
                Fechar
              </Button>
              <Button danger onClick={() => { handleLogout(); setProfileOpen(false); }}>
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div>Nenhum usuário logado</div>
        )}
      </Modal>
    </>
  );
};
