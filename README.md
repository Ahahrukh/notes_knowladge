# 📚 Notes Knowladge — Hinglish Dev Notes (AI/GenAI Focus)

Next.js (App Router) + TypeScript + Tailwind + MongoDB.

**14 topics, 130+ sections, 100+ interview questions** — Hinglish me, basic se advance tak.

Covers everything an **AI / GenAI / Agentic AI Engineer** needs:

| # | Topic | Slug |
| - | ----- | ---- |
| 1 | 🐍 Python | `python` |
| 2 | ⚙️ Environment Setup (venv/conda/poetry/uv) | `environment-setup` |
| 3 | 🔢 NumPy | `numpy` |
| 4 | 🐼 Pandas | `pandas` |
| 5 | 📊 Matplotlib | `matplotlib` |
| 6 | 🗄️ SQL (incl. pgvector) | `sql` |
| 7 | 🐳 Docker | `docker` |
| 8 | ⚡ FastAPI | `fastapi` |
| 9 | 🤖 LLM APIs (OpenAI, Anthropic) | `llm-apis` |
| 10 | ✍️ Prompt Engineering | `prompt-engineering` |
| 11 | 🧬 Vector DBs & Embeddings | `vector-db` |
| 12 | 🔍 RAG | `rag` |
| 13 | 🦜 LangChain & LangGraph | `langchain` |
| 14 | 🧠 Agentic AI | `agentic-ai` |

Each topic has structured **sections** with code + line-by-line explanation,
plus an **Interview Questions** page with difficulty levels.

---

## 🚀 Setup

```bash
cd notes_knowladge
npm install
cp .env.example .env.local   # already created with your URI
npm run seed                 # populates MongoDB
npm run dev                  # http://localhost:3000
```

> ⚠️ Apna MongoDB password chat me share kiya tha — **Atlas dashboard se rotate kar do abhi**.
> `.env.local` already `.gitignore` me hai.

---

## 🧱 Flexible Schema (add new topics easily)

Three MongoDB collections:

| Collection            | Doc shape (key fields)                                 |
| --------------------- | ------------------------------------------------------ |
| `topics`              | `slug, title, description, icon, color, order`         |
| `sections`            | `topicSlug, slug, title, order, content[]` (blocks)    |
| `interview_questions` | `topicSlug, question, answer, difficulty, order`       |

A **content block** can be one of:

- `{ type: "heading", value, level }`
- `{ type: "text", value }` — supports `**bold**` and `` `code` ``
- `{ type: "code", language, value, explanation? }`
- `{ type: "note", value }`
- `{ type: "list", items, ordered? }`

### Add a new topic (e.g. JavaScript)

Content is now **modular** — one file per topic under [scripts/content/](scripts/content/).

1. Create [scripts/content/javascript.mjs](scripts/content/javascript.mjs):
   ```js
   import { T, H, C, N, L } from "./_helpers.mjs";

   export const topic = {
     slug: "javascript",
     title: "JavaScript",
     description: "...",
     icon: "🟨",
     order: 15,
   };

   export const sections = [
     { topicSlug: "javascript", slug: "intro", order: 1, title: "Introduction",
       content: [ H("What is JS?"), T("JS ek..."), C("js", "console.log('hi')", "Explanation here") ] },
   ];

   export const interview = [
     { topicSlug: "javascript", order: 1, difficulty: "easy",
       question: "var vs let?", answer: "..." },
   ];
   ```
2. Register it in [scripts/seed.mjs](scripts/seed.mjs):
   ```js
   import * as javascript from "./content/javascript.mjs";
   const MODULES = [ ...existing, javascript ];
   ```
3. Run `npm run seed` (idempotent — safe to re-run).

### Or via HTTP API (no seed re-run needed)

```bash
# Create topic
curl -X POST http://localhost:3000/api/topics \
  -H "Content-Type: application/json" \
  -d '{"slug":"javascript","title":"JavaScript","description":"...","order":7,"icon":"🟨"}'

# Add a section
curl -X POST http://localhost:3000/api/topics/javascript/sections \
  -H "Content-Type: application/json" \
  -d '{"slug":"intro","title":"Introduction","order":1,"content":[{"type":"text","value":"JS kya hai..."}]}'

# Add an interview Q
curl -X POST http://localhost:3000/api/topics/javascript/interview \
  -H "Content-Type: application/json" \
  -d '{"question":"var vs let?","answer":"...","difficulty":"easy","order":1}'
```

---

## 🗂 Project Structure

```
notes_knowladge/
├── scripts/
│   ├── seed.mjs                        # Orchestrator (imports content/*)
│   └── content/
│       ├── _helpers.mjs                # T, H, C, N, L block helpers
│       ├── python.mjs
│       ├── environment.mjs             # venv/conda/poetry/uv etc.
│       ├── numpy.mjs
│       ├── pandas.mjs
│       ├── matplotlib.mjs
│       ├── sql.mjs
│       ├── docker.mjs
│       ├── fastapi.mjs
│       ├── llm-apis.mjs
│       ├── prompt-engineering.mjs
│       ├── vector-db.mjs
│       ├── rag.mjs
│       ├── langchain.mjs
│       └── agentic-ai.mjs
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Home (topic cards)
│   │   ├── topics/
│   │   │   ├── page.tsx                # All topics
│   │   │   └── [topicSlug]/
│   │   │       ├── page.tsx            # Topic overview + sidebar
│   │   │       ├── [sectionSlug]/page.tsx
│   │   │       └── interview/page.tsx
│   │   └── api/
│   │       └── topics/...              # CRUD endpoints
│   ├── components/
│   │   ├── TopicCard.tsx
│   │   ├── CodeBlock.tsx
│   │   └── ContentRenderer.tsx
│   └── lib/
│       ├── mongodb.ts
│       ├── models.ts                   # TS types
│       └── queries.ts
└── .env.local
```

---

## 🔮 Future ideas

- Auth + admin dashboard to add notes from UI
- Markdown editor (MDX) for sections
- Search across all topics
- Bookmark / progress tracking
- Light theme
