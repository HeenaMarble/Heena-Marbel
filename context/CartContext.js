"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('heenamarble-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('heenamarble-cart', JSON.stringify(cartItems));
    }
  }, [cartItems, mounted]);

function getCartItemKey(item) {
  if (item.cartKey) return String(item.cartKey);
  if (item.variantId) return `${item.id}-${item.variantId}`;
  return String(item.id);
}

  const addToCart = (product, quantity = 1) => {
    const key = getCartItemKey(product);
    setCartItems(prev => {
      const existing = prev.find(item => getCartItemKey(item) === key);
      if (existing) {
        return prev.map(item => 
          getCartItemKey(item) === key ? { ...item, quantity: item.quantity + (quantity || 1) } : item
        );
      }
      return [...prev, { ...product, cartKey: key, quantity: quantity || 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (key) => {
    const targetKey = String(key);
    setCartItems(prev => prev.filter(item => getCartItemKey(item) !== targetKey));
  };

  const updateQuantity = (key, newQuantity) => {
    const targetKey = String(key);
    if (newQuantity < 1) {
      removeFromCart(targetKey);
      return;
    }
    setCartItems(prev => prev.map(item => 
      getCartItemKey(item) === targetKey ? { ...item, quantity: newQuantity } : item
    ));
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      isCartOpen, 
      toggleCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
