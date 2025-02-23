from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
import httpx  # For async web scraping
from bs4 import BeautifulSoup  # For extracting content

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google Gemini API Config
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent"
GEMINI_API_KEY = "AIzaSyBU899inuJPkQGfEgW9s78d0-ooiVw8eQ0"  # Replace with your Gemini API Key

HEADERS = {"Content-Type": "application/json"}

# Google Search API for Web Scraping (Free Version)
GOOGLE_SEARCH_URL = "https://www.google.com/search?q="


@app.get("/")
def home():
    return {"message": "FastAPI Smart Search is running!"}


@app.get("/search")
async def search_suggestions(q: str = Query(..., min_length=2)):
    """
    Fetch AI-generated search suggestions from Google Gemini.
    """
    prompt = (
        f"You are an intelligent search assistant. "
        f"Suggest **exactly 5 unique and highly relevant search queries** based on the topic: '{q}'. "
        f"Ensure diversity and relevance to enhance user search experience."
    )

    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    try:
        response = requests.post(f"{GEMINI_API_URL}?key={GEMINI_API_KEY}", json=payload, headers=HEADERS)
        data = response.json()

        if "candidates" in data and len(data["candidates"]) > 0:
            content = data["candidates"][0]["content"]
            if "parts" in content and len(content["parts"]) > 0:
                raw_text = content["parts"][0]["text"]
                suggestions = [line.strip() for line in raw_text.split("\n") if line.strip()][:5]
            else:
                suggestions = ["No suggestions found. Try a different keyword."]
        else:
            suggestions = ["No suggestions found. Try a different keyword."]

    except Exception as e:
        print("Error:", e)
        suggestions = ["Error fetching suggestions. Please try again."]

    return {"suggestions": suggestions}


@app.get("/answer_with_sources")
async def get_answer_with_sources(q: str = Query(..., min_length=2)):
    """
    Fetch a detailed AI-generated answer along with relevant web citations.
    """
    # Step 1: Generate AI Answer
    prompt = (
        f"You are an AI research assistant. Provide a **detailed and accurate** answer to the query: '{q}'. "
        f"Structure the response into **clear sections** with helpful insights, facts, and examples."
    )

    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    try:
        response = requests.post(f"{GEMINI_API_URL}?key={GEMINI_API_KEY}", json=payload, headers=HEADERS)
        data = response.json()

        if "candidates" in data and len(data["candidates"]) > 0:
            content = data["candidates"][0]["content"]
            if "parts" in content and len(content["parts"]) > 0:
                answer = content["parts"][0]["text"]
            else:
                answer = "No relevant answer found. Try a different query."
        else:
            answer = "No relevant answer found. Try a different query."

    except Exception as e:
        print("Error:", e)
        answer = "Error fetching answer. Please try again."

    # Step 2: Scrape Google Search for Citations
    async with httpx.AsyncClient() as client:
        search_url = GOOGLE_SEARCH_URL + q.replace(" ", "+")
        try:
            response = await client.get(search_url)
            soup = BeautifulSoup(response.text, "html.parser")

            search_results = []
            for g in soup.find_all("div", class_="tF2Cxc"):  # Google search result div
                link = g.find("a")["href"]
                title = g.find("h3").text if g.find("h3") else "No title available"
                search_results.append({"title": title, "url": link})

                if len(search_results) >= 3:  # Limit to top 3 sources
                    break

        except Exception as e:
            print("Error fetching web sources:", e)
            search_results = []

    return {"answer": answer, "sources": search_results}