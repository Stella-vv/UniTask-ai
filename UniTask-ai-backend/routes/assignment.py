from flask import Blueprint, request, jsonify
from models import db, Assignment, Forum
from datetime import datetime

assignment_bp = Blueprint("assignment", __name__, url_prefix="/api/assignments")

@assignment_bp.route("/", methods=["POST"])
def create_assignment():
    data = request.get_json()
    print("📥 POST received:", data)

    name = data.get("name")
    description = data.get("description")
    due_date_str = data.get("due_date")
    user_id = data.get("user_id")
    course_id = data.get("course_id")

    if not name or not due_date_str or not user_id:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        due_date = datetime.strptime(due_date_str, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD HH:MM:SS"}), 400

    try:
        # 创建 Assignment 对象
        new_assignment = Assignment(
            name=name,
            description=description,
            due_date=due_date,
            user_id=user_id,
            course_id=course_id
        )
        db.session.add(new_assignment)
        db.session.flush()  # ⚠️ 获取 assignment.id 不提交事务

        # 自动创建绑定的 Forum
        new_forum = Forum(
            assignment_id=new_assignment.id,
            title=f"{name} - Discussion Forum"
        )
        db.session.add(new_forum)

        db.session.commit()
        print("✅ Assignment and forum committed to DB.")

        return jsonify({
            "message": "Assignment and forum created successfully",
            "assignment": new_assignment.to_dict(),
            "forum": {
                "id": new_forum.id,
                "title": new_forum.title
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        print("❌ Commit failed:", e)
        return jsonify({"error": str(e)}), 500
