from flask import Blueprint, request, jsonify
import subprocess
from models import Assignment, FAQ

real_ai_bp = Blueprint("real_ai", __name__, url_prefix="/api/ai")
def build_prompt_with_context(question, assignment_id):
    assignment = Assignment.query.get(assignment_id)
    if not assignment:
        return "Assignment not found."

    # 1. Rubric + attachment（这里只放路径名，如果想提取 PDF 内容，后续扩展）
    context = f"Assignment Files:\nRubric: {assignment.rubric}\nAttachment: {assignment.attachment}\n\n"

    # 2. FAQs
    faqs = FAQ.query.filter_by(assignment_id=assignment_id).all()
    if faqs:
        context += "Frequently Asked Questions:\n"
        for f in faqs:
            context += f"Q: {f.question}\nA: {f.answer}\n"
    else:
        context += "No FAQs found.\n"

    # 3. 用户问题
    context += f"\nNow answer the following question:\nQ: {question}\nA:"

    return context

# def ask_faq_model(question):
#     """Directly invoke Ollama's faq-mistral model to answer the questions"""
#     result = subprocess.run(
#         ["ollama", "run", "faq-mistral"],
#         input=question.encode(),
#         capture_output=True
#     )
#     return result.stdout.decode()


@real_ai_bp.route("/ask", methods=["POST"])
def ask_real_ai():
    """主 AI 问答接口：构建上下文并调用模型"""
    data = request.get_json()
    query = data.get("query", "").strip()
    assignment_id = data.get("assignment_id")

    if not query or not assignment_id:
        return jsonify({"error": "Missing query or assignment_id"}), 400

    prompt = build_prompt_with_context(query, assignment_id)

    # 调用本地 Ollama 模型
    try:
        result = subprocess.run(
            ["ollama", "run", "faq-mistral"],
            input=prompt.encode(),
            capture_output=True
        )
        answer = result.stdout.decode().strip()
    except Exception as e:
        return jsonify({"error": f"Failed to invoke model: {str(e)}"}), 500

    return jsonify({
        "answer": answer,
        "prompt": prompt  # ✅ 可选：调试用，前端看到完整上下文
    })
