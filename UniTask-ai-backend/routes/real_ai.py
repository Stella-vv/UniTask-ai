from flask import Blueprint, request, jsonify
import subprocess

real_ai_bp = Blueprint("real_ai", __name__, url_prefix="/api/ai")

def ask_faq_model(question):
    """Directly invoke Ollama's faq-mistral model to answer the questions"""
    result = subprocess.run(
        ["ollama", "run", "faq-mistral"],
        input=question.encode(),
        capture_output=True
    )
    return result.stdout.decode()

@real_ai_bp.route("/ask", methods=["POST"])
def ask_real_ai():
    data = request.get_json()
    query = data.get("query", "").strip()

    if not query:
        return jsonify({"answer": "Please provide a question"}), 400

    answer = ask_faq_model(query)
    return jsonify({"answer": answer})
