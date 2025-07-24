import requests
import time

BASE = "http://localhost:8008/api"

# Register a test user
email = f"faq_tester_{int(time.time())}@example.com"
print("📌 Registering test user...")
res = requests.post(f"{BASE}/register", json={
    "email": email,
    "password": "test123",
    "role": "tutor",
    "school": "CSE",
    "year": 2025
})
user = res.json().get("user")
print("✅ User registered successfully:", user)

# Create a course
print("\n📌 Creating a course...")
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
print("✅ Course created successfully:", course)

# Create a FAQ
print("\n📌 Creating a FAQ...")
faq_res = requests.post(f"{BASE}/faqs/", json={
    "question": "When is the midterm exam?",
    "answer": "The midterm is scheduled for Week 6.",
    "uploaded_by": user["id"],
    "course_id": course["id"]
})
print("⚠️ Status code:", faq_res.status_code)
print("⚠️ Response body:", faq_res.text)
faq_data = faq_res.json()
faq_id = faq_data["faq"]["id"]
print("✅ FAQ created successfully:", faq_data)

# Get all FAQs for the course
print("\n📌 Retrieving course FAQs...")
faq_list_res = requests.get(f"{BASE}/faqs/course/{course['id']}")
print("📋 FAQ List:", faq_list_res.json())

# Update the FAQ
print("\n✏️ Updating the FAQ...")
update_res = requests.put(f"{BASE}/faqs/{faq_id}", json={
    "question": "What week is the midterm?",
    "answer": "It will be held in Week 7 instead."
})
print("✅ FAQ updated successfully:", update_res.json())

# Delete the FAQ
print("\n🗑️ Deleting the FAQ...")
del_res = requests.delete(f"{BASE}/faqs/{faq_id}")
print("✅ FAQ deleted successfully:", del_res.json())
