# routes/question.py
from flask import Blueprint, request, jsonify
from models import db, Question, Assignment, Forum, User

question_bp = Blueprint("question", __name__, url_prefix="/api/question")
@question_bp.route("/test", methods=["GET"])
def test_question_bp():
    return jsonify({"message": "Question blueprint is active"})

@question_bp.route("/submit", methods=["POST"])
def submit_question():
    data = request.get_json()
    content = data.get("content")
    user_id = data.get("user_id")
    assignment_id = data.get("assignment_id")

    if not all([content, user_id, assignment_id]):
        return jsonify({"message": "Missing required fields"}), 400

    assignment = Assignment.query.get(assignment_id)
    if not assignment or not assignment.forum:
        return jsonify({"message": "Assignment or forum not found"}), 404

    question = Question(
        content=content,
        user_id=user_id,
        assignment_id=assignment_id,
        forum_id=assignment.forum.id
    )
    db.session.add(question)
    db.session.commit()

    return jsonify({"message": "Question submitted", "question_id": question.id}), 201

@question_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user_questions(user_id):
    questions = Question.query.filter_by(user_id=user_id).all()

    return jsonify([
        {
            "id": q.id,
            "content": q.content,
            "assignment_id": q.assignment_id,
            "forum_id": q.forum_id
        } for q in questions
    ]), 200

@question_bp.route("/assignment/<int:assignment_id>", methods=["GET"])
def get_assignment_questions(assignment_id):
    questions = Question.query.filter_by(assignment_id=assignment_id).all()

    return jsonify([
        {
            "id": q.id,
            "content": q.content,
            "user_id": q.user_id,
            "forum_id": q.forum_id
        } for q in questions
    ]), 200
