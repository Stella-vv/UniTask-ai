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


@assignment_bp.route("/<int:assignment_id>", methods=["PUT"])
def update_assignment(assignment_id):
    """Handles updating an existing assignment."""
    
    print(f"📥 PUT received for assignment {assignment_id}")
    
    try:
        # Find the existing assignment in the database
        assignment = Assignment.query.get(assignment_id)
        if not assignment:
            return jsonify({"error": "Assignment not found"}), 404

        # Update text fields from form data
        assignment.name = request.form.get("name", assignment.name)
        assignment.description = request.form.get("description", assignment.description)
        
        due_date_str = request.form.get("due_date")
        if due_date_str:
            try:
                assignment.due_date = datetime.strptime(due_date_str, "%Y-%m-%d %H:%M:%S")
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD HH:MM:SS"}), 400

        # Handle rubric file update/deletion
        if request.form.get('delete_rubric') == 'true':
            # Optionally delete the old file from the server
            if assignment.rubric and os.path.exists(assignment.rubric):
                os.remove(assignment.rubric)
            assignment.rubric = None
        elif 'rubric' in request.files:
            rubric_file = request.files['rubric']
            if rubric_file and allowed_file(rubric_file.filename):
                # Optionally delete the old file before saving the new one
                if assignment.rubric and os.path.exists(assignment.rubric):
                    os.remove(assignment.rubric)
                filename = secure_filename(rubric_file.filename)
                rubric_path = os.path.join(UPLOAD_FOLDER, filename)
                rubric_file.save(rubric_path)
                assignment.rubric = rubric_path

        # Handle attachment file update/deletion
        if request.form.get('delete_attachment') == 'true':
            if assignment.attachment and os.path.exists(assignment.attachment):
                os.remove(assignment.attachment)
            assignment.attachment = None
        elif 'attachment' in request.files:
            attachment_file = request.files['attachment']
            if attachment_file and allowed_file(attachment_file.filename):
                if assignment.attachment and os.path.exists(assignment.attachment):
                    os.remove(assignment.attachment)
                filename = secure_filename(attachment_file.filename)
                attachment_path = os.path.join(UPLOAD_FOLDER, filename)
                attachment_file.save(attachment_path)
                assignment.attachment = attachment_path

        # Commit the changes to the database
        db.session.commit()
        print(f"✅ Assignment {assignment_id} updated successfully.")
        
        return jsonify({
            "message": "Assignment updated successfully",
            "assignment": assignment.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"❌ Failed to update assignment {assignment_id}: {e}")
        return jsonify({"error": str(e)}), 500
    
# Ensure this route exists in your assignment blueprint file

@assignment_bp.route("/<int:assignment_id>", methods=["DELETE"])
def delete_assignment(assignment_id):
    """Handles deleting an existing assignment."""
    
    print(f"🗑️ DELETE request received for assignment {assignment_id}")
    
    try:
        # Find the existing assignment
        assignment = Assignment.query.get(assignment_id)
        if not assignment:
            return jsonify({"error": "Assignment not found"}), 404

        # Find and delete the associated forum
        Forum.query.filter_by(assignment_id=assignment.id).delete()

        # Delete physical files from the server
        if assignment.rubric and os.path.exists(assignment.rubric):
            os.remove(assignment.rubric)
            print(f"File deleted: {assignment.rubric}")
            
        if assignment.attachment and os.path.exists(assignment.attachment):
            os.remove(assignment.attachment)
            print(f"File deleted: {assignment.attachment}")

        # Delete the assignment record itself
        db.session.delete(assignment)
        
        # Commit all changes to the database
        db.session.commit()
        
        print(f"✅ Assignment {assignment_id} and its forum were deleted successfully.")
        
        # Return a success response with no content
        return '', 204

    except Exception as e:
        db.session.rollback()
        print(f"❌ Failed to delete assignment {assignment_id}: {e}")
        return jsonify({"error": "Failed to delete assignment."}), 500