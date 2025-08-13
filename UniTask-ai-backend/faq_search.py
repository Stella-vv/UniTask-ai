import os
import json
from fuzzywuzzy import process

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FAQ_FILE = os.path.join(BASE_DIR, "data", "faqs.json")

if not os.path.exists(FAQ_FILE):
    os.makedirs(os.path.dirname(FAQ_FILE), exist_ok=True)
    with open(FAQ_FILE, "w", encoding="utf-8") as f:
        json.dump([], f, ensure_ascii=False, indent=2)

with open(FAQ_FILE, "r", encoding="utf-8") as f:
    FAQS = json.load(f)

QUESTION_MAP = {}
for faq in FAQS:
    QUESTION_MAP[faq["question"]] = faq["answer"]
    for alias in faq.get("aliases", []):
        QUESTION_MAP[alias] = faq["answer"]

ALL_QUESTIONS = list(QUESTION_MAP.keys())

def find_answer(user_input, threshold=40):
    """
    根据用户输入，使用模糊匹配返回最合适的答案。
    支持 question 和 aliases。
    """
    if not ALL_QUESTIONS:
        print("[INFO] FAQ data is empty, returning default message")
        return "Sorry, there is no FAQ data at the moment. Please contact your tutor."

    best_match, score = process.extractOne(user_input, ALL_QUESTIONS)

    print(f"[DEBUG] User input: {user_input}")
    print(f"[DEBUG] Best match: {best_match} (Score: {score})")

    if score >= threshold:
        return QUESTION_MAP[best_match]

    return "Sorry, I can't answer this question at the moment. Please contact your tutor."
