# views/user_views.py
from flask import request, jsonify
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Post, User
from schemas.post_schema import PostSchema
from marshmallow import ValidationError
from schemas.user_schema import UserSchema

class UserAPI(MethodView):
    @jwt_required()
    def get(self, user_id):
        #Obtener usuario
        user = User.query.get_or_404(user_id)
        return UserSchema().dump(user), 200
        
