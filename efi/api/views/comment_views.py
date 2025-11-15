# views/comment_views.py
from flask import request
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Comment, Post, User
from schemas.comment_schema import CommentSchema
from marshmallow import ValidationError

class CommentListAPI(MethodView):
    @jwt_required()
    def post(self, post_id):
        """Crear un comentario en un post"""
        Post.query.get_or_404(post_id)  # Validar que el post exista

        try:
            data = CommentSchema().load(request.get_json())
        except ValidationError as err:
            return {"errors": err.messages}, 400

        user_id = int(get_jwt_identity())
        comment = Comment(
            content=data["content"],
            post_id=post_id,
            user_id=user_id
        )
        db.session.add(comment)
        db.session.commit()
        return {"message": "Comentario creado", "comment_id": comment.id}, 201
    @jwt_required() 
    def get(self, post_id):
        """Obtener comentarios de un post"""
        Post.query.get_or_404(post_id)
        comments = Comment.query.filter_by(post_id=post_id).all()
        return CommentSchema(many=True).dump(comments), 200
    
    @jwt_required() 
    def delete(self, comment_id):
        """Eliminar todos los comentarios de un post (solo admin)"""
        user_id = int(get_jwt_identity())
        # Aquí debería ir la lógica para verificar si el usuario es admin
        # Asumimos que hay una función is_admin(user_id) que lo verifica
        comment = Comment.query.get_or_404(comment_id)
        user=User.query.get_or_404(user_id)
        role=user.role

        print("ROLE:", role)
        print("USER ID:", user_id)
        print("COMMENT USER ID:", comment.user_id)  
        if role != "admin":
            if user_id != comment.user_id:
                return {"msg": "No autorizado"}, 403
                 

        db.session.delete(comment)
        db.session.commit()
        return {"message": "Comentario eliminado"}, 200
    
    @jwt_required()
    def put(self, comment_id):
        """Editar un comentario"""
        comment = Comment.query.get_or_404(comment_id)
        user_id = int(get_jwt_identity())
        user=User.query.get_or_404(user_id)
        role=user.role

        if role != "admin":
            if user_id != comment.user_id:
                return {"msg": "No autorizado"}, 403
                 
        try:
            #obtiene los datos de json y los valida con el schema
            data = CommentSchema().load(request.get_json(), partial=True)
        except ValidationError as err:
            return {"errors": err.messages}, 400

        # Actualiza los campos del comentario
        for key, value in data.items():
            setattr(comment, key, value)

        db.session.commit()
        return CommentSchema().dump(comment), 200
