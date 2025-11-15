# views/auth_views.py
from flask import request
from flask.views import MethodView
from extensions import db
from models.user import User
from models.user_credentials import UserCredentials
from passlib.hash import bcrypt
from flask_jwt_extended import create_access_token
from schemas.user_schema import RegisterSchema, LoginSchema
from marshmallow import ValidationError

class RegisterAPI(MethodView):
    def post(self):
        try:
            data = RegisterSchema().load(request.get_json())
        except ValidationError as err:
            return {"errors": err.messages}, 400

        # Verificar si el email o username ya existen
        if User.query.filter((User.email==data["email"]) | (User.username==data["username"])).first():
            return {"msg": "Usuario o email ya existe"}, 400

        # Crear usuario
        user = User(username=data["username"], email=data["email"], role=data["role"])
        db.session.add(user)
        db.session.commit()

        # Guardar password hasheada
        cred = UserCredentials(
            user_id=user.id,
            password_hash=bcrypt.hash(data["password"]),
            role=data['role']
        )
        db.session.add(cred)
        db.session.commit()

        return {"message": "Usuario creado", "user_id": user.id}, 201


class LoginAPI(MethodView):
    def post(self):
        try:
            data = LoginSchema().load(request.get_json())
        except ValidationError as err:
            return {"errors": err.messages}, 400

        user = User.query.filter_by(email=data["email"]).first()
        if not user or not user.is_active:
            return {"msg": "Usuario o contraseña incorrecta"}, 401

        cred = UserCredentials.query.filter_by(user_id=user.id).first()
        if not cred or not bcrypt.verify(data["password"], cred.password_hash):
            return {"msg": "Usuario o contraseña incorrecta"}, 401

        token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
        return {"access_token": token}, 200
