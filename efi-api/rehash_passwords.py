from app import create_app
from app.models import db, Usuario
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    usuarios = Usuario.query.all()
    for u in usuarios:
        if not u.password.startswith("pbkdf2:"):
            u.password = generate_password_hash("123456")
    db.session.commit()

print("Contraseñas actualizadas a pbkdf2:sha256")
