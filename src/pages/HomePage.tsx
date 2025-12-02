import React, { useEffect, useState } from "react";
import { Spin, notification } from "antd";
import type { Product } from "../types/Product";
import { getProducts } from "../services/products";
import { ProductCard } from "../components/ProductCard";
import styles from "./HomePage.module.css";

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts(5)
      .then(setProducts)
      .catch(() =>
        notification.error({
          message: "Erro na API",
          description: "Não foi possível buscar os produtos.",
        })
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Spin fullscreen tip="Carregando produtos..." />;
  }

  return (
    <div className={styles.homeBody}>
      <h1 className={styles.titulo}>Seja bem-vindo a Loja Fake</h1>
      <h2 className={styles.subtitulo}>Top 5 Produtos mais procurados</h2>
      <div className={styles.produtos}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};
