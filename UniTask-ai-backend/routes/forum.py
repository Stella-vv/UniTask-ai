from flask import Blueprint, request, jsonify
from models import db, Forum, Question, Assignment, Reply
# from flask_jwt_extended import jwt_required, get_jwt_identity

forum_bp = Blueprint("forum", __name__, url_prefix="/api/forum")

# The forum for obtaining the specified assignment
@forum_bp.route("/<int:assignment_id>", methods=["GET"])
def get_forum(assignment_id):
    forum = Forum.query.filter_by(assignment_id=assignment_id).first()
    if not forum:
        return jsonify({"error": "Forum not found"}), 404

    return jsonify({
        "id": forum.id,
        "title": forum.title,
        "created_at": forum.created_at.isoformat()
    }), 200

# Post a question
@forum_bp.route("/<int:forum_id>/questions", methods=["POST"])
def create_question(forum_id):
    data = request.get_json()
    content = data.get("content")
    user_id = data.get("user_id")

    forum = Forum.query.get(forum_id)
    if not forum:
        return jsonify({"error": "Forum not found"}), 404

    question = Question(
        content=content,
        user_id=user_id,
        forum_id=forum.id,
        assignment_id=forum.assignment_id
    )

    db.session.add(question)
    db.session.commit()

    return jsonify({
        "message": "Question created successfully",
        "question": {
            "id": question.id,
            "content": question.content,
            "user_id": question.user_id,
            "created_at": question.created_at.isoformat()
        }
    }), 201

# Get all the questions and their responses in the forum
@forum_bp.route("/<int:forum_id>/questions", methods=["GET"])
def get_forum_questions(forum_id):
    forum = Forum.query.get(forum_id)
    if not forum:
        return jsonify({"error": "Forum not found"}), 404

    return jsonify([
        {
            "id": q.id,
            "content": q.content,
            "user_id": q.user_id,
            "created_at": q.created_at.isoformat(),
            "replies": [
                {
                    "id": r.id,
                    "content": r.content,
                    "user_id": r.user_id,
                    "created_at": r.created_at.isoformat()
                } for r in q.replies
            ]
        } for q in forum.questions
    ]), 200

# Reply to a certain question
@forum_bp.route("/questions/<int:question_id>/replies", methods=["POST"])
def create_reply(question_id):
    data = request.get_json()
    content = data.get("content")
    user_id = data.get("user_id")

    question = Question.query.get(question_id)
    if not question:
        return jsonify({"error": "Question not found"}), 404

    reply = Reply(content=content, user_id=user_id, question=question)
    db.session.add(reply)
    db.session.commit()

    return jsonify({
        "message": "Reply created successfully",
        "reply": {
            "id": reply.id,
            "content": reply.content,
            "user_id": reply.user_id,
            "created_at": reply.created_at.isoformat()
        }
    }), 201