from flask import Blueprint, request, jsonify
from models import db, Forum, Question, Assignment
# from flask_jwt_extended import jwt_required, get_jwt_identity

forum_bp = Blueprint("forum", __name__, url_prefix="/api/forum")

# 获取指定 assignment 的论坛
@forum_bp.route("/<int:assignment_id>", methods=["GET"])
# @jwt_required()
def get_forum(assignment_id):
    forum = Forum.query.filter_by(assignment_id=assignment_id).first()
    if not forum:
        return jsonify({"error": "Forum not found"}), 404

    return jsonify({
        "id": forum.id,
        "title": forum.title,
        "created_at": forum.created_at.isoformat()
    }), 200

# 发帖提问
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
        assignment_id=forum.assignment_id  # ✅ 关键补充
    )

    db.session.add(question)
    db.session.commit()

    return jsonify({"message": "Question created successfully"}), 201
# 获取论坛中所有问题
@forum_bp.route("/<int:forum_id>/questions", methods=["GET"])
def get_forum_questions(forum_id):
    forum = Forum.query.get(forum_id)
    if not forum:
        return jsonify({"error": "Forum not found"}), 404

    return jsonify([
        {
            "id": q.id,
            "content": q.content,
            "user_id": q.user_id
        } for q in forum.questions
    ]), 200
