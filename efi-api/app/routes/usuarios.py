from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import db, Usuario
import jwt
from functools import wraps
from app.config import SECRET_KEY  # asegurate de tener SECRET_KEY definido

usuarios_bp = Blueprint("usuarios", __name__, url_prefix="/api")

# Decorador para verificar JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            parts = request.headers['Authorization'].split()
            if len(parts) == 2 and parts[0] == "Bearer":
                token = parts[1]

        if not token:
            return jsonify({"error": "Falta token"}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except Exception:
            return jsonify({"error": "Token inválido"}), 401

        return f(data, *args, **kwargs)

    return decorated

# Registro de usuario
@usuarios_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    
    # Validaciones básicas
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email y contraseña son requeridos"}), 400
    
    # Revisar si el usuario ya existe
    if Usuario.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Usuario ya registrado"}), 409

    # Crear usuario con contraseña hasheada y rol por defecto
    hashed_password = generate_password_hash(data["password"])
    nuevo_usuario = Usuario(
        nombre=data.get("nombre", ""), 
        email=data["email"],
        password=hashed_password,
        rol=data.get("rol", "usuario")  # rol por defecto
    )
    
    db.session.add(nuevo_usuario)
    db.session.commit()

    return jsonify({"message": "Usuario registrado correctamente"}), 201

# Login de usuario
@usuarios_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not isinstance(data, dict):  # prevenir errores si llega como string
        return jsonify({"error": "Formato JSON inválido"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email y contraseña son requeridos"}), 400

    user = Usuario.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Verificar contraseña
    if not check_password_hash(user.password, password):
        return jsonify({"error": "Contraseña incorrecta"}), 401

    # Generar token
    token = user.generate_jwt()

    return jsonify({"token": token, "user": {"email": user.email, "nombre": user.nombre}})

# Endpoint protegido de prueba
@usuarios_bp.route("/protected", methods=["GET"])
@token_required
def protected_route(current_user):
    return jsonify({"message": f"Hola {current_user['email']}, estás autenticado"})


