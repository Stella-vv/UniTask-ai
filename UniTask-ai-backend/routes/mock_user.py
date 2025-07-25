# routes/mock_user.py
from flask import Blueprint, request, jsonify
import uuid

mock_bp = Blueprint("mock", __name__, url_prefix="/api")

USERS = []

@mock_bp.post("/register")
def mock_register():
    data = request.get_json()
    if not all(k in data for k in ("email", "password", "role")):
        return jsonify({"message": "Missing fields"}), 400

    if any(u["email"] == data["email"] for u in USERS):
        return jsonify({"message": "Email exists"}), 409

    user = {
        "id": str(uuid.uuid4()),
        "email": data["email"],
        "password": data["password"],  
        "role": data["role"]
    }
    USERS.append(user)
    return jsonify({"message": "User registered!", "user": user}), 201


@mock_bp.post("/login")
def mock_login():
    data = request.get_json()
    user = next((u for u in USERS if u["email"] == data.get("email")), None)
    if not user or user["password"] != data.get("password"):
        return jsonify({"message": "Invalid creds"}), 401

    return jsonify({
        "message": "Login OK",
        "token": "mock-token",
        "user": {k: user[k] for k in ("id", "email", "role")}
    }), 200