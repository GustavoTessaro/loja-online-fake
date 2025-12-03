import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import {
  List,
  Spin,
  Row,
  Col,
  Button,
  Typography,
  notification,
  Image,
  Rate,
  Popconfirm,
  Space,
} from "antd";
import {
  PlusOutlined,
  ShoppingCartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { getProducts } from "../services/products";
import type { Product } from "../types/Product";
import { ProductEditDrawer } from "../components/ProductEditDrawer";
import { NewProductModal } from "../components/NewProductModal";
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "../store/productsSlice";
import { addToCart, removeFromCart } from "../store/cartSlice";

const { Title, Paragraph, Text } = Typography;

export const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reduxProducts = useSelector((s: RootState) => s.products || []);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // initialize searchTerm from URL param `search`
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('search') || '';
    setSearchTerm(q);
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((data) => setApiProducts(data))
      .catch(() => {
        notification.error({
          message: "Erro",
          description: "Não foi possível carregar os produtos da API.",
        });
        setApiProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // merged: redux (local) first, depois API
  const mergedProducts = useMemo(
    () => [...reduxProducts, ...apiProducts],
    [reduxProducts, apiProducts]
  );

  const filteredProducts = mergedProducts.filter(
    (p) => p && p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveLocalProduct = (p: Product) => {
    dispatch(addProduct(p));
    notification.success({ message: "Produto cadastrado com sucesso!" });
  };

  const handleBuy = (p: Product) => {
    const rawUser = localStorage.getItem('current_user');
    if (!rawUser) {
      window.dispatchEvent(new CustomEvent('open-login'));
      notification.warning({
        message: 'Faça login',
        description: 'Você precisa estar logado para adicionar produtos ao carrinho.',
      });
      return;
    }

    dispatch(
      addToCart({
        productId: p.id,
        title: p.title,
        price: p.price,
        image: p.image || "",
      })
    );
    notification.success({
      message: "Produto adicionado ao carrinho!",
      description: `${p.title} foi incluído com sucesso.`,
    });
  };

  const openEdit = (p: Product) => {
    setProductToEdit(p);
    setEditOpen(true);
  };

  const handleSaveEdit = (p: Product) => {
    dispatch(updateProduct(p));
    notification.success({ message: "Produto atualizado com sucesso!" });
  };

  const handleDelete = (id: number | string) => {
    dispatch(deleteProduct(id));
    dispatch(removeFromCart(id));
    notification.success({ message: "Produto excluído com sucesso!" });
  };

  return (
    <div style={{marginTop: 60, padding: 24 }}>
      <Row justify="center" align="middle" style={{ marginBottom: 40 }}>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
          >
            Adicione um Produto
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : (
        <List
          grid={{ gutter: 24, xs: 12, sm: 8, md: 6, lg: 4, xl: 3 }}
          dataSource={filteredProducts || []}
          locale={{ emptyText: "Nenhum produto encontrado" }}
          renderItem={(item) => (
            <List.Item>
              <div
                style={{
                  border: "1px solid #f0f0f0",
                  borderRadius: 8,
                  padding: 16,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Image
                  src={item.image || ""}
                  alt={item.title}
                  fallback="/assets/default-product.png"
                  style={{
                    objectFit: "contain",
                    height: 160,
                    marginBottom: 12,
                    backgroundColor: "#fafafa",
                    borderRadius: 8,
                  }}
                />

                <Title level={5} ellipsis={{ rows: 2 }}>
                  {item.title}
                </Title>
                <Paragraph ellipsis={{ rows: 2 }}>{item.description}</Paragraph>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Rate disabled allowHalf value={item.rating?.rate ?? 4} />
                  <Text type="secondary">({item.rating?.count ?? 0})</Text>
                </div>

                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    gap: 8,
                  }}
                >
                  <Text strong style={{ fontSize: 16 }}>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(item.price)}
                  </Text>

                  <Button
                    type="primary"
                    block
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleBuy(item)}
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    Comprar
                  </Button>

                  <Space style={{ marginTop: 8, justifyContent: "flex-end" }}>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => openEdit(item)}
                    >
                      Editar
                    </Button>

                    <Popconfirm
                      title="Tem certeza que deseja excluir?"
                      onConfirm={() => handleDelete(item.id)}
                      okText="Sim"
                      cancelText="Não"
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        Excluir
                      </Button>
                    </Popconfirm>
                  </Space>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}

      <ProductEditDrawer
        open={editOpen}
        product={productToEdit}
        onClose={() => {
          setEditOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveEdit}
      />

      <NewProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(p) => {
          handleSaveLocalProduct(p);
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default ProductsPage;
