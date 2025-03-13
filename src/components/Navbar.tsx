
import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartDrawer from './CartDrawer';
import { Product } from '../types';

interface NavbarProps {
  cartItems: Product[];
  removeFromCart: (id: number) => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartItems, removeFromCart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  
  const cartItemCount = cartItems.length;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-2" 
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="text-xl font-bold text-primary font-poppins">ShopEase</Link>
          </div>
          
          <nav className={`md:flex ${isMenuOpen ? 'block absolute top-16 left-0 right-0 bg-white shadow-md p-4' : 'hidden'} md:static md:shadow-none md:p-0`}>
            <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">Shop</Link></li>
              <li><Link to="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex items-center text-gray-600 hover:text-primary transition-colors" aria-label="Search">
              <Search size={20} />
            </button>
            <button 
              className="flex items-center text-gray-600 hover:text-primary transition-colors relative" 
              onClick={toggleCart}
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
      />
    </header>
  );
};

export default Navbar;
