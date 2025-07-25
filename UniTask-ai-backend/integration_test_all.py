import requests
import time

BASE = "http://localhost:8008/api"

# ====== 1. Register a test user ======
timestamp = int(time.time())
email = f"test_user_{timestamp}@example.com"
print("📌 Registering test user...")
res = requests.post(f"{BASE}/register", json={
    "email": email,
    "password": "test123",
    "role": "tutor",
    "school": "CSE",
    "year": 2025
})
user = res.json().get("user")
print("✅ User registered:", user)

# ====== 2. Create a course ======
print("\n📌 Creating course...")
course_res = requests.post(f"{BASE}/courses/", json={
    "name": "Web Front-End Programming",
    "description": (
        "This is a first course in wireless and mobile networking examining the fundamental theories as well as "
        "the latest advances in wireless data and mobile communication networks. Topics include fundamental concepts "
        "in wireless coding, modulation, and signal propagation, WiFi and wireless local area networks, cellular networks, "
        "Bluetooth, and Internet of Things networks. The course will also overview some of the emerging wireless networking "
        "concepts, such as wireless sensing, and drone-assisted mobile networks. Hands-on experiments with mobile devices "
        "will be part of the learning exercise, which involves wireless packet capture, analysis, and programming."
    ),
    "year": 2025,
    "semester": "T2"
})
course = course_res.json()
print("✅ Course created:", course)

# ====== 3. Create a FAQ ======
print("\n📌 Creating FAQ...")
faq_res = requests.post(f"{BASE}/faqs/", json={
    "question": "When is the midterm exam?",
    "answer": "The midterm is scheduled for Week 6.",
    "uploaded_by": user["id"],
    "course_id": course["id"]
})
faq_data = faq_res.json()
faq_id = faq_data["faq"]["id"]
print("✅ FAQ created:", faq_data)

# ====== 4. Retrieve course FAQs ======
print("\n📌 Retrieving course FAQs...")
faq_list_res = requests.get(f"{BASE}/faqs/course/{course['id']}")
print("📋 FAQ List:", faq_list_res.json())

# ====== 5. Update FAQ ======
print("\n✏️ Updating FAQ...")
update_res = requests.put(f"{BASE}/faqs/{faq_id}", json={
    "question": "What week is the midterm?",
    "answer": "It will be held in Week 7 instead."
})
print("✅ FAQ updated:", update_res.json())

# ====== 6. Delete FAQ ======
print("\n🗑️ Deleting FAQ...")
del_res = requests.delete(f"{BASE}/faqs/{faq_id}")
print("✅ FAQ deleted:", del_res.json())

# ====== 7. Create assignment (also creates forum) ======
print("\n📌 Creating assignment (and forum)...")
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

print("📥 Assignment creation status:", assignment_res.status_code)
assignment_data = assignment_res.json()
print("✅ Assignment created:", assignment_data)

assignment_id = assignment_data["assignment"]["id"]
forum_id = assignment_data["forum"]["id"]
print(f"✅ Forum automatically created with ID: {forum_id} for assignment ID: {assignment_id}")

# ====== 8. Add a question to the forum ======
print("\n📌 Posting question to forum...")
question_res = requests.post(f"{BASE}/forum/{forum_id}/questions", json={
    "content": "Can the deadline for this assignment be extended?",
    "user_id": user["id"]
})
if question_res.status_code == 201:
    print("✅ Question posted to forum.")
else:
    print("❌ Failed to post question:", question_res.status_code, question_res.text)

# ====== 9. Upload Q&A file ======
print("\n📌 Uploading Q&A file...")
with open("uploads/dummy_qas.csv", "rb") as file:
    upload_res = requests.post(f"{BASE}/qa/upload", files={
        "file": file
    }, data={
        "course_id": course["id"],
        "user_id": user["id"],
        "description": "Test uploading CSV Q&A data"
    })

print("📎 Upload status:", upload_res.status_code)
if upload_res.status_code == 201:
    print("✅ Q&A file uploaded successfully.")
else:
    print("❌ Failed to upload Q&A file:", upload_res.text)
