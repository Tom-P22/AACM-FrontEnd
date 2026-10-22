import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user_deportes");
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users_deportes");
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar usuarios y sesión
  useEffect(() => {
    localStorage.setItem("users_deportes", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user_deportes", JSON.stringify(user));
    } else {
      localStorage.removeItem("user_deportes");
    }
  }, [user]);

  const register = (userData) => {
    // Verificar si el correo ya existe
    const exists = users.find((u) => u.correo === userData.correo);
    if (exists) {
      return { success: false, message: "Este correo ya está registrado" };
    }

    // Verificar RUN
    const runExists = users.find((u) => u.run === userData.run);
    if (runExists) {
      return { success: false, message: "Este RUN ya está registrado" };
    }

    const newUser = {
      ...userData,
      id: Date.now(),
      role: "user",
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    return { success: true, message: "Cuenta creada correctamente" };
  };

  const login = (correo, password) => {
    const found = users.find(
      (u) => u.correo === correo && u.password === password
    );

    if (!found) {
      return { success: false, message: "Correo o contraseña incorrectos" };
    }

    setUser(found);
    return { success: true, message: "Sesión iniciada" };
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        register,
        login,
        logout,
        isAdmin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
