from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx
from bs4 import BeautifulSoup
from readability import Document
from urllib.parse import urlparse, urljoin

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API credentials
GROQ_API_KEY = "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"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {GROQ_API_KEY}",
}

# DuckDuckGo search
DUCKDUCKGO_SEARCH_URL = "https://html.duckduckgo.com/html/?q="
EXCLUDED_SITES = ["google", "facebook", "twitter", "instagram", "youtube", "tiktok"]

# Harris Hawks Optimization inspired re-ranking
def hho_rank_sources(sources, query="AI"):
    for src in sources:
        content_length_score = len(src['content'])
        keyword_score = 500 if query.lower() in src['title'].lower() or query.lower() in src['content'].lower() else 0
        src["score"] = content_length_score + keyword_score

    max_score = max(src["score"] for src in sources) or 1
    for src in sources:
        src["score"] = round(src["score"] / max_score, 4)

    sorted_sources = sorted(sources, key=lambda x: x["score"], reverse=True)
    for rank, src in enumerate(sorted_sources, start=1):
        src["rank"] = rank

    return sorted_sources

# Web scraping function
async def scrape_sources(query: str, max_sources: int = 4):
    async with httpx.AsyncClient() as client:
        try:
            search_url = DUCKDUCKGO_SEARCH_URL + query.replace(" ", "+")
            response = await client.get(search_url, timeout=10)
            response.raise_for_status()
        except httpx.HTTPStatusError:
            return []

        soup = BeautifulSoup(response.text, "html.parser")
        results = soup.select("a.result__url")

        sources = []
        for result in results[:max_sources * 2]:  # Fetch more in case some are filtered
            try:
                link = urljoin("https://duckduckgo.com", result["href"]) if not result["href"].startswith("http") else result["href"]
                title = result.text.strip()
                domain = urlparse(link).hostname or ""

                if any(site in domain for site in EXCLUDED_SITES):
                    continue

                page_response = await client.get(link, timeout=10)
                doc = Document(page_response.text)
                content = BeautifulSoup(doc.summary(), "html.parser").text[:1500]

                sources.append({"title": title, "url": link, "content": content})

                if len(sources) >= max_sources:
                    break

            except Exception:
                continue

    return sources

# Main route
@app.get("/answer_with_sources")
async def get_answer_with_sources(q: str = Query(..., min_length=2)):
    sources = await scrape_sources(q)

    if sources:
        ranked_sources = hho_rank_sources(sources, q)
        context_text = "\n\n".join([f"{src['title']} ({src['url']}): {src['content']}" for src in ranked_sources])
        prompt = f"""You are a helpful AI assistant. Based on the following sources, provide a detailed, well-explained, and structured answer to the question: '{q}'.
Break the response into clear sections if needed, and make it informative for someone who may not be familiar with the topic.

Sources:
{context_text}
"""
    else:
        prompt = f"""Provide a detailed and factual answer to the question: '{q}'.
Break the response into clear sections if appropriate. Explain all relevant concepts thoroughly, as if teaching someone new to the topic."""
        ranked_sources = []

    payload = {
        "model": "llama3-8b-8192",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(GROQ_API_URL, headers=HEADERS, json=payload, timeout=20)
            data = response.json()
            answer = data.get("choices", [{}])[0].get("message", {}).get("content", "No answer found.")
    except Exception as e:
        return {"status": "error", "message": "Failed to fetch answer.", "error": str(e)}

    return {
        "status": "success",
        "query": q,
        "answer": answer,
        "sources": [
            {
                "title": src["title"],
                "url": src["url"],
                "rank": src["rank"],
                "score": src["score"]
            } for src in ranked_sources
        ],
    }