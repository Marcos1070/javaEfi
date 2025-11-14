import { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Card } from "primereact/card";
import { Helmet } from "react-helmet"; // título dinámico
import "../styles/RegisterForm.css";

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Usuario registrado correctamente");
        setForm({ username: "", email: "", password: "", role: "" });
      } else {
        alert(`❌ Error: ${JSON.stringify(data.errors || data.msg)}`);
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Error al conectar con la API");
    }
  };

  return (
    <div className="form-container">
      <Helmet>
        <title>Registro de usuario</title> {/* <- título dinámico */}
      </Helmet>

      <Card title="Registro de Usuario" className="p-4 p-card shadow-3">
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field mb-3">
            <label>Nombre</label>
            <InputText name="username" value={form.username} onChange={handleChange} />
          </div>

          <div className="field mb-3">
            <label>Email</label>
            <InputText name="email" value={form.email} onChange={handleChange} />
          </div>

          <div className="field mb-3">
            <label>Contraseña</label>
            <Password
              name="password"
              value={form.password}
              onChange={handleChange}
              toggleMask
              feedback={false}
              placeholder="Tu contraseña"
            />
          </div>

          <div className="field mb-4">
            <label>Rol</label>
            <InputText name="role" value={form.role} onChange={handleChange} />
          </div>

          <Button type="submit" label="Registrarse" className="p-button-success w-full mt-2" />
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          ¿Ya tenés cuenta? <a href="/login">Iniciá sesión</a>
        </p>
      </Card>
    </div>
  );
}
