import requests
import time
import os

BASE = "http://localhost:8008/api"

def fail(message, res):
    print(f"❌ {message}: {res.status_code} {res.text}")
    exit(1)

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
if res.status_code != 201:
    fail("Failed to register user", res)
user = res.json()["user"]
print("✅ User registered:", user)

# ====== 2. Create a course ======
print("\n📌 Creating course...")
res = requests.post(f"{BASE}/courses/", json={
    "name": "Web Front-End Programming",
    "description": (
        "Web Front-End Programming introduces the fundamental concepts, tools, and practices for developing "
        "interactive and responsive web applications. The course covers the core web technologies—HTML for "
        "content structure, CSS for styling and layout, and JavaScript for dynamic behavior. Students learn "
        "to apply modern development techniques such as responsive design, DOM manipulation, event handling, "
        "and asynchronous communication (AJAX / Fetch API). The course also explores best practices for "
        "accessibility, performance optimization, and maintainable code structure. Through hands-on projects, "
        "learners gain practical experience in building user-friendly, cross-browser-compatible web interfaces, "
        "preparing them for further study or professional work in web development."
    ),
    "year": 2025,
    "semester": "T2"
})
if res.status_code != 201:
    fail("Failed to create course", res)
course = res.json()
print("✅ Course created:", course)

# ====== 3. Create assignment (and forum) ======
print("\n📌 Creating assignment and forum...")
rubric_path = "uploads/dummy_rubric.pdf"
attach_path = "uploads/dummy_attach.zip"
if not os.path.exists(rubric_path) or not os.path.exists(attach_path):
    print("❌ Required files not found in uploads/. Please check your test files.")
    exit(1)

with open(rubric_path, "rb") as rubric_file, open(attach_path, "rb") as attachment_file:
    res = requests.post(f"{BASE}/assignments", files={
        "rubric": rubric_file,
        "attachment": attachment_file
    }, data={
        "name": "Assignment 1",
        "description": (
            "In this assignment, you will design and implement a responsive personal portfolio website using HTML, CSS, "
            "and JavaScript without relying on external front-end frameworks. Your website should include a Home Page "
            "(introduction, profile image, navigation menu), an About Page (skills and experiences), a Projects Page "
            "(at least three project entries with images, descriptions, and links), and a Contact Page (functional form "
            "with client-side validation). The site must be fully responsive, use semantic HTML tags, include CSS animations "
            "or transitions, and implement JavaScript interactivity such as menu toggling and form validation. All assets "
            "must be optimized, and the code must pass basic HTML & CSS validation. Submission should include source code "
            "and a README.md with local viewing instructions. Marking: HTML semantics – 20%, CSS styling & responsiveness – "
            "30%, JavaScript functionality – 20%, Creativity & design – 15%, Code quality & documentation – 15%."
        ),
        "due_date": "2025-07-10 23:59:00",
        "course_id": course["id"],
        "user_id": user["id"]
    })

if res.status_code != 201:
    fail("Failed to create assignment", res)

assignment_data = res.json()
assignment_id = assignment_data["assignment"]["id"]
forum_id = assignment_data["forum"]["id"]
print(f"✅ Assignment and forum created (Assignment ID: {assignment_id}, Forum ID: {forum_id})")

# ====== 4. Create a FAQ ======
print("\n📌 Creating FAQ...")

print("📤 Sending FAQ creation payload:", {
    "question": "When is the midterm exam?",
    "answer": "The midterm is scheduled for Week 6.",
    "uploaded_by": user["id"],
    "assignment_id": assignment_id
})
print("🧪 Types → user_id:", type(user["id"]), "assignment_id:", type(assignment_id))

res = requests.post(f"{BASE}/faqs/", json={
    "question": "When is the midterm exam?",
    "answer": "The midterm is scheduled for Week 6.",
    "uploaded_by": user["id"],
    "assignment_id": assignment_id
})

if res.status_code != 201:
    fail("Failed to create FAQ", res)

faq = res.json()["faq"]
faq_id = faq["id"]
print("✅ FAQ created:", faq)

# ====== 5. Retrieve course FAQs ======
print("\n📌 Retrieving assignment FAQs...")
res = requests.get(f"{BASE}/faqs/assignment/{assignment_id}")
print("📋 FAQ List:", res.json())

# ====== 6. Update FAQ ======
print("\n✏️ Updating FAQ...")
res = requests.put(f"{BASE}/faqs/{faq_id}", json={
    "question": "What week is the midterm?",
    "answer": "It will be held in Week 7 instead."
})
if res.status_code != 200:
    fail("Failed to update FAQ", res)
print("✅ FAQ updated:", res.json())

# ====== 7. Delete FAQ ======
print("\n🗑️ Deleting FAQ...")
res = requests.delete(f"{BASE}/faqs/{faq_id}")
if res.status_code != 200:
    fail("Failed to delete FAQ", res)
print("✅ FAQ deleted:", res.json())

# ====== 8. Post question to forum ======
print("\n📌 Posting question to forum...")
res = requests.post(f"{BASE}/forum/{forum_id}/questions", json={
    "content": "Can the deadline for this assignment be extended?",
    "user_id": user["id"]
})
if res.status_code != 201:
    fail("Failed to post forum question", res)
print("✅ Question posted to forum.")

# ====== 9. Upload Q&A CSV ======
print("\n📌 Uploading Q&A file...")
qas_path = "uploads/dummy_qas.csv"
if not os.path.exists(qas_path):
    print("❌ Q&A file not found:", qas_path)
    exit(1)

with open(qas_path, "rb") as file:
    res = requests.post(f"{BASE}/qa/upload", files={
        "file": file
    }, data={
        "assignment_id": assignment_id,
        "user_id": user["id"],
        "description": "Test uploading CSV Q&A data"
    })

if res.status_code == 201:
    print("✅ Q&A file uploaded successfully.")
else:
    fail("Failed to upload Q&A file", res)