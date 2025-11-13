from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Review, Post, Usuario

reviews_bp = Blueprint('reviews', __name__)

# --- Listar reviews ---
@reviews_bp.route('/reviews', methods=['GET'])
def get_reviews():
    reviews = Review.query.all()
    return jsonify([{
        "id": r.id,
        "postId": r.post_id,
        "autor": r.autor,
        "comentario": r.comentario,
        "createdAt": r.created_at.isoformat()
    } for r in reviews])

# --- Crear review ---
@reviews_bp.route('/reviews', methods=['POST'])
@jwt_required()
def create_review():
    data = request.get_json()
    required = ['postId', 'comentario']
    if not all(k in data for k in required):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    post = Post.query.get(data['postId'])
    if not post:
        return jsonify({"error": "El postId no existe"}), 400

    email_token = get_jwt_identity()
    user = Usuario.query.filter_by(email=email_token).first()
    autor = user.nombre if user else "Desconocido"

    review = Review(post_id=data['postId'], autor=autor, comentario=data['comentario'])
    db.session.add(review)
    db.session.commit()

    return jsonify({
        "id": review.id,
        "postId": review.post_id,
        "autor": review.autor,
        "comentario": review.comentario,
        "createdAt": review.created_at.isoformat()
    }), 201

# --- Editar review ---
@reviews_bp.route('/reviews/<int:review_id>', methods=['PUT'])
@jwt_required()
def update_review(review_id):
    review = Review.query.get(review_id)
    if not review:
        return jsonify({"error": "Review no encontrada"}), 404

    email_token = get_jwt_identity()
    user = Usuario.query.filter_by(email=email_token).first()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if user.rol != 'admin' and review.autor != user.nombre:
        return jsonify({"error": "No tiene permiso para editar"}), 403

    data = request.get_json()
    if 'comentario' in data:
        review.comentario = data['comentario']

    db.session.commit()
    return jsonify({
        "id": review.id,
        "postId": review.post_id,
        "autor": review.autor,
        "comentario": review.comentario,
        "createdAt": review.created_at.isoformat()
    })

# --- Eliminar review ---
@reviews_bp.route('/reviews/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    review = Review.query.get(review_id)
    if not review:
        return jsonify({"error": "Review no encontrada"}), 404

    email_token = get_jwt_identity()
    user = Usuario.query.filter_by(email=email_token).first()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if user.rol != 'admin' and review.autor != user.nombre:
        return jsonify({"error": "No tiene permiso para eliminar"}), 403

    db.session.delete(review)
    db.session.commit()
    return jsonify({"message": "Review eliminada"})

