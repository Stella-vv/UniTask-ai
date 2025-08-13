import os
from flask import Flask
from flask_cors import CORS
from flask import send_from_directory

USE_MOCK = os.getenv("UNITASK_MOCK", "false").lower() == "true"

# ===== initial Flask  =====
app = Flask(__name__)
app.config["DEBUG"] = True
CORS(
    app,
    resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=False,
)

# ===== Real database schema =====
if not USE_MOCK:
    from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
    from models import db
    from routes.user import user_bp  
    from routes.assignment import assignment_bp  
    from routes.forum import forum_bp
    from routes.course import course_bp
    from routes.reply import reply_bp  
    from routes.faqs import faq_bp
    from routes.qa import qa_bp
    from routes.mock_ai import mock_ai_bp
    from routes.real_ai import real_ai_bp
    
    app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = SQLALCHEMY_TRACK_MODIFICATIONS

    db.init_app(app)

    app.register_blueprint(user_bp)
    app.register_blueprint(assignment_bp)
    app.register_blueprint(forum_bp)
    app.register_blueprint(course_bp) 
    app.register_blueprint(reply_bp)
    app.register_blueprint(faq_bp)
    app.register_blueprint(qa_bp)
    app.register_blueprint(mock_ai_bp)
    app.register_blueprint(real_ai_bp)

    app.app_context().push()

    print("🔗 Running with REAL PostgreSQL backend")

# ===== Mock Memory Mode (for Development and Testing) =====
else:
    from routes.mock_user import mock_bp
    app.register_blueprint(mock_bp)
    print("🧪 Running in MOCK mode – no DB required")

@app.route("/")

def index():
    return (
        "UniTask backend connected to PostgreSQL!"
        if not USE_MOCK
        else "UniTask MOCK backend is up!"
    )

@app.route("/api/uploads/qas/<path:filename>")
def serve_qas_file(filename):
    return send_from_directory("uploads/qas", filename)


__all__ = ["app"]
if not USE_MOCK:
    __all__.append("db")
@app.route("/uploads/<filename>")
def serve_uploaded_file(filename):
    return send_from_directory("uploads", filename)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8008)