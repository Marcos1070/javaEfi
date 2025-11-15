import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { useAuth } from "../../context/AuthContext.jsx";
import PostForm from "./PostForm.jsx";
import { deletePost, getPosts } from "../../services/api.js";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  const { token, user } = useAuth();

  // Obtener posts
  const fetchPosts = async() => {   
    const postData = await getPosts()
    const newPosts = postData.map(p => ({
    id: p.id,
    titulo: p.title,
    contenido: p.content,
    createdAt: p.created_at,
    autor: p.user_id,  // ⚠️ Ajustar si querés mostrar el nombre del usuario
  }));
    
    setPosts(newPosts)
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
      await deletePost(id)
      
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error:", error);
         alert("Error al eliminar el post");
    }
  };

  // Verificar si puede editar/eliminar según rol
  const puedeModificar = (post) => {
  
    if (user?.role === "admin") return true;
    return post.autor === user?.id;
  };
  console.log(editingPost)

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
                    className="p-button-danger ml-2"
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




