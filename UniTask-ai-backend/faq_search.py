import os, json
from fuzzywuzzy import process

# 获取当前文件所在目录
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FAQ_FILE = os.path.join(BASE_DIR, "data", "faqs.json")

# 如果找不到文件，自动创建一个空的 JSON 文件
if not os.path.exists(FAQ_FILE):
    os.makedirs(os.path.dirname(FAQ_FILE), exist_ok=True)
    with open(FAQ_FILE, "w", encoding="utf-8") as f:
        json.dump([], f, ensure_ascii=False, indent=2)

# 加载 FAQ 数据
with open(FAQ_FILE, "r", encoding="utf-8") as f:
    FAQS = json.load(f)

def find_answer(user_input, threshold=50):
    """
    模糊匹配用户输入，返回答案，并在控制台打印匹配详情
    """
    if not FAQS:
        print("[INFO] FAQ 数据为空，返回默认提示")
        return "抱歉，目前没有FAQ数据，请联系导师。"

    questions = [faq["question"] for faq in FAQS]
    best_match, score = process.extractOne(user_input, questions)

    # 打印日志，方便调试
    print(f"[DEBUG] 用户输入: {user_input}")
    print(f"[DEBUG] 匹配结果: {best_match} (分数: {score})")

    if score >= threshold:
        for faq in FAQS:
            if faq["question"] == best_match:
                return faq["answer"]

    return "抱歉，我暂时无法回答这个问题，请联系导师。"
