# views/post_views.py
from flask import request, jsonify
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Post, User
from schemas.post_schema import PostSchema
from marshmallow import ValidationError


class PostListAPI(MethodView):

    @jwt_required()
    def post(self):
        """Crear un nuevo post"""
        try:
            data = PostSchema().load(request.get_json())
        except ValidationError as err:
            return {"errors": err.messages}, 400

        user_id = int(get_jwt_identity())  # <-- CORRECCIÓN
        post = Post(
            title=data["title"],
            content=data["content"],
            user_id=user_id
        )
        db.session.add(post)
        db.session.commit()
        return PostSchema().dump(post), 201


    def get(self):
        """Obtener todos los posts"""
        posts = Post.query.all()
        return PostSchema(many=True).dump(posts), 200



class PostDetailAPI(MethodView):

    @jwt_required()
    def put(self, post_id):
        """Editar un post"""
        post = Post.query.get_or_404(post_id)
        user_id = int(get_jwt_identity())  
        if post.user_id != user_id:
            return {"msg": "No autorizado"}, 403

        try:
            data = PostSchema().load(request.get_json(), partial=True)
        except ValidationError as err:
            return {"errors": err.messages}, 400

        for key, value in data.items():
            setattr(post, key, value)

        db.session.commit()
        return {"message": "Post actualizado"}, 200


    @jwt_required()
    def delete(self, post_id):
        """Eliminar un post"""
        post = Post.query.get_or_404(post_id)
        user_id = int(get_jwt_identity())  
        user=User.query.get_or_404(user_id)
        role= user.role
        print(f'role {role}')
        print(f'user_id {user_id}')
        print(f'post.user_id  {post.user_id}')

        if role != "admin":
            if user_id != post.user_id:
                return {"msg": "No autorizado"}, 403
                
        db.session.delete(post)
        db.session.commit()
        return {"message": "Post eliminado"}, 200


    def get(self, post_id):
        """Obtener un post por ID"""
        post = Post.query.get_or_404(post_id)
        return PostSchema().dump(post), 200
