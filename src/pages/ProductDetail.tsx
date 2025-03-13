
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MinusCircle, PlusCircle, Heart, Share2, Star, ShoppingCart, Truck } from 'lucide-react';
import Navbar from '../components/Navbar';
import { getProductById, getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { toast } from '../hooks/use-toast';
import { Product } from '../types';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const productData = await getProductById(Number(id));
        
        if (productData) {
          setProduct(productData);
          setActiveImage(productData.images[0] || productData.image);
          
          // Load related products
          const allProducts = await getProducts();
          const filtered = allProducts
            .filter(p => p.category === productData.category && p.id !== productData.id)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading product:', error);
        setIsLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    if (product) {
      // Add the product to cart multiple times based on quantity
      const itemsToAdd = Array(quantity).fill(product);
      setCartItems([...cartItems, ...itemsToAdd]);
      toast({
        title: "Added to cart",
        description: `${quantity} ${product.title} has been added to your cart.`,
      });
    }
  };

  const removeFromCart = (id: number) => {
    const index = cartItems.findIndex(item => item.id === id);
    if (index !== -1) {
      const newCartItems = [...cartItems];
      newCartItems.splice(index, 1);
      setCartItems(newCartItems);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar cartItems={cartItems} removeFromCart={removeFromCart} />
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-200 rounded aspect-square"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-12 bg-gray-200 rounded w-1/2 mt-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar cartItems={cartItems} removeFromCart={removeFromCart} />
        <div className="container py-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
          <p className="text-gray-500 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="btn btn-primary px-6 py-2">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar cartItems={cartItems} removeFromCart={removeFromCart} />
      
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center text-sm">
            <li>
              <Link to="/" className="text-gray-500 hover:text-primary">Home</Link>
            </li>
            <li className="mx-2 text-gray-400">/</li>
            <li>
              <Link to="/products" className="text-gray-500 hover:text-primary">Products</Link>
            </li>
            <li className="mx-2 text-gray-400">/</li>
            <li>
              <Link to={`/category/${product.category}`} className="text-gray-500 hover:text-primary">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Link>
            </li>
            <li className="mx-2 text-gray-400">/</li>
            <li className="text-gray-900 font-medium truncate">{product.title}</li>
          </ol>
        </nav>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <img 
                src={activeImage} 
                alt={product.title} 
                className="w-full h-96 object-contain"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(image)}
                  className={`bg-gray-50 rounded-md overflow-hidden p-1 border-2 transition-colors ${
                    activeImage === image ? 'border-primary' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.title} - View ${index + 1}`} 
                    className="w-full h-16 object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.title}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                    className={i < Math.floor(product.rating) ? "" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-gray-600 text-sm">{product.rating} Rating</span>
            </div>
            
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-gray-400 line-through ml-2">
                    ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                  </span>
                  <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                    {Math.round(product.discountPercentage)}% OFF
                  </span>
                </>
              )}
            </div>
            
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="border-t border-b py-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Brand:</span>
                <span className="font-medium">{product.brand}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Availability:</span>
                <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <span className="text-gray-600 mr-4">Quantity:</span>
                <div className="flex items-center">
                  <button 
                    onClick={decrementQuantity}
                    className="text-gray-500 hover:text-primary disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <MinusCircle size={20} />
                  </button>
                  <span className="mx-4 font-medium w-8 text-center">{quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    className="text-gray-500 hover:text-primary disabled:opacity-50"
                    disabled={product.stock <= quantity}
                  >
                    <PlusCircle size={20} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={addToCart}
                  className="btn btn-primary py-3 px-8 flex items-center justify-center"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Add to Cart
                </button>
                <button className="btn btn-secondary py-3 px-8 flex items-center justify-center">
                  <Heart size={18} className="mr-2" />
                  Save for Later
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-primary flex items-center text-sm">
                <Share2 size={16} className="mr-1" />
                Share
              </button>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Truck className="text-primary mr-3 mt-1" size={20} />
                <div>
                  <p className="font-medium">Free shipping</p>
                  <p className="text-sm text-gray-600">Free standard shipping on orders over $99</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct} 
                  addToCart={() => {
                    setCartItems([...cartItems, relatedProduct]);
                    toast({
                      title: "Added to cart",
                      description: `${relatedProduct.title} has been added to your cart.`,
                    });
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
      
      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container">
          <p className="text-center text-gray-400">© 2023 ShopEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetail;
