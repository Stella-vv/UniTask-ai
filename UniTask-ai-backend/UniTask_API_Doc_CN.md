# UniTask AI Backend

## 项目简介
UniTask AI Backend 是一个面向 **学习与教学支持** 的后端服务，基于 **Flask + PostgreSQL + SQLAlchemy** 搭建，提供用户、课程、作业、FAQ、论坛、问答和 AI 模拟等模块的 API 接口。

本项目是 UNSW Teachwise AI 团队的课程项目，重点在于后端框架、数据库集成及核心功能，支持前端（React/Vue）对接，后续可扩展 AI 功能。

---

## 技术栈
- **后端框架**：Flask
- **数据库**：PostgreSQL
- **ORM**：SQLAlchemy
- **容器化**：Docker, docker-compose
- **测试工具**：Postman / curl
- **AI 支持**：Ollama / LM Studio（可选）

---

## 项目结构
```
UniTask-ai-backend/
├── config.py                 # 配置文件
├── create_tables.py          # 初始化数据库
├── docker-compose.yml        # Docker 服务配置
├── Dockerfile                # Docker 镜像定义
├── faq_search.py             # FAQ 搜索与匹配工具
├── integration_test_all.py   # 一体化测试脚本
├── main.py                   # 主程序入口
├── models.py                 # 数据库模型
├── requirements.txt          # Python 依赖
├── routes/                   # 各功能 API 路由
│   ├── auth.py               # 用户注册/登录
│   ├── course.py             # 课程接口
│   ├── assignment.py         # 作业接口
│   ├── forum.py              # 论坛接口
│   ├── question.py           # 学生提问
│   ├── reply.py              # 回复接口
│   ├── faqs.py               # FAQ 上传与查询
│   ├── qa.py                 # 问答逻辑
│   ├── mock_ai.py            # 模拟 AI（伪接口）
│   ├── real_ai.py            # 真实 AI 接口（待集成）
│   ├── mock_user.py          # 内存模拟用户
│   └── user.py               # 用户管理接口
├── data/                     # FAQ/测试数据
├── uploads/                  # 上传文件（FAQ/作业附件）
├── test.py / test1.py        # 单元测试
└── UniTask_API_Doc_EN/CN.md  # API 文档
```

---

## 环境配置

1. 克隆项目并进入目录：
```bash
git clone <repo-url>
cd UniTask-ai-backend
```

2. 创建虚拟环境并安装依赖：
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. 配置环境变量（可复制 `.env.example`）：
```bash
cp .env.example .env
# 设置 PostgreSQL 数据库连接
```

4. 初始化数据库：
```bash
export UNITASK_MOCK=false
python create_tables.py
```

5. 启动后端：
```bash
export UNITASK_MOCK=false
python main.py
```
默认运行在 `http://localhost:8008`。

---

## 核心接口

### 用户
- **注册**：`POST /api/register`
- **登录**：`POST /api/login`
- **用户管理**：`routes/user.py`

### 课程 & 作业
- 课程接口：`routes/course.py`
- 作业接口：`routes/assignment.py`
- 每个作业自动关联一个论坛（`routes/forum.py`）

### 问答 & FAQ
- 学生提问：`routes/question.py`
- 回复：`routes/reply.py`
- FAQ 上传/查询：`routes/faqs.py`
- FAQ 搜索：`faq_search.py`

### AI 模块
- 模拟 AI：`routes/mock_ai.py`（伪接口，硬编码或简单逻辑）
- 真实 AI：`routes/real_ai.py`（支持 Ollama/Mistral，开发中）

---

## 使用 Docker 部署
```bash
docker-compose up --build
```
构建并启动 Flask + PostgreSQL 环境。

---

## 后续开发
1. 集成 JWT 登录认证。
2. 完善 FAQ 上传、搜索及 AI 接口。
3. 为所有接口补全 Swagger 文档。
4. 加入自动化测试和 CI/CD。
5. 扩展多课程、多角色支持。
