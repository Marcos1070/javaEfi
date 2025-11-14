import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import { ToastContainer, toast } from "react-toastify";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Helmet } from "react-helmet";
import "../styles/LoginForm.css";
import "../styles/RegisterForm.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Intentando login con:", formData);

      //Enviamos email y password al backend
      const res = await api.post("/login", formData);
      console.log("Respuesta backend:", res.data);

      if (!res.data.token) {
        toast.error("No se recibió token del servidor");
        return;
      }

      // Llamamos al login del AuthContext correctamente
      await login(formData);

      toast.success("Inicio de sesión exitoso");

      navigate("/home"); // o la ruta que corresponda
    } catch (err) {
      console.error("Error login:", err);

      if (err.response) {
        toast.error(
          `Error ${err.response.status}: ${
            err.response.data.error || "Error desconocido"
          }`
        );
      } else {
        toast.error("No se pudo conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <Helmet>
        <title>Inicio de sesión</title>
      </Helmet>

      <Card title="Iniciar Sesión" className="p-4 shadow-3 login-card">
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field mb-3">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Tu correo"
              required
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="password">Contraseña</label>
            <Password
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              toggleMask
              feedback={false}
              placeholder="Tu contraseña"
              required
            />
          </div>

          <Button
            label={loading ? "Ingresando..." : "Ingresar"}
            icon="pi pi-sign-in"
            className="p-button-primary w-full mt-4"
            type="submit"
            disabled={loading}
          />
        </form>

        <p className="register-link">
          ¿No tenés cuenta? <a href="/register">Registrate aquí</a>
        </p>
      </Card>
      <ToastContainer />
    </div>
  );
}



