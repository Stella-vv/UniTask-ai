# app.py

from flask import Flask
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from models import db

from routes.user import user_bp  # ✅ 导入蓝图对象



app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

db.init_app(app)
app.register_blueprint(user_bp)  # ✅ 注册蓝图

@app.route("/")
def index():
    return "UniTask backend connected to PostgreSQL!"

if __name__ == "__main__":
    app.run(debug=True)
