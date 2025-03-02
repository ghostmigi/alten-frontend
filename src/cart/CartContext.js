import React, { createContext, useContext, useState } from "react";

// Create CartContext
const CartContext = createContext();

// Create CartProvider to wrap the app and provide cart state
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add a product to the cart
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook to use CartContext easily in components
export const useCart = () => {
  return useContext(CartContext);
};
