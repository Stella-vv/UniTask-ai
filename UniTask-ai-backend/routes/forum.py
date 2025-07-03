# app/routes/forum.py

from flask import Blueprint, request, jsonify
from models import db, Forum, Question, Assignment
from flask_jwt_extended import jwt_required, get_jwt_identity

forum_bp = Blueprint("forum", __name__, url_prefix="/api/forum")

@forum_bp.route("/<int:assignment_id>", methods=["GET"])
@jwt_required()
def get_forum(assignment_id):
    forum = Forum.query.filter_by(assignment_id=assignment_id).first()
    if not forum:
        return jsonify({"error": "Forum not found"}), 400
    return jsonify({
        "id": forum.id,
        "title": forum.title,
        "created_at": forum.created_at.isoformat()
    })

@forum_bp.route("/<int:forum_id>/questions", methods=["POST"])
@jwt_required()
def create_question(forum_id):
    data = request.get_json()
    content = data.get("content")
    user_id = get_jwt_identity()

    forum = Forum.query.get(forum_id)
    if not forum:
        return jsonify({"error": "Forum not found"}), 400

    question = Question(content=content, user_id=user_id, forum_id=forum_id)
    db.session.add(question)
    db.session.commit()

    return jsonify({"message": "Question posted successfully"}), 201