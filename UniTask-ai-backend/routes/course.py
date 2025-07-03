from flask import Blueprint, request, jsonify
from models import db, Course

course_bp = Blueprint("course", __name__, url_prefix="/api/courses")

@course_bp.route("/", methods=["POST"])
def create_course():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")

    if not name:
        return jsonify({"error": "Missing course name"}), 400

    new_course = Course(name=name, description=description)
    db.session.add(new_course)
    db.session.commit()

    return jsonify({"id": new_course.id, "name": new_course.name}), 201