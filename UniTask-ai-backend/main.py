import os
from flask import Flask
from flask_cors import CORS
from flask import send_from_directory
# ===== 判断是否使用 Mock 模式 =====
USE_MOCK = os.getenv("UNITASK_MOCK", "false").lower() == "true"

# ===== 初始化 Flask 应用 =====
app = Flask(__name__)

# ===== 启用 CORS（支持前端跨域）=====
CORS(
    app,
    resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=False,
)

# ===== 真实数据库模式 =====
if not USE_MOCK:
    from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
    from models import db
    from routes.user import user_bp  # 注册蓝图：用户相关
    from routes.assignment import assignment_bp  # 注册蓝图：作业相关
    from routes.forum import forum_bp
    from routes.course import course_bp
    from routes.reply import reply_bp  # ← 添加这行


    # 配置数据库
    app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = SQLALCHEMY_TRACK_MODIFICATIONS

    # 初始化数据库
    db.init_app(app)

    # 注册蓝图
    app.register_blueprint(user_bp)
    app.register_blueprint(assignment_bp)
    app.register_blueprint(forum_bp)
    app.register_blueprint(course_bp) 
    app.register_blueprint(reply_bp)
    

    # 推送上下文，供外部建表脚本使用
    app.app_context().push()

    print("🔗 Running with REAL PostgreSQL backend")

# ===== Mock 内存模式（开发测试用） =====
else:
    from routes.mock_user import mock_bp
    app.register_blueprint(mock_bp)
    print("🧪 Running in MOCK mode – no DB required")

# ===== 根路由测试 =====
@app.route("/")

def index():
    return (
        "UniTask backend connected to PostgreSQL!"
        if not USE_MOCK
        else "UniTask MOCK backend is up!"
    )

# ===== 暴露对象供外部使用（如 create_all 脚本）=====
__all__ = ["app"]
if not USE_MOCK:
    __all__.append("db")
# ===== 提供上传文件访问 =====
@app.route("/uploads/<filename>")
def serve_uploaded_file(filename):
    return send_from_directory("uploads", filename)

# ===== 启动 Flask 应用 =====
if __name__ == "__main__":
    app.run(debug=True, port=8008)
