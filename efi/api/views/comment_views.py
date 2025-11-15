# views/comment_views.py
from flask import request
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Comment, Post
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

        user_id = get_jwt_identity()
        comment = Comment(
            content=data["content"],
            post_id=post_id,
            user_id=user_id
        )
        db.session.add(comment)
        db.session.commit()
        return {"message": "Comentario creado", "comment_id": comment.id}, 201

    def get(self, post_id):
        """Obtener comentarios de un post"""
        Post.query.get_or_404(post_id)
        comments = Comment.query.filter_by(post_id=post_id).all()
        return CommentSchema(many=True).dump(comments), 200
