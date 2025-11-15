# test_db.py
from app import app
from extensions import db
from models import User, Post, Comment

with app.app_context():
    # Buscar usuario
    user = User.query.filter_by(email="marcos@mail.com").first()
    if not user:
        user = User(username="marcos", email="marcos@mail.com")
        db.session.add(user)
        db.session.commit()
        print(f"Usuario creado: {user.username}, {user.email}")
    else:
        print(f"Usuario ya existe: {user.username}, {user.email}")

    # Crear post
    post = Post(title="Primer post", content="Contenido del primer post", user_id=user.id)
    db.session.add(post)
    db.session.commit()
    print(f"Post creado: {post.id}, {post.title}, Autor ID: {post.user_id}")

    # Crear comentario
    comment = Comment(content="Primer comentario", user_id=user.id, post_id=post.id)
    db.session.add(comment)
    db.session.commit()
    print(f"Comentario creado: {comment.id}, {comment.content}, Post ID: {comment.post_id}, Autor ID: {comment.user_id}")

    # Listar posts con comentarios
    posts = Post.query.all()
    for p in posts:
        print(f"{p.id} - {p.title} (Autor: {p.user_id})")
        for c in p.comments:
            print(f"   - Comentario: {c.content} (Autor: {c.user_id})")
