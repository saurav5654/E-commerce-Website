
// Product type definitions
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  image: string;
  images: string[];
}

export interface Category {
  id: number;
  name: string;
  image: string;
}
