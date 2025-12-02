import React from "react";
import {
  Drawer,
  List,
  Button,
  Space,
  InputNumber,
  message,
  Empty,
  Divider,
  Row,
  Col,
  Typography,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  changeQty,
  clearCart,
} from "../store/cartSlice";

const { Text } = Typography;

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useSelector((s: any) => s.cart.items);
  const dispatch = useDispatch();

  const total = items.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);

  const handleFinish = () => {
    if (items.length === 0) {
      message.warning("Carrinho vazio");
      return;
    }
    dispatch(clearCart());
    message.success("Compra finalizada com sucesso! Obrigado!");
    onClose();
  };

  const handleRemove = (productId: number | string) => {
    dispatch(removeFromCart(productId));
    message.info("Produto removido do carrinho");
  };

  const handleClear = () => {
    dispatch(clearCart());
    message.success("Carrinho limpo");
  };

  const handleQtyChange = (productId: number | string, qty: number | null) => {
    if (qty && qty > 0) {
      dispatch(changeQty({ productId, qty }));
    }
  };

  return (
    <Drawer
      title="Carrinho de Compras"
      width={450}
      onClose={onClose}
      open={open}
      footer={
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={handleClear} danger>
              Esvaziar o Carrinho
            </Button>
            <Button
              type="primary"
              onClick={handleFinish}
              disabled={items.length === 0}
            >
              Finalizar Compra
            </Button>
          </Space>
        </div>
      }
    >
      {items.length === 0 ? (
        <Empty description="Adicione um produto no carrinho!" />
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={items}
            renderItem={(item: any) => (
              <List.Item
                actions={[
                  <InputNumber
                    min={1}
                    value={item.qty}
                    onChange={(val) =>
                      handleQtyChange(item.productId, val)
                    }
                    style={{ width: 70 }}
                  />,
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemove(item.productId)}
                  >
                    Remover
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    ) : null
                  }
                  title={
                    <Text ellipsis style={{ maxWidth: 200 }}>
                      {item.title}
                    </Text>
                  }
                  description={
                    <div>
                      <Text type="secondary">
                        R$ {item.price.toFixed(2)} x {item.qty} = R${" "}
                        {(item.price * item.qty).toFixed(2)}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />

          <Divider />

          <Row justify="space-between" style={{ marginBottom: 16 }}>
            <Col>
              <Text strong>Quantidade de produtos selecionados:</Text>
            </Col>
            <Col>
              <Text strong>{items.length}</Text>
            </Col>
          </Row>

          <Row justify="space-between">
            <Col>
              <Text strong style={{ fontSize: 16 }}>
                Preço Total:
              </Text>
            </Col>
            <Col>
              <Text strong style={{ fontSize: 16, color: "#1677ff" }}>
                R$ {total.toFixed(2)}
              </Text>
            </Col>
          </Row>
        </>
      )}
    </Drawer>
  );
}
