import React, { useEffect, useState } from 'react';
import { deleteReview, getReviews } from '../../services/api';
import { Button } from 'primereact/button';
import { useAuth } from '../../context/AuthContext';

const ReviewList = ({ post_id }) => {
    const [comentarios, setComentarios] = useState([]);
   
     const {  user } = useAuth  ();


    useEffect(() => {
        const fetchComentarios = async () => {
            const data = await getReviews(post_id);
            setComentarios(data);
        };

        fetchComentarios();
    }, []);


    const puedeModificar = (comentario) => {
        if (user?.role === "admin") return true;
        return comentario.user_id === user?.id;
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Seguro que querés eliminar este comentario?")) return;
        
        try {   
            await deleteReview(id);
            const updatedComentarios = comentarios.filter((c) => c.id !== id);
            setComentarios(updatedComentarios);
        } catch (error) {
            console.error("Error:", error);
            alert("Error al eliminar el comentario");
        }
    }

    return (
        <div>
            {comentarios.map((comentario) => (
                <div key={comentario.id} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "#02008bff", color: "#fff" }}>
                    <p style={{ fontSize: "1.1rem", lineHeight: "1.5", color: "#fff" }}>{comentario.content}</p>
                    <p>
                        <strong style={{ color: "#fff" }}>Autor:</strong> <span style={{ fontStyle: "italic", color: "#fff" }}>{comentario.user_id}</span>
                    </p>
                    <small style={{ color: "#fff" }}>
                        Creado: {new Date(comentario.created_at).toLocaleString()}
                    </small>
                    {puedeModificar(comentario) && (
                        <Button
                            label="Eliminar"
                            className="p-button-danger ml-2"
                            onClick={() => handleDelete(comentario.id)}
                        />
                    )}
                </div>
            ))}

        </div>

    );
};

export default ReviewList;