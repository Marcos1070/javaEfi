import { createContext, useState, useEffect, useContext } from "react";
import { loginUser, registerUser } from "../services/api";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);

        setUser({
          email: decoded.sub,
          role: decoded.role,  
          exp: decoded.exp,
        });

      } catch (error) {
        console.error("Token inválido o expirado", error);
        logout();
      }
    }
  }, [token]);


  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);

      localStorage.setItem("token", data.token);
      setToken(data.token);

      // El backend debe devolver el usuario incluyendo el rol
      setUser(data.user);

      return { success: true };

    } catch (error) {
      return { success: false, message: "Credenciales incorrectas" };
    }
  };


  const register = async (userData) => {
    try {
      await registerUser(userData);
      return { success: true };
    } catch (error) {
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

