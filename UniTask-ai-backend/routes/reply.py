# routes/reply.py

from flask import Blueprint, request, jsonify
from models import db, Reply, Question, User
from datetime import datetime

reply_bp = Blueprint("reply", __name__, url_prefix="/api")

# add reply
@reply_bp.route("/replies", methods=["POST"])
def create_reply():
    data = request.get_json()
    content = data.get("content")
    user_id = data.get("user_id")
    question_id = data.get("question_id")

    if not content or not user_id or not question_id:
        return jsonify({"error": "Missing required fields"}), 400

    # Check whether the question exists
    question = Question.query.get(question_id)
    if not question:
        return jsonify({"error": "Question not found"}), 404

    new_reply = Reply(
        content=content,
        user_id=user_id,
        question_id=question_id,
        created_at=datetime.utcnow()
    )

    db.session.add(new_reply)
    db.session.commit()

    return jsonify({
        "message": "Reply created successfully",
        "reply": {
            "id": new_reply.id,
            "content": new_reply.content,
            "user_id": new_reply.user_id,
            "question_id": new_reply.question_id,
            "created_at": new_reply.created_at.isoformat()
        }
    }), 201

# Get all the responses under a certain question
@reply_bp.route("/questions/<int:question_id>/replies", methods=["GET"])
def get_replies_for_question(question_id):
    question = Question.query.get(question_id)
    if not question:
        return jsonify({"error": "Question not found"}), 404

    replies = [
        {
            "id": r.id,
            "content": r.content,
            "user_id": r.user_id,
            "created_at": r.created_at.isoformat()
        }
        for r in question.replies
    ]

    return jsonify(replies), 200