import requests

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
GEMINI_API_KEY = "AIzaSyCGBBmmTlfjtFWqyq_aFi_4SeRh6-inec4"

HEADERS = {"Content-Type": "application/json"}

prompt = "Suggest 5 interesting topics to learn Python."

payload = {
    "contents": [
        {
            "parts": [
                {"text": prompt}
            ]
        }
    ]
}

try:
    response = requests.post(
        f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
        json=payload,
        headers=HEADERS
    )
    data = response.json()
    print("\n✅ API Response:")
    print(data)

    # Extract clean output
    if "candidates" in data:
        result = data["candidates"][0]["content"]["parts"][0]["text"]
        print("\n🟢 Clean Output:\n", result)
    else:
        print("\n❗ No candidates found. Check API key or quota.")

except Exception as e:
    print("❗ Error:", e)