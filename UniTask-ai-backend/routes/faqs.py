# routes/faqs.py

from flask import Blueprint, request, jsonify
from models import db, FAQ
from datetime import datetime

faq_bp = Blueprint("faq", __name__, url_prefix="/api/faq")

# 创建 FAQ
@faq_bp.route("/", methods=["POST"])
def create_faq():
    data = request.get_json()
    question = data.get("question")
    answer = data.get("answer")
    user_id = data.get("user_id")
    course_id = data.get("course_id")

    if not all([question, answer, user_id, course_id]):
        return jsonify({"error": "Missing required fields"}), 400

    faq = FAQ(
        question=question,
        answer=answer,
        user_id=user_id,
        course_id=course_id
    )

    db.session.add(faq)
    db.session.commit()

    return jsonify({
        "message": "FAQ created successfully",
        "faq": {
            "id": faq.id,
            "question": faq.question,
            "answer": faq.answer,
            "user_id": faq.user_id,
            "course_id": faq.course_id,
            # "created_at": faq.created_at.isoformat()
        }
    }), 201

# 获取某课程的 FAQ 列表
@faq_bp.route("/course/<int:course_id>", methods=["GET"])
def get_course_faqs(course_id):
    faqs = FAQ.query.filter_by(course_id=course_id).all()
    return jsonify([
        {
            "id": f.id,
            "question": f.question,
            "answer": f.answer,
            "user_id": f.user_id,
            # "created_at": f.created_at.isoformat()
        } for f in faqs
    ]), 200

# 删除 FAQ
@faq_bp.route("/<int:faq_id>", methods=["DELETE"])
def delete_faq(faq_id):
    faq = FAQ.query.get(faq_id)
    if not faq:
        return jsonify({"error": "FAQ not found"}), 404

    db.session.delete(faq)
    db.session.commit()
    return jsonify({"message": "FAQ deleted"}), 200

# 更新 FAQ
@faq_bp.route("/<int:faq_id>", methods=["PUT"])
def update_faq(faq_id):
    faq = FAQ.query.get(faq_id)
    if not faq:
        return jsonify({"error": "FAQ not found"}), 404

    data = request.get_json()
    faq.question = data.get("question", faq.question)
    faq.answer = data.get("answer", faq.answer)
    db.session.commit()

    return jsonify({
        "message": "FAQ updated",
        "faq": {
            "id": faq.id,
            "question": faq.question,
            "answer": faq.answer
        }
    }), 200
