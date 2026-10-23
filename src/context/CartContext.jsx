import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Actualiza o agrega un producto estableciendo una cantidad exacta
  const updateQuantity = (product, newQuantity) => {
    setCart(prevCart => {
      const exists = prevCart.find(item => item.id === product.id);

      if (newQuantity <= 0) {
        return prevCart.filter(item => item.id !== product.id);
      }

      if (exists) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }

      return [...prevCart, { ...product, quantity: newQuantity }];
    });
  };

  // Función de apoyo para agregar 1 unidad rápidamente
  const addToCart = (product) => {
    const currentQty = getItemQuantity(product.id);
    updateQuantity(product, currentQty + 1);
  };

  // Vaciar carrito por completo
  const clearCart = () => setCart([]);

  // Obtener la cantidad de un ítem por su ID
  const getItemQuantity = (id) => {
    const item = cart.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  // Calcular total de productos acumulados
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        updateQuantity, 
        addToCart, 
        clearCart, 
        getItemQuantity, 
        totalItems 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);