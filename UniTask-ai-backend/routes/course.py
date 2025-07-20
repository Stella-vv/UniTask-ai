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

@course_bp.route("/<int:course_id>", methods=["GET"])
def get_course(course_id):
    course = Course.query.get_or_404(course_id)
    return jsonify({
        "id": course.id,
        "name": course.name,
        "description": course.description,
        "year": course.year,
        "semester": course.semester
    }), 200

@course_bp.route("/<int:course_id>", methods=["PUT"])
def update_course(course_id):
    course = Course.query.get_or_404(course_id)
    data = request.get_json()

    course.name = data.get("name", course.name)
    course.description = data.get("description", course.description)
    course.year = data.get("year", course.year)
    course.semester = data.get("semester", course.semester)

    db.session.commit()

    return jsonify({
        "message": "Course updated successfully!",
        "course": {
            "id": course.id,
            "name": course.name,
            "description": course.description,
            "year": course.year,
            "semester": course.semester
        }
    }), 200

@course_bp.route("/<int:course_id>", methods=["DELETE"])
def delete_course(course_id):
    course = Course.query.get_or_404(course_id)
    
    db.session.delete(course)
    db.session.commit()
    
    return jsonify({"message": f"Course with ID {course_id} has been deleted."}), 200