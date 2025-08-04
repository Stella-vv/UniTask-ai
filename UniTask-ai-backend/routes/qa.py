from flask import Blueprint, request, jsonify
from models import db, QAUpload
from werkzeug.utils import secure_filename
import os

qa_bp = Blueprint("qa", __name__, url_prefix="/api/qa")

# upload Q&A file
@qa_bp.route("/upload", methods=["POST"])
def upload_qa_file():
    file = request.files.get("file")
    assignment_id = request.form.get("assignment_id")
    user_id = request.form.get("user_id")
    description = request.form.get("description", "")

    if not file or not assignment_id or not user_id:
        return jsonify({"error": "Missing required fields"}), 400

    filename = secure_filename(file.filename)
    ext = filename.split(".")[-1].lower()
    upload_dir = "uploads/qas"
    os.makedirs(upload_dir, exist_ok=True)
    filepath = os.path.join(upload_dir, filename)
    file.save(filepath)

    upload_record = QAUpload(
        assignment_id=assignment_id,
        uploaded_by=user_id,
        filename=filename,
        filepath=filepath,
        filetype=ext,
        description=description
    )

    db.session.add(upload_record)
    db.session.commit()

    return jsonify({"message": "Q&A uploaded", "upload_id": upload_record.id}), 201

# Obtain all uploaded records of a certain assignment
@qa_bp.route("/assignment/<int:assignment_id>/uploads", methods=["GET"])
def get_uploaded_qas(assignment_id):
    uploads = QAUpload.query.filter_by(assignment_id=assignment_id).all()
    result = []
    for u in uploads:
        result.append({
            "id": u.id,
            "filename": u.filename,
            "filetype": u.filetype,
            "description": u.description,
            "filepath": u.filepath,
            "uploaded_by": u.uploaded_by,
            "created_at": u.created_at.isoformat() if u.created_at else None
        })
    return jsonify(result), 200
