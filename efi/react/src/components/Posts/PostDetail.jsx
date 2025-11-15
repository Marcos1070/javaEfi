import React from 'react';
import { Button } from 'primereact/button';
import ReviewList from './Review';

const PostDetail = ({ post, puedeModificar, setEditingPost, handleDelete }) => {
    return (
        <div key={post.id} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "#000", color: "#fff" }}>
            <h3 style={{ color: "#fff" }}>{post.titulo}</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.5", color: "#fff" }}>{post.contenido}</p>
            <p>
                <strong style={{ color: "#fff" }}>Autor:</strong> <span style={{ fontStyle: "italic", color: "#fff" }}>{post.autor}</span>
            </p>

            <small style={{ color: "#fff" }}>
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

            <hr style={{ borderColor: "#fff" }} />

            <ReviewList
                post_id={post.id}
                
            
            />
        </div>
    );
};

export default PostDetail;