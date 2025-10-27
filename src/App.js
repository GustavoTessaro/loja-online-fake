import React from "react";
import { Layout } from "antd";
import HeaderBar from "./components/HeaderBar";
import HomePage from "./components/HomePage";

const { Content, Footer } = Layout;

const App = () => {
  return (
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
        <HomePage />
      </Content>

      <Footer
        style={{
          textAlign: "center",
          background: "#001529",
          color: "#fff",
          padding: "20px 0",
        }}
      >
        IFSC ©2025 — Desenvolvido por [Seu Nome]
      </Footer>
    </Layout>
  );
};

export default App;
