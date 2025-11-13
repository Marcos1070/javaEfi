import { useEffect, useState } from "react";
import PostForm from "./PostForm";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    fetch("http://127.0.0.1:5000/api/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error al obtener los posts:", error));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (nuevoPost) => {
    setPosts((prev) => [...prev, nuevoPost]);
  };

  return (
    <div>
      <h1>Aplicación React + Flask</h1>

      <PostForm onPostCreated={handlePostCreated} />

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
            <p>
              <small>
                Creado: {new Date(post.createdAt).toLocaleString()}
              </small>
            </p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}



