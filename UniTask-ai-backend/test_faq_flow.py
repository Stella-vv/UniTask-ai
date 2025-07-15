import requests
import time

BASE = "http://localhost:8008/api"

# 注册一个测试用户
email = f"faq_tester_{int(time.time())}@example.com"
print("📌 注册用户...")
res = requests.post(f"{BASE}/register", json={
    "email": email,
    "password": "test123",
    "role": "tutor",
    "school": "CSE",
    "year": 2025
})
user = res.json().get("user")
print("✅ 用户注册成功:", user)

# 创建课程
print("\n📌 创建课程...")
course_res = requests.post(f"{BASE}/courses/", json={
    "name": "FAQ测试课程",
    "description": "用于测试FAQ接口",
    "year": 2025,
    "semester": "T2"
})
course = course_res.json()
print("✅ 课程创建成功:", course)

# 创建 FAQ
print("\n📌 创建 FAQ...")
faq_res = requests.post(f"{BASE}/faqs/", json={
    "question": "When is the midterm exam?",
    "answer": "The midterm is scheduled for Week 6.",
    "uploaded_by": user["id"],          # ← 注意字段名
    "course_id": course["id"]
})
print("⚠️ 状态码:", faq_res.status_code)
print("⚠️ 响应文本:", faq_res.text)
faq_data = faq_res.json()
faq_id = faq_data["faq"]["id"]
print("✅ FAQ 创建成功:", faq_data)

# 获取某课程的所有 FAQ
print("\n📌 获取课程 FAQ 列表...")
faq_list_res = requests.get(f"{BASE}/faqs/course/{course['id']}")
print("📋 FAQ 列表:", faq_list_res.json())

# 更新 FAQ
print("\n✏️ 更新 FAQ...")
update_res = requests.put(f"{BASE}/faqs/{faq_id}", json={
    "question": "What week is the midterm?",
    "answer": "It will be held in Week 7 instead."
})
print("✅ FAQ 更新结果:", update_res.json())

# 删除 FAQ
print("\n🗑️ 删除 FAQ...")
del_res = requests.delete(f"{BASE}/faqs/{faq_id}")
print("✅ 删除结果:", del_res.json())
