# routes/user.py

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User

user_bp = Blueprint("user", __name__, url_prefix="/api")

@user_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not all([email, password, role]):
        return jsonify({"message": "Missing fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 409

    hashed = generate_password_hash(password)
    new_user = User(email=email, hashed_password=hashed, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201


@user_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"message": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.hashed_password, password):
        return jsonify({"message": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful!",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }
    }), 200
