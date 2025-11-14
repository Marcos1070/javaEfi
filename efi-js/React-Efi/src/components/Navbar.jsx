import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  // Menú visible según el rol
  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => navigate("/home"),
    },
    {
      label: "Posts",
      icon: "pi pi-file",
      command: () => navigate("/posts"),
    },
    {
      label: "Reviews",
      icon: "pi pi-star",
      command: () => navigate("/reviews"),
    },
  ];

  // Si el usuario es admin → agregar item especial
  if (user?.rol === "admin") {
    items.push({
      label: "Admin Panel",
      icon: "pi pi-shield",
      command: () => navigate("/admin"),
    });
  }

  const start = (
    <h2 style={{ margin: 0, padding: 0 }}>App React + Flask</h2>
  );

  const end = (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <span>👤 {user?.nombre || "Invitado"}</span>

      <Button
        label="Cerrar sesión"
        icon="pi pi-sign-out"
        severity="danger"
        onClick={logout}
      />
    </div>
  );

  return (
    <Menubar
      model={items}
      start={start}
      end={end}
      style={{ marginBottom: "2rem" }}
    />
  );
}
