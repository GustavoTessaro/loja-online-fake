import React, { useState } from "react";
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
  Modal,
} from "antd";
import { DeleteOutlined, CheckCircleOutlined } from "@ant-design/icons";
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
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const total = items.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);

  const handleFinish = () => {
    if (items.length === 0) {
      message.warning("Carrinho vazio");
      return;
    }
    setTotalAmount(total);
    dispatch(clearCart());
    setSuccessModalOpen(true);
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
    <>
      <Modal
        title="Compra Finalizada!"
        open={successModalOpen}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => {
              setSuccessModalOpen(false);
              onClose();
            }}
          >
            Continuar Comprando
          </Button>,
        ]}
        centered
        closable={false}
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <CheckCircleOutlined
            style={{ fontSize: 48, color: "#52c41a", marginBottom: 16 }}
          />
          <h2 style={{ marginBottom: 16 }}>Compra Realizada com Sucesso!</h2>
          <p style={{ marginBottom: 8, fontSize: 16 }}>
            Obrigado por sua compra!
          </p>
          <p style={{ fontSize: 14, color: "#666" }}>
            Você receberá um email de confirmação em breve.
          </p>
          <Divider />
          <Row justify="center">
            <Col>
              <Text strong style={{ fontSize: 18 }}>
                Total da Compra: R$ {totalAmount.toFixed(2)}
              </Text>
            </Col>
          </Row>
        </div>
      </Modal>

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
    </>
  );
}
