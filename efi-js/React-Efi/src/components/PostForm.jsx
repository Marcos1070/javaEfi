import { useState } from "react";

export default function PostForm({ onPostCreated }) {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [autor, setAutor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoPost = { titulo, contenido, autor };

    fetch("http://127.0.0.1:5000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoPost),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Post creado:", data);
        onPostCreated(data); // actualiza la lista
        setTitulo("");
        setContenido("");
        setAutor("");
      })
      .catch((err) => console.error("Error al crear post:", err));
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <h2>Crear nuevo Post</h2>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
      />
      <br />
      <textarea
        placeholder="Contenido"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        required
      ></textarea>
      <br />
      <input
        type="text"
        placeholder="Autor"
        value={autor}
        onChange={(e) => setAutor(e.target.value)}
        required
      />
      <br />
      <button type="submit">Guardar</button>
    </form>
  );
}
