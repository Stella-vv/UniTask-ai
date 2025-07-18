from flask import Blueprint, request, jsonify
from faq_search import find_answer

ai_bp = Blueprint("ai", __name__, url_prefix="/api/ai")

@ai_bp.route("/ask", methods=["POST"])
def ask_ai():
    data = request.get_json()
    query = data.get("query", "").strip()

    if not query:
        return jsonify({"answer": "请提供一个问题"}), 400

    answer = find_answer(query)
    return jsonify({"answer": answer})
