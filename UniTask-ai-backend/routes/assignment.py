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
    
@assignment_bp.route("/<int:user_id>", methods=["GET"])
def get_assignments(user_id):
    # 将 user_id 更改为 uploaded_by
    assignments = Assignment.query.filter_by(user_id=user_id).all()
    return jsonify([a.to_dict() for a in assignments])


@assignment_bp.route("/course/<int:course_id>", methods=["GET"])
def get_assignments_by_course(course_id):
    """
    根据课程 ID 获取该课程下的所有作业
    """
    try:
        # 在数据库中查询 course_id 匹配的所有作业记录
        assignments = Assignment.query.filter_by(course_id=course_id).all()
        
        # 将查询到的作业对象列表转换为字典列表，并返回 JSON 响应
        return jsonify([a.to_dict() for a in assignments])

    except Exception as e:
        # 如果发生错误，打印错误信息并返回一个服务器错误响应
        print(f"❌ Error fetching assignments for course {course_id}: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500