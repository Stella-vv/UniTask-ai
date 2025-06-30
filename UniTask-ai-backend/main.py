import os
from flask import Flask
from flask_cors import CORS

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

@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    return response

# ===== 真实数据库模式 =====
if not USE_MOCK:
    from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
    from models import db
    from routes.user import user_bp  # 注册蓝图（注册/登录接口）

    app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = SQLALCHEMY_TRACK_MODIFICATIONS

    db.init_app(app)
    app.register_blueprint(user_bp)

    # 提前 push context，方便 create_all 使用
    app.app_context().push()

    print("🔗 Running with REAL PostgreSQL backend")

# ===== Mock 内存模式（开发用） =====
else:
    from routes.mock_user import mock_bp
    app.register_blueprint(mock_bp)
    print("🧪 Running in MOCK mode – no DB required")

# ===== 测试根路由 =====
@app.route("/")
def index():
    return (
        "UniTask backend connected to PostgreSQL!"
        if not USE_MOCK
        else "UniTask MOCK backend is up!"
    )

# ===== 暴露对象供其他文件导入（如 create_all 脚本）=====
__all__ = ["app"]

if not USE_MOCK:
    __all__.append("db")

# ===== 启动应用 =====
if __name__ == "__main__":
    app.run(debug=True, port=8000)