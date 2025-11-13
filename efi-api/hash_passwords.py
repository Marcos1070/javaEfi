from app import create_app
from app.models import db, Usuario
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    usuarios = Usuario.query.all()
    for u in usuarios:
        # solo hashear si no tiene hash y la contraseña no está vacía
        if u.password and not u.password.startswith("pbkdf2:"):
            u.password = generate_password_hash(u.password)
    db.session.commit()

print("✅ Contraseñas actualizadas correctamente")
