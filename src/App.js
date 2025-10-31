import React from "react";
import { Layout } from "antd";
import { AuthProvider } from "./context/AuthContext";
import HeaderBar from "./components/HeaderBar";
import ProductsPage from "./components/ProductsPage";

const { Content, Footer } = Layout;

const App = () => {
  return (
    <AuthProvider>
      <Layout style={{ minHeight: "100vh", background: "#f9f9f9" }}>
        <HeaderBar />

        <Content
          style={{
            padding: "40px 60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ProductsPage />
        </Content>

      <Footer
        style={{
          textAlign: "center",
          background: "#001529",
          color: "#fff",
          padding: "20px 0",
        }}
      >
        IFSC ©2025 — Desenvolvido por Gustavo Tessaro e Lucas Oliveira Bleyer
      </Footer>
    </Layout>
  );
};

export default App;
