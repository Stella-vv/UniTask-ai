from main import app, db
from sqlalchemy import text  # ✅ 必须引入 text

with app.app_context():
    try:
        db.session.execute(text("SELECT 1"))  # ✅ 使用 text() 包裹 SQL
        print("✅ 数据库连接成功！")
    except Exception as e:
        print("❌ 数据库连接失败：", e)
