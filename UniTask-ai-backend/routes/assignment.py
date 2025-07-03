from flask import Blueprint, request, jsonify
from models import db, Assignment
from datetime import datetime

assignment_bp = Blueprint("assignment", __name__, url_prefix="/api/assignments")

@assignment_bp.route("/", methods=["POST"])
@assignment_bp.route("/", methods=["POST"])
@assignment_bp.route("/", methods=["POST"])
def create_assignment():
    data = request.get_json()
    print("📥 POST received:", data)  # ✅ 打印收到的数据

    name = data.get("name")
    description = data.get("description")
    due_date_str = data.get("due_date")
    user_id = data.get("uploaded_by")
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

    try:
        print("📥 Adding assignment to DB:", new_assignment.to_dict())
        db.session.add(new_assignment)
        db.session.commit()
        print("✅ Committed to DB.")
    except Exception as e:
        db.session.rollback()
        print("❌ Commit failed:", e)
        return jsonify({"error": str(e)}), 500

    return jsonify(new_assignment.to_dict()), 201

@assignment_bp.route("/<int:user_id>", methods=["GET"])
def get_assignments(user_id):
    assignments = Assignment.query.filter_by(user_id=user_id).all()    
    return jsonify([a.to_dict() for a in assignments])