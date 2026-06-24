import { T, H, C, N, L } from "./_helpers.mjs";

export const topic = {
  slug: "llm-apis",
  title: "LLM APIs (OpenAI, Anthropic, etc.)",
  description:
    "GPT-4, Claude, Gemini — official SDKs se text/JSON/tools call karna. Streaming, function calling, structured outputs.",
  icon: "🤖",
  color: "#a855f7",
  order: 11,
};

export const sections = [
  {
    topicSlug: "llm-apis", slug: "introduction", order: 1,
    title: "Introduction — LLM API Landscape",
    summary: "Major providers aur unke SDKs.",
    content: [
      L([
        "**OpenAI** — GPT-4, GPT-4o, o1 reasoning models. SDK: `openai`.",
        "**Anthropic** — Claude 3.5 Sonnet, Claude 4 Opus. SDK: `anthropic`.",
        "**Google** — Gemini 1.5/2.0. SDK: `google-generativeai`.",
        "**Meta** — Llama (open weights, host yourself).",
        "**Mistral**, **Cohere**, **DeepSeek** — alternatives.",
        "**Open routers** — OpenRouter, Together AI — multiple models ek API se.",
      ]),
      H("Common concepts (sab providers me)"),
      L([
        "**Token** — text ka unit (~4 chars ≈ 1 token). Pricing token-based.",
        "**Context window** — model ek baar me kitna text dekh sake (8K to 1M+).",
        "**Temperature** — randomness (0 deterministic, 1+ creative).",
        "**System prompt** — model ko role/behaviour set karta hai.",
        "**Tool/Function calling** — model structured action invoke karta.",
        "**Streaming** — tokens chunk-by-chunk aate hain.",
      ]),
    ],
  },
  {
    topicSlug: "llm-apis", slug: "openai-basics", order: 2,
    title: "OpenAI SDK — Basics",
    summary: "Chat completion, simple use.",
    content: [
      C("bash", "pip install openai", "Env var `OPENAI_API_KEY` set karo."),
      C("python",
`from openai import OpenAI
client = OpenAI()    # API key env se auto-pickup

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "Tu ek helpful Hinglish assistant hai."},
        {"role": "user", "content": "Python me list aur tuple ka difference?"},
    ],
    temperature=0.7,
    max_tokens=500,
)

print(response.choices[0].message.content)
print("Tokens used:", response.usage.total_tokens)`,
        "`messages` me conversation history. Roles: system (instructions), user, assistant. Pehla call me history short, multi-turn me grow karti hai."),
      H("Async version"),
      C("python",
`from openai import AsyncOpenAI
client = AsyncOpenAI()

async def chat(prompt):
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content`,
        "Production FastAPI me hamesha async use karo — concurrent requests handle ho jate."),
    ],
  },
  {
    topicSlug: "llm-apis", slug: "streaming", order: 3,
    title: "Streaming Responses",
    summary: "Token-by-token output (typewriter UX).",
    content: [
      C("python",
`stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "AI ke baare me 3 line likho"}],
    stream=True,
)

for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)`,
        "ChatGPT jaise effect — wait nahi karna padta full response ka. UX me bahut farak."),
      H("Async streaming + FastAPI"),
      C("python",
`async def stream_llm(prompt: str):
    stream = await async_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        stream=True,
    )
    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta`,
        "Generator yields chunks. FastAPI StreamingResponse me wrap kar do — frontend ko SSE/WebSocket pe forward."),
    ],
  },
  {
    topicSlug: "llm-apis", slug: "structured-output", order: 4,
    title: "Structured Output (JSON Mode)",
    summary: "LLM se reliable JSON nikaalna.",
    content: [
      H("JSON mode (forced JSON)"),
      C("python",
`response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "Output JSON only."},
        {"role": "user", "content": "Extract: 'Ali, 25 years, Delhi'"},
    ],
    response_format={"type": "json_object"},
)

import json
data = json.loads(response.choices[0].message.content)
# {"name": "Ali", "age": 25, "city": "Delhi"}`,
        "`json_object` mode — guarantee karta hai valid JSON return ho. Schema enforce nahi karta though."),
      H("Structured Outputs (schema-enforced)"),
      C("python",
`from pydantic import BaseModel

class Person(BaseModel):
    name: str
    age: int
    city: str
    skills: list[str]

response = client.beta.chat.completions.parse(
    model="gpt-4o-2024-08-06",
    messages=[
        {"role": "user", "content": "Extract: Ali, 25, Delhi, knows Python & SQL"},
    ],
    response_format=Person,
)

person: Person = response.choices[0].message.parsed
print(person.name, person.skills)`,
        "OpenAI structured outputs — Pydantic schema strictly enforce hota. **Production code me yehi use karo** — `json.loads` errors khatam."),
      H("Anthropic / generic — tools-as-schema trick"),
      C("python",
`# Claude me explicit JSON mode nahi, par tool-use se enforce kar sakte ho
import instructor   # works with all major providers

client = instructor.from_openai(OpenAI())
person = client.chat.completions.create(
    model="gpt-4o-mini",
    response_model=Person,
    messages=[{"role": "user", "content": "..."}],
    max_retries=2,
)`,
        "**`instructor`** library — provider-agnostic structured output. Internally validates + retries on parse fail."),
    ],
  },
  {
    topicSlug: "llm-apis", slug: "function-calling", order: 5,
    title: "Function / Tool Calling",
    summary: "LLM decide kare kab function call kare — agents ka base.",
    content: [
      T("Tool calling se LLM apne se nahi answer dega — instead, structured request banakar tumhare code ko bolega ki ye function call karo, result wapas do."),
      C("python",
`tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Current weather of a city",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["city"]
        }
    }
}]

def get_weather(city, unit="celsius"):
    # actual API call
    return {"city": city, "temp": 32, "unit": unit}

messages = [{"role": "user", "content": "Delhi ka mausam batao"}]

# Step 1: LLM decide karta — tool call ya direct reply
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages,
    tools=tools,
)

msg = response.choices[0].message
if msg.tool_calls:
    # Step 2: Tool execute karo
    call = msg.tool_calls[0]
    args = json.loads(call.function.arguments)
    result = get_weather(**args)

    # Step 3: Result wapas LLM ko do
    messages.append(msg)    # assistant ka tool call
    messages.append({
        "role": "tool",
        "tool_call_id": call.id,
        "content": json.dumps(result),
    })

    # Step 4: Final response
    final = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
    )
    print(final.choices[0].message.content)`,
        "**Agent loop ka basic shape yehi hai**. LangChain/LangGraph internally yahi karte hain par abstract karke."),
    ],
  },
  {
    topicSlug: "llm-apis", slug: "anthropic", order: 6,
    title: "Anthropic Claude SDK",
    summary: "Claude API ka basic.",
    content: [
      C("bash", "pip install anthropic", "Env var `ANTHROPIC_API_KEY`."),
      C("python",
`from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    system="Tu Hinglish me concise jawab deta hai.",
    messages=[
        {"role": "user", "content": "RAG kya hai?"}
    ],
)

print(response.content[0].text)`,
        "OpenAI se thoda alag: `system` top-level arg hai (messages me nahi). `max_tokens` mandatory. `content` ek list of blocks return karta."),
      H("Tool use (Claude)"),
      C("python",
`tools = [{
    "name": "calculator",
    "description": "Basic math",
    "input_schema": {
        "type": "object",
        "properties": {
            "expression": {"type": "string"}
        },
        "required": ["expression"]
    }
}]

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "23*45+7?"}]
)

# response.content me ToolUseBlock check karo, similar loop as OpenAI`,
        "Schema slightly different (`input_schema` vs `parameters`). Loop pattern same."),
    ],
  },
  {
    topicSlug: "llm-apis", slug: "embeddings", order: 7,
    title: "Embeddings API",
    summary: "Text → vector (RAG ka pehla step).",
    content: [
      C("python",
`# OpenAI
response = client.embeddings.create(
    model="text-embedding-3-small",   # 1536 dims, cheap
    input=["AI is the future", "Machine learning is awesome"],
)

vectors = [item.embedding for item in response.data]
print(len(vectors[0]))    # 1536

# Single text
resp = client.embeddings.create(
    model="text-embedding-3-small",
    input="hello world",
)
vec = resp.data[0].embedding`,
        "Embedding = fixed-size vector jo text ka semantic meaning capture karta. Models: `text-embedding-3-small` (1536d, fast, cheap), `text-embedding-3-large` (3072d, better quality)."),
      N("Embeddings batch me lo (100-1000 texts at a time) — far cheaper + faster than one-by-one."),
    ],
  },
  {
    topicSlug: "llm-apis", slug: "production", order: 8,
    title: "Production Patterns",
    summary: "Retry, caching, cost tracking, rate limits.",
    content: [
      H("1) Retry with exponential backoff"),
      C("python",
`from tenacity import retry, stop_after_attempt, wait_exponential
from openai import RateLimitError, APIError

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=30),
    retry=lambda e: isinstance(e, (RateLimitError, APIError)),
)
def call_llm(prompt):
    return client.chat.completions.create(...)`,
        "`tenacity` library standard hai retry ke liye. Rate limit + transient errors auto-handle."),
      H("2) Response caching"),
      C("python",
`import hashlib, json
from functools import lru_cache

def cache_key(model, messages, **kw):
    blob = json.dumps({"m": model, "msg": messages, **kw}, sort_keys=True)
    return hashlib.sha256(blob.encode()).hexdigest()

# Redis backed cache (production)
def cached_chat(model, messages, **kw):
    key = cache_key(model, messages, **kw)
    if cached := redis.get(key):
        return json.loads(cached)
    resp = client.chat.completions.create(model=model, messages=messages, **kw)
    redis.set(key, json.dumps(resp.model_dump()), ex=3600)
    return resp`,
        "Same prompt = same response (temperature=0). Cache hit pe latency + cost zero. 30-70% cost reduction common."),
      H("3) Cost tracking"),
      C("python",
`PRICING = {
    "gpt-4o-mini": {"in": 0.150 / 1e6, "out": 0.600 / 1e6},
    "gpt-4o":      {"in": 2.500 / 1e6, "out": 10.00 / 1e6},
    "claude-3-5-sonnet": {"in": 3.0 / 1e6, "out": 15.0 / 1e6},
}

def cost_of(model, in_tokens, out_tokens):
    p = PRICING[model]
    return in_tokens * p["in"] + out_tokens * p["out"]

# Har request log karo
cost = cost_of(resp.model, resp.usage.prompt_tokens, resp.usage.completion_tokens)
db.insert({"user": user_id, "model": resp.model, "cost": cost, "ts": now()})`,
        "Cost runaway from LLM agents bahut common. Per-user limits, alert thresholds rakho."),
      H("4) Rate limit pool"),
      C("python",
`import asyncio
semaphore = asyncio.Semaphore(10)   # max 10 concurrent

async def safe_call(prompt):
    async with semaphore:
        return await client.chat.completions.create(...)`,
        "Provider rate limits hit nahi honge. asyncio.gather + semaphore pattern."),
    ],
  },
];

export const interview = [
  { topicSlug: "llm-apis", order: 1, difficulty: "easy",
    question: "Temperature kya kaam karta?",
    answer: "Randomness control. 0 = deterministic (always same output, top probability token), 1 = balanced, 2 = highly creative. Code generation / extraction → 0-0.2. Creative writing → 0.7-1.0." },
  { topicSlug: "llm-apis", order: 2, difficulty: "easy",
    question: "System message ka kya use?",
    answer: "Model ka behaviour/role/persona set karta hai pure conversation ke liye. 'Tu helpful Hinglish assistant hai', 'JSON only output do', 'Be concise'. Conversation se persist karta hai." },
  { topicSlug: "llm-apis", order: 3, difficulty: "medium",
    question: "Tokens kya hain? Cost se kaise related?",
    answer: "Token = text ka sub-unit (~4 chars / 0.75 word). Models tokens count karte. Pricing per million tokens — input cheaper, output costlier (e.g., gpt-4o-mini: $0.15/M in, $0.60/M out). Long prompts + long responses = high cost." },
  { topicSlug: "llm-apis", order: 4, difficulty: "medium",
    question: "LLM streaming kyu use karein?",
    answer: "First token latency dikhti hai user ko — wait 30s ka chatGPT jaisa kaam <1s feel hota. UX massive improvement. Plus partial response cancel kar sake user. Implementation: stream=True + iterate chunks." },
  { topicSlug: "llm-apis", order: 5, difficulty: "medium",
    question: "Structured output kaise reliably?",
    answer:
`Options (best → worst):
1. OpenAI Structured Outputs (response_format=PydanticSchema) — strict schema enforcement.
2. instructor library — provider-agnostic, retries on parse fail.
3. JSON mode (response_format={"type":"json_object"}) — JSON guarantee but schema not enforced.
4. Prompt me 'Output JSON' likhna — unreliable.
Production me 1 ya 2.` },
  { topicSlug: "llm-apis", order: 6, difficulty: "medium",
    question: "Function/Tool calling kya hai?",
    answer: "Schema me functions describe karo, LLM apne se decide kare kab kaunsa call kare — return karta hai structured args. Tum execute karke result wapas pass karte ho. Agent loop ka base. Use cases: APIs (weather, search), DB queries, calculators." },
  { topicSlug: "llm-apis", order: 7, difficulty: "hard",
    question: "Production me LLM API call kaise robust banaoge?",
    answer:
`• Retry with exponential backoff (tenacity) — rate limit/transient.
• Timeout (10-60s based on use case).
• Async + semaphore for concurrency control.
• Response caching (Redis) for repeat queries (temp=0).
• Token/cost tracking per user.
• Fallback model (gpt-4o-mini → claude on failure).
• Structured logging + alerting on error spikes.
• Circuit breaker for sustained failures.` },
  { topicSlug: "llm-apis", order: 8, difficulty: "hard",
    question: "Context window full ho gaya — kya karoge?",
    answer:
`• Summarization — purane messages ko model se hi summarize karwa ke replace.
• Sliding window — old messages drop, latest N rakho.
• RAG — context me sirf relevant chunks retrieve.
• Hierarchical memory — short term (recent) + long term (vector DB).
• Larger context model use karo (Claude 200K, Gemini 1M).
Trade-off: longer context = slower + costlier + 'lost in middle' problem.` },
];
