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
    const exists = users.find((u) => u.correo === userData.correo);
    if (exists) {
      return { success: false, message: "Este correo ya está registrado" };
    }

    const runExists = users.find((u) => u.run === userData.run);
    if (runExists) {
      return { success: false, message: "Este RUN ya está registrado" };
    }

    const newUser = {
      ...userData,
      id: Date.now(),
      role: "user",
      comuna: userData.comuna || "San Miguel",
      telefono: userData.telefono || "+56 9 1234 5678",
      avatar: userData.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      deporteFavorito: userData.deporteFavorito || "Fútbol / Pádel",
      tarjetaVecino: true,
      calificacion: 5.0,
      reservasRealizadas: 0,
      puntosDeportista: 100,
      nivelDeportista: "Deportista Vecino",
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

  // Nueva función para actualizar perfil de manera segura
  const updateProfile = (updatedData) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? updatedUser : u))
    );
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
        updateProfile,
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