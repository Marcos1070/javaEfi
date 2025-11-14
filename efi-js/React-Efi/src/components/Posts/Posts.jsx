import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { useAuth } from "../../context/AuthContext.jsx";
import PostForm from "./PostForm.jsx";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  const { token, user } = useAuth();

  // Obtener posts
  const fetchPosts = () => {
    fetch("http://127.0.0.1:5000/api/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) =>
        console.error("Error al obtener los posts:", error)
      );
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Crear post
  const handlePostCreated = (nuevoPost) => {
    setPosts((prev) => [...prev, nuevoPost]);
  };

  // Actualizar post editado
  const handlePostUpdated = (postActualizado) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postActualizado.id ? postActualizado : p))
    );
    setEditingPost(null);
  };

  // Eliminar post
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que querés eliminar este post?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Error al eliminar el post");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Verificar si puede editar/eliminar según rol
  const puedeModificar = (post) => {
    if (user.rol === "admin") return true;
    return post.autor === user.name;
  };

  return (
    <div>
      <h1>Gestión de Posts</h1>

      {/* Formulario crear o editar */}
      <PostForm
        onPostCreated={handlePostCreated}
        editingPost={editingPost}
        onPostUpdated={handlePostUpdated}
      />

      <h2>Lista de Posts</h2>

      {posts.length === 0 ? (
        <p>No hay posts disponibles.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} style={{ marginBottom: "1rem" }}>
            <h3>{post.titulo}</h3>
            <p>{post.contenido}</p>

            <p>
              <strong>Autor:</strong> {post.autor}
            </p>

            <small>
              Creado: {new Date(post.createdAt).toLocaleString()}
            </small>

            <div style={{ marginTop: "0.5rem" }}>
              {puedeModificar(post) && (
                <>
                  <Button
                    label="Editar"
                    className="p-button-warning mr-2"
                    onClick={() => setEditingPost(post)}
                  />

                  <Button
                    label="Eliminar"
                    className="p-button-danger"
                    onClick={() => handleDelete(post.id)}
                  />
                </>
              )}
            </div>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}




