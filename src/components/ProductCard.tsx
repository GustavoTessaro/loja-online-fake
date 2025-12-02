import React from "react";
import { Image, notification } from "antd";
import { EyeFilled } from "@ant-design/icons";
import type { Product } from "../types/Product";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const openErrorNotification = () => {
    notification.error({
      message: "Erro ao visualizar",
      description: "Não foi possível carregar os detalhes do produto.",
      placement: "topRight",
    });
  };

  return (
    <div className={styles.card}>
      <Image
        src={product.image}
        alt={product.title}
        width={150}
        height={150}
        style={{ objectFit: "contain" }}
        preview={true}
      />
      <h3>{product.title}</h3>
      <p className={styles.description}>
        {product.description.substring(0, 60)}...
      </p>
      <p className={styles.price}>R$ {product.price}</p>{" "}
      <EyeFilled
        style={{ fontSize: "20px", color: "#8c8c8c", cursor: "pointer" }}
        onClick={openErrorNotification}
      />
    </div>
  );
};
