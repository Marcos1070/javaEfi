import { Fragment } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <Fragment>
      <h2>Bienvenido/a, {user?.nombre || "Usuario"}</h2>
      <p>Seleccioná una sección para continuar:</p>

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <Button 
          onClick={() => navigate("/posts")}
          label="Ver Posts"
          className="p-button-primary"
        />

        <Button 
          onClick={() => navigate("/reviews")}
          label="Ver Reviews"
          className="p-button-secondary"
        />

        <Button
          onClick={logout}
          label="Cerrar sesión"
          severity="danger"
        />
      </div>

      <h3 style={{ marginTop: "2rem" }}>Información</h3>
      <p>Usá el menú o los botones para navegar entre Posts, Reviews y otras secciones.</p>
    </Fragment>
  );
};

export default Home;



