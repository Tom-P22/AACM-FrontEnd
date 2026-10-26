import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createLocalAuth } from "../utils/localAuth.js";
import { browserStorage } from "../utils/storage.js";
import { seedExampleAccounts } from "../utils/seedAccounts.js";
import { hasPermission } from "../utils/permissions.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, users: [] });
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState("");
  const [auth] = useState(() => createLocalAuth(browserStorage, window.crypto));
  const initialization = useRef(null);

  useEffect(() => {
    let active = true;
    initialization.current ??= seedExampleAccounts(browserStorage, window.crypto);
    initialization.current.then((next) => { if (active) setState(next); })
      .catch((error) => { if (active) setStorageError(error.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [auth]);

  const run = async (operation) => {
    try {
      const next = await operation();
      setState(next);
      setStorageError("");
      return { success: true, user: next.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    try {
      auth.logout();
      setState((prev) => ({ ...prev, user: null }));
      setStorageError("");
      return { success: true };
    } catch (error) {
      setStorageError(error.message);
      return { success: false, message: error.message };
    }
  };

  const value = {
    ...state, loading,
    register: (data) => run(() => auth.register(data)),
    login: (correo, password) => run(() => auth.login(correo, password)),
    updateProfile: (data) => run(() => auth.updateProfile(state.user?.id, data)),
    logout,
    isAdmin: state.user?.role === "admin",
    canAccessAdmin: hasPermission(state.user, "admin:access"),
    can: (permission) => hasPermission(state.user, permission),
    isAuthenticated: !!state.user,
  };

  return (
    <AuthContext.Provider value={value}>
      {storageError && <div className="alert alert-warning m-3" role="alert">{storageError}</div>}
      {loading ? <div className="container py-5" role="status">Cargando sesión…</div> : children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
