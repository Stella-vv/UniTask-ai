import requests
import time

BASE = "http://localhost:8008/api"

# 1. 注册用户（tutor）
email = f"tutor_{int(time.time())}@example.com"
print("📌 注册用户...")
user_res = requests.post(f"{BASE}/register", json={
    "email": email,
    "password": "test123",
    "role": "tutor",
    "school": "CSE",
    "year": "2025"
})
user_data = user_res.json()
user = user_data.get("user")
print("✅ 用户注册成功:", user)

# 2. 创建课程
print("\n📌 创建课程...")
course_res = requests.post(f"{BASE}/courses/", json={
    "name": "COMP9900 - Capstone Project",
    "description": "Final year project",
    "year": 2025,
    "semester": "T2"
})
course = course_res.json()
print("✅ 创建课程成功:", course)

# 3. 创建作业 + 自动创建论坛（用 multipart/form-data）
print("\n📌 创建作业（同时创建论坛）...")

with open("uploads/dummy_rubric.pdf", "rb") as rubric_file, open("uploads/dummy_attach.zip", "rb") as attachment_file:
    assignment_res = requests.post(f"{BASE}/assignments", files={
        "rubric": rubric_file,
        "attachment": attachment_file
    }, data={
        "name": "Assignment 1",
        "description": "Please use Flask to implement backend functions",
        "due_date": "2025-07-10 23:59:00",
        "course_id": course["id"],
        "user_id": user["id"]
    })
print("📥 Status Code:", assignment_res.status_code)
print("📥 Response Headers:", assignment_res.headers)
print("📥 Response Text:", assignment_res.text)

try:
    assignment_data = assignment_res.json()
    print("✅ 作业创建成功:", assignment_data)
except Exception as e:
    print("❌ 无法解析 JSON 响应:", e)
    exit(1)
assignment_data = assignment_res.json()
print("✅ 作业创建成功:", assignment_data)


# 4. 获取 forum 信息
assignment_id = assignment_data["assignment"]["id"]
forum_id = assignment_data["forum"]["id"]

print(f"\n✅ 论坛已自动创建：forum_id = {forum_id}，对应 assignment_id = {assignment_id}")

# 5. 添加问题到论坛
print("\n📌 向论坛添加问题...")
question_res = requests.post(f"{BASE}/forum/{forum_id}/questions", json={
    "content": "Can the deadline for this assignment be extended?",
    "user_id": user["id"]   # ← 加上这个
})
if question_res.status_code == 201:
    print("✅ 问题添加成功")
else:
    print("❌ 添加失败:", question_res.status_code, question_res.text)
