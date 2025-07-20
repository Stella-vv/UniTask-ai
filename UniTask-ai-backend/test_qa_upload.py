import requests

BASE_URL = "http://localhost:8008/api"

# 1. 注册一个测试用户
print("📌 注册用户...")
user_res = requests.post(f"{BASE_URL}/register", json={
    "email": "qa_tester@example.com",
    "password": "test123",
    "role": "tutor",
    "school": "CSE",
    "year": "2025"
})
user = user_res.json().get("user")
print("✅ 用户注册成功:", user)

# 2. 创建一个课程
print("\n📌 创建课程...")
course_res = requests.post(f"{BASE_URL}/courses/", json={
    "name": "Q&A 测试课程",
    "description": "专门测试上传功能",
    "year": 2025,
    "semester": "T2"
})
course = course_res.json()
print("✅ 课程创建成功:", course)

# 3. 上传一个 Q&A 文件
print("\n📌 上传 Q&A 文件...")
with open("uploads/dummy_qas.csv", "rb") as file:
    upload_res = requests.post(f"{BASE_URL}/qa/upload", files={
        "file": file
    }, data={
        "course_id": course["id"],
        "user_id": user["id"],
        "description": "测试上传 CSV 文件"
    })

print("📎 状态码:", upload_res.status_code)
print("📎 响应内容:", upload_res.text)

if upload_res.status_code == 201:
    print("✅ 上传成功！")
else:
    print("❌ 上传失败！")
