import os
from flask import Flask
from flask_cors import CORS

# ===== 可配置开关：mock or real =====
USE_MOCK = os.getenv("UNITASK_MOCK", "false").lower() == "true"
# export UNITASK_MOCK=true  即可启动纯内存 Mock 模式

app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=False,   # 以后带 cookie 再调 True
)

# -------------------------------------------------
# 1) 真实数据库模式
# -------------------------------------------------
if not USE_MOCK:
    from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
    from models import db
    from routes.user import user_bp   # 真正操作 DB 的蓝图

    app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = SQLALCHEMY_TRACK_MODIFICATIONS

    db.init_app(app)
    app.register_blueprint(user_bp)
    print("🔗 Running with REAL PostgreSQL backend")

# -------------------------------------------------
# 2) Mock 内存模式
# -------------------------------------------------
else:
    from routes.mock_user import mock_bp   # 刚才写的 Mock 蓝图
    app.register_blueprint(mock_bp)
    print("🧪 Running in MOCK mode – no DB required")

# -------------------------------------------------
@app.route("/")
def index():
    return (
        "UniTask backend connected to PostgreSQL!"
        if not USE_MOCK
        else "UniTask MOCK backend is up!"
    )

if __name__ == "__main__":
    app.run(debug=True,port=8000)