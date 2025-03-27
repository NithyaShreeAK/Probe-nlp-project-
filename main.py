from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx
from bs4 import BeautifulSoup

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq API Config
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API_KEY = "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" 

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {GROQ_API_KEY}"
}

GOOGLE_SEARCH_URL = "https://www.google.com/search?q="


@app.get("/")
def home():
    return {"message": "🔍 FastAPI Smart Search is running with Groq Llama3!"}


@app.get("/search")
async def search_suggestions(q: str = Query(..., min_length=2)):
    """
    Fetch AI-generated search suggestions from Groq.
    """
    prompt = (
        f"Suggest 5 unique and relevant search queries related to: '{q}'. "
        f"Make them diverse and useful."
    )

    payload = {
        "model": "llama3-8b-8192",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(GROQ_API_URL, headers=HEADERS, json=payload, timeout=20)
            data = response.json()
            print("\n✅ API Response:", data)

            if "choices" in data:
                content = data["choices"][0]["message"]["content"]
                suggestions = [line.strip("-• ") for line in content.split("\n") if line.strip()]
            else:
                suggestions = ["No suggestions found."]

    except Exception as e:
        print("❗ Error fetching suggestions:", e)
        suggestions = ["Error fetching suggestions. Please try again."]

    return {"suggestions": suggestions}


@app.get("/answer_with_sources")
async def get_answer_with_sources(q: str = Query(..., min_length=2)):
    """
    Fetch detailed AI-generated answer along with top 3 relevant web citations.
    """
    # Step 1: Generate AI Answer
    prompt = (
        f"Provide a detailed, factual and accurate answer to: '{q}'. "
        f"Organize the answer with headings and examples."
    )

    payload = {
        "model": "llama3-8b-8192",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(GROQ_API_URL, headers=HEADERS, json=payload, timeout=20)
            data = response.json()
            print("\n✅ API Response:", data)

            if "choices" in data:
                answer = data["choices"][0]["message"]["content"]
            else:
                answer = "No relevant answer found."

    except Exception as e:
        print("❗ Error fetching answer:", e)
        answer = "Error fetching answer. Please try again."

    # Step 2: Scrape Google for sources
    async with httpx.AsyncClient() as client:
        search_url = GOOGLE_SEARCH_URL + q.replace(" ", "+")
        try:
            response = await client.get(search_url, timeout=10)
            soup = BeautifulSoup(response.text, "html.parser")

            search_results = []
            for g in soup.find_all("div", class_="tF2Cxc"):
                link = g.find("a")["href"]
                title = g.find("h3").text if g.find("h3") else "No title"
                search_results.append({"title": title, "url": link})
                if len(search_results) >= 3:
                    break

        except Exception as e:
            print("❗ Error fetching sources:", e)
            search_results = []

    return {"answer": answer, "sources": search_results}