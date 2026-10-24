import { createContext, useContext, useState } from "react";
import { calculateTotals, createCartStore, emptyCart, reconcileItems } from "../utils/cart.js";
import { browserStorage } from "../utils/storage.js";
import { useContent } from "./ContentContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { products, store: contentStore } = useContent();
  const [store] = useState(() => createCartStore(browserStorage, () => contentStore.load().products));
  const [state, setState] = useState(() => {
    try { return { value: store.load(), error: "" }; }
    catch (error) { return { value: emptyCart(), error: error.message }; }
  });

  const mutate = (operation) => {
    try {
      const next = operation();
      setState({ value: next, error: "" });
      return { success: true, value: next };
    } catch (error) {
      setState((prev) => ({ ...prev, error: error.message }));
      return { success: false, message: error.message };
    }
  };
  const { coupon, date, time } = state.value;
  const items = reconcileItems(state.value.items, products);
  const value = {
    cart: items, items, coupon, date, time, ...calculateTotals(items, coupon, products),
    discountApplied: coupon !== "", cartError: state.error,
    updateQuantity: (product, quantity) => mutate(() => store.setQuantity(product.id, quantity)),
    addToCart: (product) => mutate(() => store.add(product.id)),
    removeFromCart: (id) => mutate(() => store.setQuantity(id, 0)),
    clearCart: () => mutate(() => store.clear()),
    getItemQuantity: (id) => items.find((item) => item.id === id)?.quantity || 0,
    applyCoupon: (code) => {
      const result = mutate(() => store.applyCoupon(code));
      return result.success && result.value.coupon !== "";
    },
    setSchedule: (nextDate, nextTime) => mutate(() => store.setSchedule(nextDate, nextTime)),
  };

  return (
    <CartContext.Provider value={value}>
      {state.error && <div className="alert alert-warning m-3" role="alert">
        {state.error} <button className="btn btn-sm btn-outline-danger ms-2" onClick={value.clearCart}>Vaciar carrito</button>
      </div>}
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}
