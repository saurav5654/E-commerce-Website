
import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  return (
    <div className="product-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden group">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy" // Added lazy loading
          />
        </Link>
        
        {product.discountPercentage > 0 && (
          <span className="badge badge-primary absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart size={18} className="text-gray-600" />
          </button>
        </div>
        
        <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
          <button 
            onClick={() => addToCart(product)}
            className="w-full bg-white text-gray-900 py-2 rounded-md font-medium flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart size={18} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium mb-1 truncate">
          <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
            {product.title}
          </Link>
        </h3>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        <div className="flex items-center">
          <span className="font-semibold text-primary">${product.price.toFixed(2)}</span>
          {product.discountPercentage > 0 && (
            <span className="text-gray-400 line-through ml-2 text-sm">
              ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
