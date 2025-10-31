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
  Space 
} from 'antd';
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;
const { Search } = Input;

const fallbackImage = 'https://via.placeholder.com/200x200?text=Imagem+Indisponível';

const ProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
      setProducts([...data, ...storedProducts]);
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
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <Search
          placeholder="Buscar produtos..."
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 400 }}
        />

        <List
          loading={loading}
          itemLayout="vertical"
          size="large"
          dataSource={filteredProducts}
          renderItem={(product) => (
            <List.Item
              key={product.id}
              extra={
                <Image
                  width={200}
                  alt={product.title}
                  src={product.image}
                  fallback={fallbackImage}
                />
              }
              actions={[
                <Space key="actions">
                  <Rate disabled defaultValue={product.rating?.rate || 0} />
                  <Text>({product.rating?.count || 0} avaliações)</Text>
                </Space>,
                <Button
                  key="buy"
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => handleBuyClick(product.title)}
                >
                  Comprar
                </Button>
              ]}
            >
              <List.Item.Meta
                title={<Title level={4}>{product.title}</Title>}
                description={product.description}
              />
              <Title level={3} style={{ color: '#1890ff' }}>
                R$ {Number(product.price).toFixed(2)}
              </Title>
            </List.Item>
          )}
        />
      </Flex>

      <Modal
        title="Adicionar Novo Produto"
        open={isModalVisible}
        onOk={form.submit}
        onCancel={() => setIsModalVisible(false)}
        maskClosable={false}
        keyboard={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddProduct}
        >
          <Form.Item
            name="title"
            label="Título"
            rules={[{ required: true, message: 'Por favor, insira o título do produto' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Descrição"
            rules={[{ required: true, message: 'Por favor, insira a descrição do produto' }]}
          >
            <Input.TextArea />
          </Form.Item>
          
          <Form.Item
            name="price"
            label="Preço"
            rules={[{ required: true, message: 'Por favor, insira o preço do produto' }]}
          >
            <Input type="number" step="0.01" />
          </Form.Item>
          
          <Form.Item
            name="image"
            label="URL da Imagem"
            rules={[{ required: true, message: 'Por favor, insira a URL da imagem' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductsPage;