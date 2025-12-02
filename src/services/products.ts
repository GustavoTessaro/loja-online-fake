// serviço simples para buscar produtos da API pública (ou sua API)
// exporte getProducts() que retorna Promise<Product[]>
import type { Product } from "../types/Product";

const API = "https://fakestoreapi.com/products";

export async function getProducts(limit?: number): Promise<Product[]> {
  const url = limit ? `${API}?limit=${limit}` : API;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao buscar produtos");
  const data = await res.json();
  return data as Product[];
}
