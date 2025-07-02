# config.py

# ===== 数据库连接配置 =====
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "unitask"
DB_USER = "postgres"
DB_PASSWORD = "0827"

# SQLAlchemy 使用的数据库 URI
SQLALCHEMY_DATABASE_URI = (
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# 关闭修改追踪功能（节省性能）
SQLALCHEMY_TRACK_MODIFICATIONS = False
