import React, { useState, useEffect } from 'react';
import { 
  List, 
  Image, 
  Typography, 
  Rate, 
  Button, 
  Flex, 
  Input, 
  Modal, 
  Form,
  notification,
  theme,
  Select,
  InputNumber
} from 'antd';
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';

const { Title, Text } = Typography;

const fallbackImage = 'https://via.placeholder.com/200x200?text=Imagem+Indisponível';

const ProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm } = useSearch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
      setProducts([...data, ...storedProducts]);
      // extrair categorias únicas para o select
      const cats = Array.from(new Set(data.map(p => p.category).filter(Boolean)));
      setCategories(cats);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setLoading(false);
    }
  };

  const handleAddProduct = async (values) => {
    const newProduct = {
      ...values,
      id: Date.now(),
      price: Number(values.price),
      rating: { rate: 0, count: 0 }
    };

    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    localStorage.setItem('products', JSON.stringify([...storedProducts, newProduct]));
    
    setProducts(prev => [...prev, newProduct]);
    form.resetFields();
    setIsModalVisible(false);
    
    api.success({
      message: 'produto cadastrado com sucesso!',
      placement: 'top',
    });
  };

  const [api, contextHolder] = notification.useNotification();
  
  const handleBuyClick = (productName) => {
    api.success({
      message: 'Produto adicionado ao carrinho!',
      description: `${productName} foi adicionado ao seu carrinho.`,
      placement: 'top',
    });
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes((searchTerm || '').toLowerCase())
  );
  const { token } = theme.useToken();

  return (
    <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
      {contextHolder}
      <Flex vertical gap="large">
        {user && (
          <Flex justify="flex-end">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              Adicionar Produto
            </Button>
          </Flex>
        )}

        {/* search moved to header */}

        <List
          loading={loading}
          grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          dataSource={filteredProducts}
          renderItem={(product) => {
            const src = typeof product.image === 'string' && /^https?:\/\//i.test(product.image)
              ? product.image
              : fallbackImage;

            return (
              <List.Item key={product.id}>
                <div
                  style={{
                    border: `1px solid ${token.colorBorder}`,
                    borderRadius: token.borderRadius,
                    padding: 16,
                    background: token.colorBgContainer,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 12 }}>
                    <Image
                      width={180}
                      height={160}
                      alt={product.title}
                      src={src}
                      preview={false}
                      fallback={fallbackImage}
                      onError={(e) => {
                        try {
                          const img = e?.currentTarget || e?.target;
                          if (img) {
                            img.onerror = null;
                            img.src = fallbackImage;
                          }
                        } catch (err) {
                          // noop
                        }
                      }}
                      style={{ objectFit: 'contain', maxHeight: 160 }}
                    />
                  </div>

                  <div style={{ padding: '0 6px', marginBottom: 8 }}>
                    <Title level={4} style={{ margin: '6px 0' }}>{product.title}</Title>
                    <Text type="secondary" style={{ display: 'block', height: 48, overflow: 'hidden' }}>{product.description}</Text>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 }}>
                    <div>
                      <Rate disabled defaultValue={product.rating?.rate || 0} />
                      <Text style={{ marginLeft: 6 }}>({product.rating?.count || 0})</Text>
                    </div>

                    <div style={{ width: 180, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <Title level={5} style={{ color: token.colorPrimary, margin: 0, textAlign: 'right' }}>
                        R$ {Number(product.price).toFixed(2)}
                      </Title>
                      <Button type="primary" block icon={<ShoppingCartOutlined />} onClick={() => handleBuyClick(product.title)} style={{ borderRadius: token.borderRadius }}>
                        Comprar
                      </Button>
                    </div>
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      </Flex>

      <Modal
        title="Adicionar Novo Produto"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        maskClosable={false}
        keyboard={false}
        width={520}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddProduct}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter the product title' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter the product description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select category">
              {categories.map(cat => (
                <Select.Option key={cat} value={cat}>{cat}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter the product price' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              formatter={value => `$ ${value}`}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="image"
            label="Image"
            rules={[{ required: true, message: 'Please enter the image URL' }]}
          >
            <Input placeholder="URL image" />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" onClick={() => form.submit()}>Save</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductsPage;