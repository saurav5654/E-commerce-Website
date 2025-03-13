
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Product } from '../types';

const About = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartItems={cartItems} removeFromCart={removeFromCart} />
      
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">About ShopEase</h1>
          
          <div className="mb-12 overflow-hidden rounded-lg shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
              alt="Our team" 
              className="w-full h-80 object-cover"
            />
          </div>
          
          <div className="space-y-8 text-lg">
            <p>
              Welcome to ShopEase, where shopping meets simplicity. Founded in 2023, we've set out to redefine the online shopping experience by making it more intuitive, personalized, and enjoyable.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8">Our Mission</h2>
            <p>
              At ShopEase, our mission is to connect people with the products they love through a seamless, stress-free shopping journey. We believe that finding the perfect item shouldn't be complicated or time-consuming.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8">Our Products</h2>
            <p>
              We curate a diverse collection of high-quality products across multiple categories. Each item in our inventory is carefully selected to ensure it meets our standards for quality, value, and customer satisfaction.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8">Customer-First Approach</h2>
            <p>
              Our customers are at the heart of everything we do. We're committed to providing exceptional customer service, transparent policies, and a shopping experience that exceeds expectations at every touchpoint.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8">Join Our Community</h2>
            <p>
              Become part of the ShopEase community and enjoy exclusive benefits, early access to new products, and special promotions. We value your feedback and continuously improve our platform based on customer insights.
            </p>
            
            <div className="flex justify-center mt-10">
              <a href="/contact" className="btn btn-primary px-6 py-3">Get in Touch</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
