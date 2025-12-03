// src/components/ProductEditDrawer.tsx
import React, { useEffect } from "react";
import { Drawer, Form, Input, InputNumber, Button, Image } from "antd";
import type { Product } from "../types/Product";

type Props = {
  open: boolean;
  product?: Product | null;
  onClose: () => void;
  onSave: (p: Product) => void;
};

export const ProductEditDrawer: React.FC<Props> = ({
  open,
  product,
  onClose,
  onSave,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
        rating: product.rating?.rate ?? 0,
      });
    } else {
      form.resetFields();
    }
  }, [product, form]);

  const handleFinish = (values: any) => {
    const updated: Product = {
      id: values.id ?? Date.now(),
      title: values.title,
      description: values.description,
      price: Number(values.price),
      image: values.image || "",
      category: product?.category || "uncategorized",
      rating: {
        rate: Number(values.rating) || 0,
        count: product?.rating?.count ?? 0,
      },
    };
    onSave(updated);
    onClose();
  };

  return (
    <Drawer
      title={product ? "Editar Produto" : "Novo Produto"}
      width={480}
      onClose={onClose}
      open={open}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancelar
          </Button>
          <Button type="primary" onClick={() => form.submit()}>
            Savar Alterações
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="title"
          label="Titulo"
          rules={[{ required: true, message: "Informe o título" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Descrição">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Preço"
          rules={[{ required: true, message: "Informe o preço" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item name="image" label="Imagem URL">
          <Input />
        </Form.Item>

        <Form.Item name="rating" label="Rating">
          <InputNumber min={0} max={5} step={0.5} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Preview">
          <Image
            src={form.getFieldValue("image")}
            fallback="/assets/default-product.png"
            style={{ width: "100%", maxHeight: 200, objectFit: "contain" }}
            alt="preview"
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};
