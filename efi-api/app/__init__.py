from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

# Inicialización de extensiones
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configuración externa desde config.py (si existe)
    try:
        app.config.from_object('config.Config')
    except ImportError:
        app.config['SECRET_KEY'] = 'clave-secreta-segura'
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../instance/data.db'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        app.config['JWT_SECRET_KEY'] = 'clave-super-secreta'

    # Inicializar extensiones
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Crear tablas si no existen
    with app.app_context():
        from app import models
        db.create_all()

    # Importar y registrar blueprints
    from app.routes.posts import posts_bp
    from app.routes.reviews import reviews_bp
    from app.routes.usuarios import usuarios_bp

    app.register_blueprint(posts_bp, url_prefix='/api')
    app.register_blueprint(reviews_bp, url_prefix='/api')
    app.register_blueprint(usuarios_bp, url_prefix='/api')

    # Ruta base
    @app.route('/')
    def inicio():
        return jsonify({"mensaje": "API Flask para EFI funcionando correctamente"})

    return app





