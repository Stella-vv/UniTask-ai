from flask import Blueprint, request, jsonify
from models import db, User

user_bp = Blueprint("user", __name__, url_prefix="/api")

@user_bp.post("/register")
def register():
    data = request.get_json()

    if not all(k in data for k in ("email", "password", "role")):
        return jsonify({"message": "Missing fields"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already exists"}), 409

    new_user = User(
        email=data["email"],
        password=data["password"],  
        role=data["role"],
        school = data.get("school"),  
        year = data.get("year")      

    )
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Database error", "error": str(e)}), 500

    return jsonify({
        "message": "User registered!",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "role": new_user.role,
            "school": new_user.school,
            "year": new_user.year
        }
    }), 201


@user_bp.post("/login")
def login():
    data = request.get_json()
    if not all(k in data for k in ("email", "password")):
        return jsonify({"message": "Missing fields"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user or user.password != data["password"]:
        return jsonify({"message": "Invalid email or password"}), 401

    token = f"token-{user.id}"  

    return jsonify({
        "message": "Login successful!",
        "token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "school": user.school,
            "year": user.year
        }
    }), 200
