from main import app  # 引入 Flask app
import json

client = app.test_client()

print("\n🔍 开始全局路由测试...\n")

test_cases = [
    {
        "method": "GET",
        "url": "/api/question/test"
    },
    {
        "method": "POST",
        "url": "/api/question/submit",
        "json": {
            "user_id": 1,
            "assignment_id": 8,
            "content": "测试问题接口是否注册"
        }
    },
    {
        "method": "GET",
        "url": "/api/forum/8"
    },
    {
        "method": "POST",
        "url": "/api/forum/1/questions",
        "json": {
            "user_id": 1,
            "content": "测试论坛发帖接口"
        }
    },
    {
        "method": "GET",
        "url": "/"
    }
]

for test in test_cases:
    method = test["method"]
    url = test["url"]
    print(f"➡️  {method} {url}")

    if method == "GET":
        response = client.get(url)
    elif method == "POST":
        response = client.post(url, json=test.get("json", {}))
    else:
        print("❓ Unsupported method")
        continue

    status = response.status_code
    if status == 200 or status == 201:
        print(f"   ✅ Success {status}")
    else:
        print(f"   ❌ Failed {status} - {response.data.decode()[:100]}")

print("\n✅ 测试结束。\n")
