# 📦 UniTask 安装手册（Docker 方式）

本项目使用 Flask + PostgreSQL 实现后端服务，推荐使用 Docker 进行一键部署。

---

## 🧰 前置条件

请确保已在本地安装：

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## 📁 项目结构（关键部分）

```
unitask-backend/
├── app.py
├── main.py
├── create_tables.py
├── config.py
├── models.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── INSTALL.md
└── routes/
```

---

## 🚀 一键启动后端服务

### 1️⃣ 克隆项目

```bash
git clone https://github.com/unsw-cse-comp99-3900/capstone-project-25t2-9900-f18a-bread.git
cd unitask-backend
```

### 2️⃣ 准备环境变量文件

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

无需更改默认值即可运行。你也可以根据需要修改数据库连接字符串或 MOCK 模式。

---

### 3️⃣ 构建并启动项目

运行以下命令：

```bash
docker compose up
```

在新的终端运行
```bash
docker exec -it unitask-ai-backend-db-1 psql -U postgres
```
```bash
ALTER USER postgres WITH PASSWORD '0827';
```

回到之前的终端重新运行
```bash
docker compose down
docker compose up --build
```


首次构建可能需要几分钟，会自动：

- 拉取 PostgreSQL 镜像
- 构建 Flask 镜像
- 初始化数据库表（`create_tables.py`）
- 启动 Flask 应用

---

### 4️⃣ 启动前端
```bash
cd UniTask-ai-frontend
npm install
npm run dev
```

### 5️⃣ 访问后端 API

在浏览器或 Postman 中打开：

```
http://localhost:8008
```

你会看到：

```
UniTask backend connected to PostgreSQL!
```

---

## 🔐 环境变量说明（.env）

你需要在项目根目录创建 `.env` 文件，内容如下：

```env
UNITASK_MOCK=false
UNITASK_DOCKER=true
DATABASE_URL=postgresql://unitask:unitask123@db:5432/unitask_db
```

**注意：请勿上传 `.env` 文件，仅提供 `.env.example` 供参考。**

---

## 🧪 测试接口（示例）

使用 curl 或 Postman 测试：

### 注册接口（POST `/api/register`）

```json
{
  "email": "test@example.com",
  "password": "abc123",
  "role": "tutor"
}
```

### 登录接口（POST `/api/login`）

```json
{
  "email": "test@example.com",
  "password": "abc123"
}
```

---

## ❓常见问题

### ❗为什么访问不到 `http://localhost:8008`？

请检查：

- Docker 是否已启动成功
- `.env` 设置是否正确（MOCK 为 false）
- 是否使用了 VPN 占用端口

---

## 📎 附加说明

- 默认后端端口：`8008`，可在 `main.py` 修改
- PostgreSQL 端口：`5432`
- 所有 API 接口路径前缀：`/api/`

---

## ✅ 已实现功能

- 用户注册与登录
- PostgreSQL 数据库连接
- SQLAlchemy ORM 管理用户、课程、FAQ 等表
- MOCK 模式支持（`UNITASK_MOCK=true`）
- 蓝图路由结构清晰，便于扩展

---

感谢使用 UniTask 🎓，如有问题欢迎联系开发者！
