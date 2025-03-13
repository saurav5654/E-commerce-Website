
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../services/productService';
import { toast } from '../hooks/use-toast';
import { Product, Category } from '../types';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const productsData = await getProducts();
        const categoriesData = await getCategories();
        
        setProducts(productsData);
        setCategories(categoriesData);
        setFeaturedProducts(productsData.slice(0, 4));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const addToCart = (product: Product) => {
    setCartItems([...cartItems, product]);
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  const removeFromCart = (id: number) => {
    const index = cartItems.findIndex(item => item.id === id);
    if (index !== -1) {
      const newCartItems = [...cartItems];
      newCartItems.splice(index, 1);
      setCartItems(newCartItems);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartItems={cartItems} removeFromCart={removeFromCart} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Shop the Latest <span className="text-primary">Tech</span> Products
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Discover the most advanced gadgets and accessories with exclusive deals and free shipping.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products" className="btn btn-primary px-8 py-3 text-base">
                  Shop Now
                </Link>
                <Link to="/categories" className="btn btn-secondary px-8 py-3 text-base">
                  Explore Categories
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://i.dummyjson.com/data/products/1/1.jpg" 
                alt="Featured Product" 
                className="rounded-lg shadow-xl mx-auto"
              />
              <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-1 text-yellow-400 mb-1">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <span className="text-gray-700 ml-1 text-sm">5.0</span>
                </div>
                <p className="text-sm font-medium text-gray-800">Best Seller in Smartphones</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
            <Link to="/categories" className="text-primary flex items-center font-medium hover:underline">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-lg aspect-square"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link 
                  to={`/category/${category.name.toLowerCase()}`} 
                  key={category.id} 
                  className="group"
                >
                  <div className="bg-gray-50 rounded-lg p-4 text-center transition-all hover:shadow-md">
                    <div className="w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full">
                      <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <h3 className="font-medium text-gray-800">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary flex items-center font-medium hover:underline">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white animate-pulse rounded-lg aspect-[3/4]"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  addToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Promotion Banner */}
      <section className="py-16 bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Summer Sale</h2>
              <p className="text-xl mb-8 text-blue-100">Get up to 50% off on selected items!</p>
              <Link to="/products" className="bg-white text-primary px-8 py-3 rounded-md font-medium inline-flex items-center group">
                Shop the Sale
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -top-6 -right-6 bg-yellow-400 text-gray-900 rounded-full w-24 h-24 flex items-center justify-center font-bold text-xl transform rotate-12">
                  50% OFF
                </div>
                <img 
                  src="https://i.dummyjson.com/data/products/5/1.jpg" 
                  alt="Summer Sale" 
                  className="rounded-lg mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ShopEase</h3>
              <p className="text-gray-400 mb-4">The best place to shop for all your tech needs with amazing deals and discounts.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Shop</h3>
              <ul className="space-y-2">
                <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">All Products</Link></li>
                <li><Link to="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
                <li><Link to="/deals" className="text-gray-400 hover:text-white transition-colors">Deals</Link></li>
                <li><Link to="/new-arrivals" className="text-gray-400 hover:text-white transition-colors">New Arrivals</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/faqs" className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
                <li><Link to="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping</Link></li>
                <li><Link to="/returns" className="text-gray-400 hover:text-white transition-colors">Returns</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary flex-1"
                />
                <button 
                  type="submit" 
                  className="bg-primary px-4 py-2 rounded-r-md text-white font-medium"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2023 ShopEase. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="text-gray-400 text-sm hover:text-white transition-colors">Terms of Service</Link>
                <Link to="/cookies" className="text-gray-400 text-sm hover:text-white transition-colors">Cookies Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
