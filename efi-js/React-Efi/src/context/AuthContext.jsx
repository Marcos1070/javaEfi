// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { loginUser, registerUser } from "../services/api";
import { jwtDecode } from "jwt-decode";

// Crear el contexto
export const AuthContext = createContext();

// Proveedor de contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Cargar usuario desde el token guardado (si existe)
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          email: decoded.sub,
          exp: decoded.exp,
          iat: decoded.iat,
        });
      } catch (error) {
        console.error("Token inválido o expirado", error);
        logout();
      }
    }
  }, [token]);

  // Iniciar sesión
  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      console.log("Usuario seteado en contexto:", data.user);
      return { success: true };
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, message: "Credenciales incorrectas" };
    }
  };

  // Registrar usuario nuevo
  const register = async (userData) => {
    try {
      await registerUser(userData);
      return { success: true };
    } catch (error) {
      console.error("Error en registro:", error);
      return { success: false, message: "Error al registrar usuario" };
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};
