from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Post, Usuario

posts_bp = Blueprint('posts', __name__)

# --- Listar posts ---
@posts_bp.route('/posts', methods=['GET'])
def get_posts():
    posts = Post.query.all()
    return jsonify([{
        "id": p.id,
        "titulo": p.titulo,
        "contenido": p.contenido,
        "autor": p.autor,
        "createdAt": p.created_at.isoformat()
    } for p in posts])

# --- Obtener un post ---
@posts_bp.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    p = Post.query.get(post_id)
    if not p:
        return jsonify({"error": "Post no encontrado"}), 404
    return jsonify({
        "id": p.id,
        "titulo": p.titulo,
        "contenido": p.contenido,
        "autor": p.autor,
        "createdAt": p.created_at.isoformat()
    })

# --- Crear post ---
@posts_bp.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    data = request.get_json()
    required = ['titulo', 'contenido']
    if not all(k in data for k in required):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    email_token = get_jwt_identity()
    user = Usuario.query.filter_by(email=email_token).first()
    autor = user.nombre if user else "Desconocido"

    post = Post(titulo=data['titulo'], contenido=data['contenido'], autor=autor)
    db.session.add(post)
    db.session.commit()

    return jsonify({
        "id": post.id,
        "titulo": post.titulo,
        "contenido": post.contenido,
        "autor": post.autor,
        "createdAt": post.created_at.isoformat()
    }), 201

# --- Editar post ---
@posts_bp.route('/posts/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    p = Post.query.get(post_id)
    if not p:
        return jsonify({"error": "Post no encontrado"}), 404

    email_token = get_jwt_identity()
    user = Usuario.query.filter_by(email=email_token).first()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if user.rol != 'admin' and p.autor != user.nombre:
        return jsonify({"error": "No tiene permiso para editar"}), 403

    data = request.get_json()
    if 'titulo' in data:
        p.titulo = data['titulo']
    if 'contenido' in data:
        p.contenido = data['contenido']

    db.session.commit()
    return jsonify({
        "id": p.id,
        "titulo": p.titulo,
        "contenido": p.contenido,
        "autor": p.autor,
        "createdAt": p.created_at.isoformat()
    })

# --- Eliminar post ---
@posts_bp.route('/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    p = Post.query.get(post_id)
    if not p:
        return jsonify({"error": "Post no encontrado"}), 404

    email_token = get_jwt_identity()
    user = Usuario.query.filter_by(email=email_token).first()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if user.rol != 'admin' and p.autor != user.nombre:
        return jsonify({"error": "No tiene permiso para eliminar"}), 403

    db.session.delete(p)
    db.session.commit()
    return jsonify({"message": "Post eliminado"})
