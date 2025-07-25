from flask import Blueprint, request, jsonify
from faq_search import find_answer

mock_ai_bp = Blueprint("mock_ai", __name__, url_prefix="/api/mock-ai")

@mock_ai_bp.route("/ask", methods=["POST"])
def ask_mock_ai():
    data = request.get_json()
    query = data.get("query", "").strip()
    if not query:

        return jsonify({"answer": "Provide a question please"}), 400


    answer = find_answer(query)
    return jsonify({"answer": answer})
