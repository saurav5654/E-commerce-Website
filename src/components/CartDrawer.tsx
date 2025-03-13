
import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Product[];
  removeFromCart: (id: number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cartItems, removeFromCart }) => {
  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Your Cart ({cartItems.length})</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close cart"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Link 
                  to="/products" 
                  className="btn btn-primary px-4 py-2"
                  onClick={onClose}
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center space-x-4 border-b pb-4">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <p className="text-primary font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-red-500"
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <X size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {cartItems.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span className="font-semibold">${totalPrice}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between py-2 mb-4">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">${totalPrice}</span>
              </div>
              <Link
                to="/checkout"
                className="btn btn-primary w-full py-3"
                onClick={onClose}
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={onClose}
                className="btn btn-secondary w-full py-3 mt-2"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
