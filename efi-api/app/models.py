from app import db
from datetime import datetime
import jwt
from datetime import timedelta
from app.config import SECRET_KEY  # asegurate de tener SECRET_KEY definido

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    rol = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Método para generar JWT
    def generate_jwt(self, expires_in=3600):
        payload = {
            "user_id": self.id,
            "email": self.email,
            "exp": datetime.utcnow() + timedelta(seconds=expires_in)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        return token

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(150), nullable=False)
    contenido = db.Column(db.Text, nullable=False)
    autor = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    autor = db.Column(db.String(50), nullable=False)
    comentario = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
