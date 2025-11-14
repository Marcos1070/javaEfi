import { createContext, useState, useEffect, useContext } from "react";
import { loginUser, registerUser, userGet } from "../services/api";
import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Cuando se inicializa o cambia el token, decodificarlo para setear user
  useEffect(() => {
    const getUserData = async () => {
       if (token) {
      try {
        const decoded = jwtDecode(token);

        const userData = await userGet(decoded.sub)

        setUser({
          nombre: userData.username,
          id: decoded.sub,
          role: decoded.role,
          exp: decoded.exp,
        });
      } catch (error) {
        console.error("Token inválido o expirado", error);
        logout();
      }
    }
    }

   getUserData()
  }, [token]);

  // Iniciar sesión
  const login = async ({ token: access_token }) => {
    try {
      localStorage.setItem("token", access_token);
      setToken(access_token);

      const decoded = jwtDecode(access_token);
      setUser({
        id: decoded.sub,
        role: decoded.role,
        exp: decoded.exp,
      });

      return { success: true };
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, message: "Error al procesar token" };
    }
  };

  // Registrar usuario
  const register = async (userData) => {
    try {
      await registerUser(userData);
      return { success: true };
    } catch (error) {
      console.error("Error en registro:", error);
      return { success: false, message: "Error al registrar usuario" };
    }
  };

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

export const useAuth = () => useContext(AuthContext);
