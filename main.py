from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx
from bs4 import BeautifulSoup
from readability import Document
from urllib.parse import urlparse, urljoin

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = "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"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {GROQ_API_KEY}",
}

DUCKDUCKGO_SEARCH_URL = "https://html.duckduckgo.com/html/?q="
EXCLUDED_SITES = ["google", "facebook", "twitter", "instagram", "youtube", "tiktok"]

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
        for result in results[:max_sources]:
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
            except Exception:
                continue

    return sources

@app.get("/answer_with_sources")
async def get_answer_with_sources(q: str = Query(..., min_length=2)):
    sources = await scrape_sources(q)

    if sources:
        context_text = "\n\n".join([f"{src['title']} ({src['url']}): {src['content']}" for src in sources])
        prompt = f"Based on the following sources, answer: '{q}'\n\n{context_text}"
    else:
        prompt = f"Provide a factual answer to: '{q}', as no sources were found."

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
        "sources": [{"title": src["title"], "url": src["url"]} for src in sources],
    }