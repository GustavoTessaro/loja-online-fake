import React, { useState, useEffect, useMemo } from "react";
import { Card, Spin, Row, Col, Typography, Image, notification } from "antd";
import { EyeFilled } from "@ant-design/icons";

const { Title } = Typography;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Buscar produtos da Fake Store API
  useEffect(() => {
    fetch("https://fakestoreapi.com/products?limit=5")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar produtos:", error);
        setLoading(false);
      });
  }, []);

  // Memorizar os top 5
  const topProducts = useMemo(() => products.slice(0, 5), [products]);

  // Notificação ao clicar no ícone
  const handleEyeClick = () => {
    notification.error({
      message: "Erro ao visualizar produto",
      description: "Esta funcionalidade ainda não foi implementada.",
    });
  };

  return (
    <div style={{ textAlign: "center", width: "100%" }}>
      <Title level={2} style={{ marginBottom: 0 }}>
        Welcome to the Shop
      </Title>
      <Title
        level={4}
        style={{
          marginBottom: "40px",
          color: "#666",
        }}
      >
        Top 5 Products
      </Title>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[24, 24]} justify="center">
          {topProducts.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={4}>
              <Card
                hoverable
                title={
                  <span style={{ fontSize: "14px" }}>
                    {product.title.slice(0, 20)}...
                  </span>
                }
                actions={[
                  <EyeFilled
                    key="eye"
                    style={{ color: "#1890ff", fontSize: 18 }}
                    onClick={handleEyeClick}
                  />,
                ]}
                style={{
                  height: 340,
                  borderRadius: 12,
                }}
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  height={180}
                  preview
                />
                <p style={{ marginTop: 10, color: "#888" }}>
                  {product.category}
                </p>
                <b style={{ color: "#333" }}>${product.price}</b>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default HomePage;
