import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { useAuth } from "../../context/AuthContext.jsx";
import PostForm from "./PostForm.jsx";
import { deletePost, getPosts } from "../../services/api.js";
import PostDetail from "./PostDetail.jsx";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  const {  user } = useAuth();

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
 console.log(posts);
 console.log(user);

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
          <PostDetail
            key={post.id}
            post={post}
            puedeModificar={puedeModificar}
            setEditingPost={setEditingPost}
            handleDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}




