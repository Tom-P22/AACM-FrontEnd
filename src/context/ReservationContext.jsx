import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { createReservationStore } from "../utils/reservations.js";
import { browserStorage } from "../utils/storage.js";
import { useContent } from "./ContentContext";

const ReservationContext = createContext();

function readState(store) {
  const next = { reservations: [], messages: [], error: "" };
  try { next.reservations = store.list(); } catch (error) { next.error = error.message; }
  try { next.messages = store.listMessages(); } catch (error) { next.error = error.message; }
  return next;
}

export function ReservationProvider({ children }) {
  const { user } = useAuth();
  const { store: contentStore } = useContent();
  const [store] = useState(() => createReservationStore(browserStorage, { getProducts: () => contentStore.load().products }));
  const [state, setState] = useState(() => readState(store));

  useEffect(() => {
    const refresh = () => setState(readState(store));
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [store]);

  const execute = (operation, field, replace = false) => {
    try {
      const item = operation();
      setState((prev) => ({ ...prev, [field]: replace ? prev[field].map((entry) => entry.id === item.id ? item : entry) : [...prev[field], item] }));
      return { success: true, item };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <ReservationContext.Provider value={{
      reservations: state.reservations, messages: state.messages,
      createReservation: (data) => execute(() => store.create({ ...data, user }), "reservations"),
      cancelReservation: (id) => execute(() => store.cancel(id, user), "reservations", true),
      saveMessage: (data) => execute(() => store.saveMessage(data), "messages"),
    }}>
      {state.error && <div className="alert alert-warning m-3" role="alert">{state.error}</div>}
      {children}
    </ReservationContext.Provider>
  );
}

// eslint-disable-next-line react/only-export-components
export function useReservations() {
  const context = useContext(ReservationContext);
  if (!context) throw new Error("useReservations debe usarse dentro de ReservationProvider");
  return context;
}
