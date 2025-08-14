# scripts/create_tables.py

from main import app, db

if __name__ == "__main__":
    with app.app_context():
        db.drop_all()
        print("Creating database tables")
        db.create_all()
        print("Tables created successfully")
        print("Database URI:", app.config["SQLALCHEMY_DATABASE_URI"])