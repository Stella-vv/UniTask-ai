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
    
    assessment = data.get("assessment")

    if not name:
        return jsonify({"error": "Missing course name"}), 400

    new_course = Course(
        name=name,
        description=description,
        year=year,
        semester=semester,
        assessment=assessment
    )

    db.session.add(new_course)
    db.session.commit()

    return jsonify(new_course.to_dict()), 201


@course_bp.route("/", methods=["GET"])
def get_all_courses():
    courses = Course.query.all()
    return jsonify([course.to_dict() for course in courses]), 200

@course_bp.route("/<int:course_id>", methods=["GET"])
def get_course(course_id):
    course = Course.query.get_or_404(course_id)
    return jsonify(course.to_dict()), 200

@course_bp.route("/<int:course_id>", methods=["PUT"])
def update_course(course_id):
    course = Course.query.get_or_404(course_id)
    data = request.get_json()

    course.name = data.get("name", course.name)
    course.description = data.get("description", course.description)
    course.year = data.get("year", course.year)
    course.semester = data.get("semester", course.semester)
    
    course.assessment = data.get("assessment", course.assessment)

    db.session.commit()

    return jsonify({
        "message": "Course updated successfully!",
        "course": course.to_dict()
    }), 200

@course_bp.route("/<int:course_id>", methods=["DELETE"])
def delete_course(course_id):
    course = Course.query.get_or_404(course_id)
    
    db.session.delete(course)
    db.session.commit()
    
    return jsonify({"message": f"Course with ID {course_id} has been deleted."}), 200