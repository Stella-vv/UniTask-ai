from flask import Blueprint, request, jsonify
from models import db, Course

course_bp = Blueprint("course", __name__, url_prefix="/api/courses")

@course_bp.route("/", methods=["POST"])
def create_course():
    data = request.get_json()

    name = data.get("name")
    description = data.get("description")
    year = data.get("year")
    semester = data.get("semester")

    if not name:
        return jsonify({"error": "Missing course name"}), 400

    new_course = Course(
        name=name,
        description=description,
        year=year,
        semester=semester
    )

    db.session.add(new_course)
    db.session.commit()

    return jsonify({
        "id": new_course.id,
        "name": new_course.name,
        "description": new_course.description,
        "year": new_course.year,
        "semester": new_course.semester
    }), 201

@course_bp.route("/", methods=["GET"])
def get_all_courses():
    courses = Course.query.all()
    return jsonify([
        {
            "id": course.id,
            "name": course.name,
            "description": course.description,
            "year": course.year,
            "semester": course.semester
        }
        for course in courses
    ]), 200
