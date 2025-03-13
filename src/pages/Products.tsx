import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown, X, Sliders, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../services/productService';
import { toast } from '../hooks/use-toast';
import { Product, Category } from '../types';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const productsData = await getProducts();
        const categoriesData = await getCategories();
        
        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, priceRange, sortBy, searchQuery, products]);

  const applyFilters = () => {
    let result = [...products];
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply price range filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.title.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'priceLowToHigh':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // In a real app, this would sort by date
        // Here we'll just reverse the array as an example
        result.reverse();
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default sorting (featured)
        break;
    }
    
    setFilteredProducts(result);
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 2000]);
    setSortBy('featured');
    setSearchQuery('');
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

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
    <div className="min-h-screen">
      <Navbar cartItems={cartItems} removeFromCart={removeFromCart} />
      
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <nav className="mb-4 sm:mb-0">
              <ol className="flex items-center text-sm">
                <li>
                  <Link to="/" className="text-gray-500 hover:text-primary">Home</Link>
                </li>
                <li className="mx-2 text-gray-400">/</li>
                <li className="text-gray-900 font-medium">Products</li>
              </ol>
            </nav>
            <p className="text-gray-500">{filteredProducts.length} products found</p>
          </div>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Box */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            {/* Sort Dropdown */}
            <div className="w-full lg:w-64">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={toggleFilterVisibility}
              className="lg:hidden flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-md"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>
          
          {/* Active Filters Display */}
          {(selectedCategory || priceRange[0] > 0 || priceRange[1] < 2000) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCategory && (
                <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <span>Category: {selectedCategory}</span>
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="ml-1 text-gray-500 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {(priceRange[0] > 0 || priceRange[1] < 2000) && (
                <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <span>Price: ${priceRange[0]} - ${priceRange[1]}</span>
                  <button
                    onClick={() => setPriceRange([0, 2000])}
                    className="ml-1 text-gray-500 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              <button
                onClick={resetFilters}
                className="text-primary hover:underline text-sm"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <div className={`lg:block ${isFilterVisible ? 'block' : 'hidden'} lg:col-span-1`}>
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center">
                  <Sliders size={18} className="mr-2" />
                  Filters
                </h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Reset
                </button>
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.name.toLowerCase()}
                        onChange={() => setSelectedCategory(category.name.toLowerCase())}
                        className="mr-2"
                      />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between mb-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Close Button (Mobile Only) */}
              <button
                onClick={toggleFilterVisibility}
                className="lg:hidden w-full py-2 text-center bg-gray-100 hover:bg-gray-200 rounded-md mt-4"
              >
                Close Filters
              </button>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg aspect-[3/4]"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={resetFilters}
                  className="btn btn-primary px-6 py-2"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container">
          <p className="text-center text-gray-400">© 2023 ShopEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Products;
