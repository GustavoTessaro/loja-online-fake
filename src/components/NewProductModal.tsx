import React from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  notification,
  theme,
} from "antd";
import type { Product } from "../types/Product";

const { useToken } = theme;

interface NewProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [form] = Form.useForm();
  const { token } = useToken();

  const handleFinish = (values: any) => {
    const newProduct: Product = {
      id: `local-${Date.now()}`,
      title: values.title,
      description: values.description,
      price: Number(values.price),
      image: values.image || "/assets/logo.png",
      rating: { rate: 4.5, count: 0 },
      category: values.category || "uncategorized",
    };

    onSave(newProduct);
    form.resetFields();
    notification.success({
      message: "Produto salvo",
      description: "Produto cadastrado com sucesso!",
    });
    onClose();
  };

  return (
    <Modal
      title="Novo Produto"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      maskClosable={false}
      keyboard={false}
      destroyOnHidden
      styles={{ body: { borderRadius: token.borderRadiusLG } }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{}}
      >
        <Form.Item
          name="title"
          label="Título"
          rules={[{ required: true, message: "Informe o título do produto" }]}
        >
          <Input placeholder="Ex: Jaqueta de Couro" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descrição"
          rules={[{ required: true, message: "Informe a descrição do produto" }]}
        >
          <Input.TextArea rows={4} placeholder="Descrição do produto" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Categoria"
          rules={[{ required: true, message: "Informe a categoria do produto" }]}
        >
          <Select placeholder="Selecione a categoria do produto">
            <Select.Option value="clothing">Roupas</Select.Option>
            <Select.Option value="jewelry">Joias</Select.Option>
            <Select.Option value="electronics">Eletrônicos</Select.Option>
            <Select.Option value="uncategorized">Sem Categoria</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="Preço"
          rules={[{ required: true, message: "Informe o preço do produto" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            step={0.01}
            placeholder="0.00"
            prefix="R$"
          />
        </Form.Item>

        <Form.Item
          name="image"
          label="Imagem"
          rules={[{ type: "url", warningOnly: true }]}
        >
          <Input placeholder="https://image-url.com" />
        </Form.Item>

        <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
          <Button
            onClick={() => {
              form.resetFields();
              onClose();
            }}
            style={{ marginRight: 8 }}
          >
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit">
            Adicionar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
