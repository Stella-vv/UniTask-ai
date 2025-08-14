from flask import Blueprint, request, jsonify
from models import db, FAQ
import traceback

faq_bp = Blueprint("faq", __name__, url_prefix="/api/faqs")

# Create FAQ
@faq_bp.route("/", methods=["POST"])
def create_faq():
    data = request.get_json(silent=True)
    print(" Received data for FAQ creation:", data)

    if not data:
        return jsonify({"error": "No JSON body received"}), 400

    question = data.get("question")
    answer = data.get("answer")
    uploaded_by = data.get("uploaded_by")
    assignment_id = data.get("assignment_id")

    # Validate all required fields are present
    if not all([question, answer, uploaded_by, assignment_id]):
        print(" Missing fields:", {
            "question": question,
            "answer": answer,
            "uploaded_by": uploaded_by,
            "assignment_id": assignment_id
        })
        return jsonify({"error": "Missing required fields"}), 400

    try:
        faq = FAQ(
            question=question,
            answer=answer,
            uploaded_by=int(uploaded_by),
            assignment_id=int(assignment_id)
        )
        db.session.add(faq)
        db.session.commit()

        return jsonify({
            "message": "FAQ created successfully",
            "faq": {
                "id": faq.id,
                "question": faq.question,
                "answer": faq.answer,
                "uploaded_by": faq.uploaded_by,
                "assignment_id": faq.assignment_id
            }
        }), 201

    except Exception as e:
        print("🔥 Exception during FAQ creation:")
        traceback.print_exc()
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500


# Get all FAQs for a given assignment
@faq_bp.route("/assignment/<int:assignment_id>", methods=["GET"])
def get_assignment_faqs(assignment_id):
    faqs = FAQ.query.filter_by(assignment_id=assignment_id).order_by(FAQ.id.desc()).all()
    return jsonify([
        {
            "id": f.id,
            "question": f.question,
            "answer": f.answer,
            "uploaded_by": f.uploaded_by
        } for f in faqs
    ]), 200

# Get a single FAQ by ID
@faq_bp.route("/<int:faq_id>", methods=["GET"])
def get_faq(faq_id):
    faq = FAQ.query.get(faq_id)
    if not faq:
        return jsonify({"error": "FAQ not found"}), 404

    return jsonify({
        "id": faq.id,
        "question": faq.question,
        "answer": faq.answer,
        "uploaded_by": faq.uploaded_by,
        "assignment_id": faq.assignment_id
    }), 200

# Delete FAQ
@faq_bp.route("/<int:faq_id>", methods=["DELETE"])
def delete_faq(faq_id):
    faq = FAQ.query.get(faq_id)
    if not faq:
        return jsonify({"error": "FAQ not found"}), 404

    db.session.delete(faq)
    db.session.commit()
    return jsonify({"message": "FAQ deleted"}), 200

# Update FAQ
@faq_bp.route("/<int:faq_id>", methods=["PUT"])
def update_faq(faq_id):
    faq = FAQ.query.get(faq_id)
    if not faq:
        return jsonify({"error": "FAQ not found"}), 404

    data = request.get_json(silent=True)
    print("✏️ Received data for FAQ update:", data)

    if not data:
        return jsonify({"error": "No JSON body received"}), 400

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

# Get all FAQs
@faq_bp.route("/", methods=["GET"])
def get_all_faqs():
    try:
        # Query the database for all FAQ entries
        faqs = FAQ.query.all()
        
        # Return the list of all FAQs as JSON
        return jsonify([
            {
                "id": f.id,
                "question": f.question,
                "answer": f.answer,
                "uploaded_by": f.uploaded_by,
                "assignment_id": f.assignment_id
            } for f in faqs
        ]), 200
    except Exception as e:
        print("🔥 Exception during fetching all FAQs:")
        traceback.print_exc()
        return jsonify({"error": f"Database error: {str(e)}"}), 500