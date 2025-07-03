from flask import Blueprint, request, jsonify
from models import db, Assignment # 确保 models 模块中的 Assignment 模型是您提供的那个
from datetime import datetime

assignment_bp = Blueprint("assignment", __name__, url_prefix="/api/assignments")

@assignment_bp.route("/", methods=["POST"])
def create_assignment():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")
    due_date_str = data.get("due_date")
    user_id = data.get("user_id") # 这里用于接收前端传来的 user_id
    course_id = data.get("course_id")

    if not name or not due_date_str or not user_id:
        return jsonify({"error": "Missing required fields"}), 400

    due_date = datetime.strptime(due_date_str, "%Y-%m-%d %H:%M:%S")

    new_assignment = Assignment(
        name=name,
        description=description,
        due_date=due_date,
        user_id=user_id, # <--- 将 user_id 更改为 uploaded_by
        course_id=course_id
    )

    db.session.add(new_assignment)
    db.session.commit()

    return jsonify(new_assignment.to_dict()), 201

@assignment_bp.route("/<int:user_id>", methods=["GET"])
def get_assignments(user_id):
    # 将 user_id 更改为 uploaded_by
    assignments = Assignment.query.filter_by(user_id=user_id).all()
    return jsonify([a.to_dict() for a in assignments])