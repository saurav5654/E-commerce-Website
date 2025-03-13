
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/productService';
import { Category } from '../types';
import Navbar from '../components/Navbar';
import { useToast } from '@/components/ui/use-toast';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar cartItems={cartItems} removeFromCart={removeFromCart} />
        <div className="container py-12 flex justify-center items-center">
          <div className="animate-pulse flex flex-col space-y-4 w-full max-w-4xl">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartItems={cartItems} removeFromCart={removeFromCart} />
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Shop by Category</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/products?category=${category.name}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 bg-white border-t">
                  <h3 className="text-xl font-semibold text-center">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
