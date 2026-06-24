import { T, H, C, N, L } from "./_helpers.mjs";

export const topic = {
  slug: "fastapi",
  title: "FastAPI",
  description:
    "AI services serve karne ka standard. Async, Pydantic, auto OpenAPI docs — LLM/RAG/agent backend ke liye perfect.",
  icon: "⚡",
  color: "#009688",
  order: 10,
};

export const sections = [
  {
    topicSlug: "fastapi", slug: "introduction", order: 1,
    title: "Introduction — Kyu FastAPI?",
    summary: "Flask se kyu behtar AI workloads ke liye.",
    content: [
      T("FastAPI Python ka modern web framework hai jo **async**, **Pydantic** (type validation), aur **auto-generated OpenAPI/Swagger docs** built-in deta hai. LLM/RAG/agent APIs ke liye industry standard ban gaya hai 2023+."),
      H("Flask vs FastAPI for AI"),
      L([
        "**Async support** — LLM API calls 5-30s lagti hain, async se 100 requests parallel.",
        "**Pydantic validation** — request/response schemas type-safe, errors clear.",
        "**Auto docs** — `/docs` pe Swagger UI free me, frontend devs khush.",
        "**Performance** — Starlette+uvicorn, Node.js/Go-comparable speed.",
        "**Streaming** — Server-Sent Events native, LLM token streaming easy.",
      ]),
      C("bash", "pip install fastapi uvicorn[standard]", "Uvicorn ASGI server hai jo FastAPI ko serve karta."),
    ],
  },
  {
    topicSlug: "fastapi", slug: "first-api", order: 2,
    title: "First API — Hello World",
    summary: "Routes, query, path params.",
    content: [
      C("python",
`# main.py
from fastapi import FastAPI

app = FastAPI(title="My AI Service", version="0.1")

@app.get("/")
def root():
    return {"status": "ok"}

@app.get("/items/{item_id}")
def get_item(item_id: int, q: str | None = None):
    # item_id PATH param, q QUERY param
    return {"item_id": item_id, "q": q}

# GET /items/5?q=hello → {"item_id": 5, "q": "hello"}`,
        "Path params `{name}` URL me, query params function args jo defaults rakhte hain. Type hints automatic validation karte hain."),
      C("bash",
`# Run
uvicorn main:app --reload --port 8000

# Open in browser
# http://localhost:8000          → JSON response
# http://localhost:8000/docs     → Swagger UI (auto-generated)
# http://localhost:8000/redoc    → ReDoc UI`,
        "`--reload` dev mode — code change pe auto-restart. Production me workers count badhao: `--workers 4`."),
    ],
  },
  {
    topicSlug: "fastapi", slug: "pydantic-validation", order: 3,
    title: "Pydantic — Request/Response Validation",
    summary: "Type-safe API contracts.",
    content: [
      C("python",
`from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Literal

app = FastAPI()

class ChatRequest(BaseModel):
    model: Literal["gpt-4", "claude-3", "gemini"]
    messages: list[dict]
    temperature: float = Field(0.7, ge=0, le=2)
    max_tokens: int = Field(1000, gt=0, le=4000)

class ChatResponse(BaseModel):
    text: str
    tokens_used: int
    cost_usd: float

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    # req auto-validated. Wrong data → 422 with details.
    return ChatResponse(
        text=f"Echo from {req.model}",
        tokens_used=42,
        cost_usd=0.001,
    )`,
        "Invalid request → 422 Unprocessable Entity with clear field-wise errors. Frontend dev clear feedback milta."),
      H("Field validators"),
      C("python",
`from pydantic import BaseModel, field_validator

class Embedding(BaseModel):
    text: str
    model: str = "text-embedding-3-small"

    @field_validator("text")
    @classmethod
    def text_not_empty(cls, v):
        if not v.strip():
            raise ValueError("text cannot be empty")
        if len(v) > 8000:
            raise ValueError("text too long (max 8000 chars)")
        return v.strip()`,
        "Business rules Pydantic me declare karo — handlers clean rehte hain."),
    ],
  },
  {
    topicSlug: "fastapi", slug: "async-llm", order: 4,
    title: "Async Endpoints — LLM Calls",
    summary: "Real LLM API integration.",
    content: [
      C("python",
`from fastapi import FastAPI
from openai import AsyncOpenAI
from pydantic import BaseModel

app = FastAPI()
client = AsyncOpenAI()   # OPENAI_API_KEY env se

class ChatRequest(BaseModel):
    prompt: str
    model: str = "gpt-4o-mini"

@app.post("/chat")
async def chat(req: ChatRequest):
    response = await client.chat.completions.create(
        model=req.model,
        messages=[{"role": "user", "content": req.prompt}],
    )
    return {
        "text": response.choices[0].message.content,
        "tokens": response.usage.total_tokens,
    }`,
        "`async def` + `await client.chat...create()` — multiple requests parallel handle hote hain ek hi worker me. Sync endpoint me thread pool block hota."),
      H("Parallel LLM calls"),
      C("python",
`import asyncio

@app.post("/multi-chat")
async def multi_chat(prompts: list[str]):
    # 10 prompts parallel
    tasks = [
        client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": p}],
        )
        for p in prompts
    ]
    responses = await asyncio.gather(*tasks)
    return [r.choices[0].message.content for r in responses]`,
        "10 prompts sequentially 30s lagti hain (3s each). asyncio.gather se 3s me ho jata (overlap). Production me semaphore lagao rate-limit avoid karne ke liye."),
    ],
  },
  {
    topicSlug: "fastapi", slug: "streaming", order: 5,
    title: "Streaming Responses (SSE)",
    summary: "LLM tokens chunk-by-chunk frontend ko stream.",
    content: [
      C("python",
`from fastapi.responses import StreamingResponse

@app.post("/chat-stream")
async def chat_stream(req: ChatRequest):
    async def event_generator():
        stream = await client.chat.completions.create(
            model=req.model,
            messages=[{"role": "user", "content": req.prompt}],
            stream=True,
        )
        async for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                # SSE format
                yield f"data: {delta}\\n\\n"
        yield "data: [DONE]\\n\\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
    )`,
        "Server-Sent Events (SSE) format — `data: <chunk>\\n\\n`. Frontend `EventSource` API se consume karta. ChatGPT-style typewriter effect."),
      N("WebSockets bhi support hai FastAPI me — bi-directional chahiye to use karo (agent ↔ user interactive sessions)."),
    ],
  },
  {
    topicSlug: "fastapi", slug: "dependency-injection", order: 6,
    title: "Dependency Injection",
    summary: "Auth, DB sessions, shared resources clean way.",
    content: [
      C("python",
`from fastapi import Depends, HTTPException, Header

async def get_api_key(x_api_key: str = Header(...)):
    if x_api_key != "secret-key":
        raise HTTPException(401, "Invalid API key")
    return x_api_key

async def get_user(api_key: str = Depends(get_api_key)):
    # api_key se user lookup
    return {"id": 1, "tier": "pro"}

@app.get("/me")
async def me(user: dict = Depends(get_user)):
    return user`,
        "`Depends()` automatic resolve karta. Nested dependencies bhi — `get_user` khud `get_api_key` pe depend karta. Sab cache ho jate same request me."),
      H("Database session example"),
      C("python",
`from sqlalchemy.ext.asyncio import AsyncSession

async def get_db():
    async with SessionMaker() as session:
        yield session    # generator — cleanup automatic

@app.get("/users/{id}")
async def get_user(id: int, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, id)
    if not user:
        raise HTTPException(404)
    return user`,
        "Yield-based dependency cleanup karta hai (session close) request done hone ke baad. With-block jaisa pattern."),
    ],
  },
  {
    topicSlug: "fastapi", slug: "structure", order: 7,
    title: "Project Structure — Production",
    summary: "Routers, settings, middleware.",
    content: [
      C("text",
`src/myapp/
├── main.py              # FastAPI app, middleware
├── config.py            # Pydantic Settings
├── api/
│   ├── __init__.py
│   ├── deps.py          # shared dependencies
│   ├── chat.py          # router
│   ├── embeddings.py
│   └── agents.py
├── core/
│   ├── llm.py           # LLM client wrappers
│   ├── prompts.py
│   └── vectorstore.py
├── schemas/             # Pydantic models
│   ├── chat.py
│   └── common.py
├── models/              # DB models (SQLAlchemy)
└── services/            # business logic`),
      C("python",
`# src/myapp/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import chat, embeddings, agents
from .config import settings

app = FastAPI(title=settings.app_name, version="1.0")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(embeddings.router, prefix="/api/embeddings", tags=["embeddings"])
app.include_router(agents.router, prefix="/api/agents", tags=["agents"])

@app.get("/health")
def health():
    return {"status": "ok"}`,
        "Routers se features modular. Health endpoint K8s liveness probe ke liye."),
      C("python",
`# src/myapp/api/chat.py
from fastapi import APIRouter, Depends
router = APIRouter()

@router.post("/")
async def chat(...):
    ...`),
    ],
  },
  {
    topicSlug: "fastapi", slug: "deployment", order: 8,
    title: "Deployment — Docker + Gunicorn/Uvicorn",
    summary: "Production-grade serving.",
    content: [
      C("dockerfile",
`FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

EXPOSE 8000
CMD ["uvicorn", "src.myapp.main:app", \\
     "--host", "0.0.0.0", "--port", "8000", \\
     "--workers", "4"]`,
        "Production me 2-4 workers per CPU core. CPU-bound work hai to multiprocessing chahiye GIL bypass ke liye."),
      C("bash",
`# Gunicorn + Uvicorn workers (more robust)
gunicorn src.myapp.main:app \\
  --workers 4 \\
  --worker-class uvicorn.workers.UvicornWorker \\
  --bind 0.0.0.0:8000 \\
  --timeout 120 \\
  --access-logfile -`,
        "Gunicorn process manager (worker recycling, graceful restart) + Uvicorn workers (async support). Production standard."),
      N("LLM endpoints me timeout badhao — default 30s usually kam hota hai (`--timeout 300`). Healthcheck endpoint LLM call NA include kare (slow → unhealthy mark)."),
    ],
  },
];

export const interview = [
  { topicSlug: "fastapi", order: 1, difficulty: "easy",
    question: "FastAPI Flask se kyu behtar AI workloads ke liye?",
    answer: "Async native (LLM API calls 5-30s — async parallel handle), Pydantic validation built-in (type-safe API), auto OpenAPI docs (/docs), streaming first-class (SSE for LLM token streaming), and significantly faster (Starlette + uvicorn)." },
  { topicSlug: "fastapi", order: 2, difficulty: "easy",
    question: "Path vs Query param?",
    answer: "Path — URL me `/items/{id}` jaisa, mandatory part of URL. Query — `?q=value` jaise key=value, function arg me default value se optional bana sakte. Both Pydantic se validate." },
  { topicSlug: "fastapi", order: 3, difficulty: "medium",
    question: "Async endpoint me sync DB call karoge to kya hoga?",
    answer: "Event loop block ho jayega — async ka fayda khatam, throughput gir jayega. Solution: async DB driver use karo (asyncpg, motor, aiomysql) ya `await run_in_executor()` se threadpool me bhejo." },
  { topicSlug: "fastapi", order: 4, difficulty: "medium",
    question: "LLM streaming kaise implement?",
    answer:
`StreamingResponse + async generator (SSE format).
async def gen():
    async for chunk in llm_stream:
        yield f'data: {chunk}\\n\\n'
return StreamingResponse(gen(), media_type='text/event-stream')
Frontend EventSource API se consume karta hai.` },
  { topicSlug: "fastapi", order: 5, difficulty: "medium",
    question: "Depends() kyu use? Plain function call kyu nahi?",
    answer: "Depends() — automatic dependency graph resolve, same dependency same request me cache, yield-based cleanup support, testing me override easy (`app.dependency_overrides[get_db] = mock_db`). Auth, DB sessions, rate-limiters ke liye standard." },
  { topicSlug: "fastapi", order: 6, difficulty: "hard",
    question: "Production deployment me workers kitne rakhoge?",
    answer:
`General formula: (2 × CPU cores) + 1.
LLM workloads me I/O bound — async, kam workers + more concurrency. Memory-heavy (models loaded) → kam workers.
GPU inference → 1 worker per GPU (concurrent batching internally).
Always measure under load.` },
  { topicSlug: "fastapi", order: 7, difficulty: "hard",
    question: "LLM endpoint pe 30s+ requests handle karne ke liye?",
    answer:
`• Uvicorn/Gunicorn timeout badhao (--timeout 300).
• Streaming response use karo (chunk-by-chunk send, client never times out).
• Async + asyncio.gather for parallel sub-calls.
• Long jobs → background task queue (Celery/RQ/arq) + status polling endpoint.
• LLM call ko separate worker pool me, healthcheck quick rakho.` },
];
