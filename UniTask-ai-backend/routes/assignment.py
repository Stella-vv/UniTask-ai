from flask import Blueprint, request, jsonify
from models import db, Assignment, Forum
from datetime import datetime
from werkzeug.utils import secure_filename
import os

assignment_bp = Blueprint("assignment", __name__, url_prefix="/api/assignments")

# 上传目录（你可以按需修改）
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

# 确保上传目录存在
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# MODIFIED: This route now handles both GET (all) and POST requests
@assignment_bp.route("", methods=["GET", "POST"])
def handle_assignments():
    """Handles creating an assignment or fetching all assignments."""
    
    # Logic for creating a new assignment
    if request.method == "POST":
        print("📥 POST received (multipart/form-data)")
        
        name = request.form.get("name")
        description = request.form.get("description")
        due_date_str = request.form.get("due_date")
        user_id = request.form.get("user_id")
        course_id = request.form.get("course_id")

        rubric_file = request.files.get("rubric")
        attachment_file = request.files.get("attachment")

        rubric_path = None
        attachment_path = None

        if rubric_file and allowed_file(rubric_file.filename):
            filename = secure_filename(rubric_file.filename)
            rubric_path = os.path.join(UPLOAD_FOLDER, filename)
            rubric_file.save(rubric_path)

        if attachment_file and allowed_file(attachment_file.filename):
            filename = secure_filename(attachment_file.filename)
            attachment_path = os.path.join(UPLOAD_FOLDER, filename)
            attachment_file.save(attachment_path)

        if not name or not due_date_str or not user_id:
            return jsonify({"error": "Missing required fields"}), 400

        try:
            due_date = datetime.strptime(due_date_str, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD HH:MM:SS"}), 400

        try:
            new_assignment = Assignment(
                name=name,
                description=description,
                due_date=due_date,
                course_id=course_id,
                user_id=user_id,
                rubric=rubric_path,
                attachment=attachment_path
            )
            db.session.add(new_assignment)
            db.session.flush()

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

    if request.method == "GET":
        """获取所有作业的列表"""
        print("✅ GET received for all assignments")
        try:
            assignments = Assignment.query.all()
            return jsonify([a.to_dict() for a in assignments]), 200
        except Exception as e:
            print(f"❌ Error fetching all assignments: {e}")
            return jsonify({"error": "An internal server error occurred"}), 500

@assignment_bp.route("/<int:user_id>", methods=["GET"])
def get_assignments_by_user(user_id):
    """获取单个用户的所有作业"""
    assignments = Assignment.query.filter_by(user_id=user_id).all()
    return jsonify([a.to_dict() for a in assignments])

@assignment_bp.route("/detail/<int:assignment_id>", methods=["GET"])
def get_assignment_detail(assignment_id):
    """获取单个作业的详细信息"""
    try:
        assignment = Assignment.query.get(assignment_id)
        if not assignment:
            return jsonify({"error": "Assignment not found"}), 404
        
        return jsonify(assignment.to_dict())
    except Exception as e:
        print(f"❌ Error fetching assignment {assignment_id}: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500

@assignment_bp.route("/course/<int:course_id>", methods=["GET"])
def get_assignments_by_course(course_id):
    """获取单个课程的所有作业"""
    try:
        assignments = Assignment.query.filter_by(course_id=course_id).all()
        return jsonify([a.to_dict() for a in assignments])
    except Exception as e:
        print(f"❌ Error fetching assignments for course {course_id}: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500