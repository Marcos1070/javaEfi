import { useAuth } from "../../context/AuthContext";

const Users = () => {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <p>No tenés permisos para ver usuarios.</p>;
  }

  return (
    <div>
      <h2>Usuarios</h2>
      <p>Aquí se listan los usuarios (solo admin).</p>
    </div>
  );
};

export default Users;
