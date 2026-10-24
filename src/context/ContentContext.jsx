import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { INITIAL_PRODUCTS } from "../data/products.js";
import { INITIAL_NEWS } from "../data/news.js";
import { createContentStore } from "../utils/content.js";
import { browserStorage } from "../utils/storage.js";

const ContentContext = createContext();

export function ContentProvider({ children }) {
  const { user } = useAuth();
  const [store] = useState(() => createContentStore(browserStorage));
  const [state, setState] = useState(() => {
    try { return { ...store.load(), error: "" }; }
    catch (error) { return { products: INITIAL_PRODUCTS, news: INITIAL_NEWS, error: error.message }; }
  });
  useEffect(() => {
    const refresh = () => {
      try { setState({ ...store.load(), error: "" }); }
      catch (error) { setState((prev) => ({ ...prev, error: error.message })); }
    };
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [store]);

  const execute = (operation) => {
    try { setState({ ...operation(), error: "" }); return { success: true }; }
    catch (error) { return { success: false, message: error.message }; }
  };

  return <ContentContext.Provider value={{
    products: state.products, news: state.news, store,
    saveProduct: (data) => execute(() => store.saveProduct(user, data)),
    saveNews: (data) => execute(() => store.saveNews(user, data)),
    toggleProduct: (id) => execute(() => store.toggleProduct(user, id)),
    toggleNews: (id) => execute(() => store.toggleNews(user, id)),
  }}>
    {state.error && <div className="alert alert-warning m-3" role="alert">{state.error}</div>}
    {children}
  </ContentContext.Provider>;
}

// eslint-disable-next-line react/only-export-components
export function useContent() {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useContent debe usarse dentro de ContentProvider");
  return context;
}
