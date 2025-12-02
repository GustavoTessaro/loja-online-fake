import React from "react";
import {
  Button,
  Image,
  Rate,
  Typography,
  Grid,
  theme,
  Tooltip,
  Space,
  Row,
  Col,
  notification,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import type { Product } from "../types/Product";
import styles from "./ProductItem.module.css";

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;
const { useBreakpoint } = Grid;

interface ProductItemProps {
  product: Product;
  onBuy?: (p: Product) => void;
}

export const ProductItem: React.FC<ProductItemProps> = ({ product, onBuy }) => {
  const screens = useBreakpoint();
  const { token } = useToken();

  const handleBuy = () => {
    if (onBuy) onBuy(product);
    notification.success({
      message: "Adicionado ao carrinho",
      description: `${product.title} foi adicionado ao seu carrinho.`,
      placement: "topRight",
    });
  };

  const rate = product.rating?.rate ?? 4.5;
  const count = product.rating?.count ?? 5;

  return (
    <article
      className={styles.container}
      style={{
        borderRadius: token.borderRadiusLG,
        background: token.colorBgContainer,
        //boxShadow: `0 6px 16px ${token.colorShadow}`,
      }}
      aria-label={product.title}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={8} md={6} lg={5}>
          <div className={styles.media}>
            <Image
              src={product.image}
              alt={product.title}
              fallback="/assets/logo.png"
              preview={true}
              style={{ objectFit: "contain", maxHeight: 140, width: "100%" }}
            />
          </div>
        </Col>

        <Col xs={24} sm={16} md={12} lg={14}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={4} style={{ margin: 0, color: token.colorText }}>
              {product.title}
            </Title>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Rate allowHalf disabled value={Number(rate.toFixed(1))} />
              <Text type="secondary">({count})</Text>
            </div>

            <Paragraph className={styles.description} ellipsis={{ rows: 2 }}>
              {product.description}
            </Paragraph>
          </Space>
        </Col>

        <Col xs={24} sm={24} md={6} lg={5}>
          <div className={styles.side}>
            <Text strong style={{ fontSize: 18 }}>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(product.price)}
            </Text>

            <div style={{ marginTop: 12 }}>
              <Tooltip title="Adicionar ao carrinho">
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  block
                  onClick={handleBuy}
                >
                  Comprar
                </Button>
              </Tooltip>
            </div>
          </div>
        </Col>
      </Row>
    </article>
  );
};
