import os
import json
from fuzzywuzzy import process

# Get the directory where the current file is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FAQ_FILE = os.path.join(BASE_DIR, "data", "faqs.json")

# If the file is not found, automatically create an empty JSON file
if not os.path.exists(FAQ_FILE):
    os.makedirs(os.path.dirname(FAQ_FILE), exist_ok=True)
    with open(FAQ_FILE, "w", encoding="utf-8") as f:
        json.dump([], f, ensure_ascii=False, indent=2)

# Load FAQ data
with open(FAQ_FILE, "r", encoding="utf-8") as f:
    FAQS = json.load(f)

def find_answer(user_input, threshold=50):
    """
    Finds the best answer for a user's input using fuzzy matching
    and prints matching details to the console.
    """
    if not FAQS:
        print("[INFO] FAQ data is empty, returning default message")
        return "Sorry, there is no FAQ data at the moment. Please contact your tutor."

    questions = [faq["question"] for faq in FAQS]
    best_match, score = process.extractOne(user_input, questions)

    # Print logs for debugging
    print(f"[DEBUG] User input: {user_input}")
    print(f"[DEBUG] Best match: {best_match} (Score: {score})")

    if score >= threshold:
        for faq in FAQS:
            if faq["question"] == best_match:
                return faq["answer"]

    return "Sorry, I can't answer this question at the moment. Please contact your tutor."