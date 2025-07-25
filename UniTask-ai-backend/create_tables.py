# scripts/create_tables.py

from main import app, db

if __name__ == "__main__":
    with app.app_context():
        # ❗ Uncomment the next line to drop all existing tables before creating (use with caution)
        # db.drop_all()
        print("🚧 Creating database tables...")
        db.create_all()
        print("✅ Tables created successfully!")