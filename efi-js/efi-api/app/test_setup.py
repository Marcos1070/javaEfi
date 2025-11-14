# app/test_setup.py
from app import create_app, db, bcrypt
from app.models import Usuario

app = create_app()

with app.app_context():
    # ⚡ Borrar DB antigua si existe (opcional)
    import os
    db_path = os.path.join(app.instance_path, "data.db")
    if os.path.exists(db_path):
        os.remove(db_path)
        print("🗑️  Base de datos anterior eliminada")

    # Crear tablas según los modelos actuales
    db.create_all()
    print("📦 Tablas creadas correctamente")

    # Usuario de prueba
    email_test = "test@usuario.com"
    if not Usuario.query.filter_by(email=email_test).first():
        hashed_password = bcrypt.generate_password_hash("123456").decode('utf-8')
        u = Usuario(
            nombre="Usuario Test",
            email=email_test,
            password=hashed_password,
            rol="user"
        )
        db.session.add(u)
        db.session.commit()
        print("✅ Usuario registrado correctamente con bcrypt")
    else:
        print("El usuario ya existe en la DB")

    # Mostrar todos los usuarios
    usuarios = Usuario.query.all()
    print("\nUsuarios en la DB:")
    for u in usuarios:
        print(f"ID: {u.id}, Nombre: {u.nombre}, Email: {u.email}, Rol: {u.rol}")
