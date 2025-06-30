# UniTask 后端接口说明文档（中文）

本说明文档总结了 UniTask 系统当前已实现的后端功能与接口。

---

## 后端启动

### 1️⃣ 先创建数据库

```bash
export UNITASK_MOCK=false
python create_tables.py
```
### 2️⃣ 再启动后端

```bash
export UNITASK_MOCK=false
python main.py
```

## ✅ 已实现功能

- 用户注册（`/api/register`）
- 用户登录（`/api/login`）
- 连接 PostgreSQL 数据库
- 连接前后端
- 使用 SQLAlchemy ORM 管理以下数据表：
  - users 用户表
  - courses 课程表
  - questions 提问表
  - messages 消息表
  - faqs 常见问题表

---

## 🔐 用户注册接口

- **地址**：`/api/register`
- **方法**：POST
- **请求 JSON**：

```json
{
  "email": "example@unsw.edu.au",
  "password": "abc123",
  "role": "tutor"
}
```

- **响应**：
  - 成功：201 Created
  - 缺字段：400
  - 邮箱重复：409

---

## 🔑 用户登录接口

- **地址**：`/api/login`
- **方法**：POST
- **请求 JSON**：

```json
{
  "email": "example@unsw.edu.au",
  "password": "abc123"
}
```

- **响应**：
  - 成功：200 OK，返回用户信息
  - 缺字段：400
  - 登录失败：401

---

## 🛠 技术栈

- Flask（后端框架）
- SQLAlchemy（ORM）
- PostgreSQL（数据库）
- Postman / curl（测试工具）

---

## 📁 项目结构

```
unitask-backend/
├── app.py
├── config.py
├── models.py
├── routes/
│   └── user.py
```

---

## 🚀 后续开发建议

- 接入 JWT 登录验证
- 实现 FAQ 上传与列表接口
- 实现作业与对话模块