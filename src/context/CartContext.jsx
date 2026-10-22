import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("cart_deportes");
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem("cart_deportes", JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    setItems((prev) => {
      // Si ya existe, no lo agregamos de nuevo (cada cancha/implemento es único)
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev;
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setDiscountApplied(false);
    setCoupon("");
  };

  const applyCoupon = (code) => {
    if (code.toUpperCase() === "SANMIGUEL") {
      setDiscountApplied(true);
      setCoupon(code);
      return true;
    }
    setDiscountApplied(false);
    return false;
  };

  const subtotal = items.reduce((acc, item) => acc + item.precio * item.quantity, 0);
  const discount = discountApplied ? Math.round(subtotal * 0.1) : 0; // 10% descuento
  const total = subtotal - discount;
  const cartCount = items.length;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        applyCoupon,
        coupon,
        discountApplied,
        subtotal,
        discount,
        total,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}
