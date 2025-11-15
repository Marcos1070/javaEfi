import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { createPost } from "../../services/api";

export default function PostForm({ onPostCreated, onPostUpdated, editingPost }) {
  const [titulo, setTitulo] = useState(editingPost?.titulo || "");
  const [contenido, setContenido] = useState(editingPost?.contenido || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = { title: titulo, content: contenido };

    // 👉 Si estamos editando
    if (editingPost) {
      fetch(`http://127.0.0.1:5000/api/posts/${editingPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      })
        .then((res) => res.json())
        .then((updated) => {
          onPostUpdated(updated);
        })
        .catch((err) => console.error("Error al actualizar", err));

      return;
    }

    // 👉 Si estamos creando uno nuevo

    const newPost = await createPost(postData)
    console.log(newPost) // como viene en del servidor
    onPostCreated({
      id: newPost.id,
      titulo: newPost.title,
      contenido: newPost.content,
      createdAt: newPost.created_at,
      autor: newPost.user_id,  // ⚠️ Ajustar si querés mostrar el nombre del usuario
    });
        setTitulo("");
        setContenido("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-round surface-card shadow-2"
      style={{ marginBottom: "1.5rem" }}
    >
      <h3>{editingPost ? "Editar Post" : "Crear Nuevo Post"}</h3>

      <div className="p-field">
        <label>Título</label>
        <InputText
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          className="w-full"
        />
      </div>

      <div className="p-field mt-3">
        <label>Contenido</label>
        <InputTextarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          rows={5}
          className="w-full"
        />
      </div>

      
      <Button
        type="submit"
        label={editingPost ? "Actualizar" : "Crear"}
        icon={editingPost ? "pi pi-pencil" : "pi pi-check"}
        className="mt-3"
      />
    </form>
  );
}

