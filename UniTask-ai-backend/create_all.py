# scripts/create_all.py

from main import app, db

if __name__ == "__main__":
    with app.app_context():
        print("🚧 正在重建数据库表结构...")
        db.drop_all()      # 删除所有表（开发调试用，可删去）
        db.create_all()    # 根据 models.py 自动建表
        print("✅ 所有表已成功创建！")
