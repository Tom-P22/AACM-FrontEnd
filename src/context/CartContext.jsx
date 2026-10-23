import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  // Actualiza o agrega un producto con cantidad específica
  const updateQuantity = (product, newQuantity) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);

      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.id !== product.id);
      }

      if (exists) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }

      return [...prevCart, { ...product, quantity: newQuantity }];
    });
  };

  const addToCart = (product) => {
    const currentQty = getItemQuantity(product.id);
    updateQuantity(product, currentQty + 1);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCoupon("");
    setDiscountApplied(false);
  };

  const getItemQuantity = (id) => {
    const item = cart.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const applyCoupon = (code) => {
    if (code.trim().toUpperCase() === "SANMIGUEL") {
      setCoupon("SANMIGUEL");
      setDiscountApplied(true);
      return true;
    }
    setDiscountApplied(false);
    return false;
  };

  // Cálculos automáticos de precio
  const subtotal = cart.reduce(
    (acc, item) => acc + (item.precio || item.price || 0) * (item.quantity || 1),
    0
  );
  const discount = discountApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart, // Aliased para compatibilidad
        updateQuantity,
        addToCart,
        removeFromCart,
        clearCart,
        getItemQuantity,
        applyCoupon,
        subtotal,
        discount,
        total,
        discountApplied,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);