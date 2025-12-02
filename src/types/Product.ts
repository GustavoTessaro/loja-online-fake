export interface Product {
  id: number | string;
  title: string;
  description: string;
  price: number;
  image: string;
  rating?: {
    rate: number;
    count?: number;
  };
  category?: string;
}
