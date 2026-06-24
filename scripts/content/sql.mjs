import { T, H, C, N, L } from "./_helpers.mjs";

export const topic = {
  slug: "sql",
  title: "SQL",
  description:
    "Data ka language. AI engineer ko bhi aana must — analytics, RAG retrieval, eval datasets sab SQL touch karte hain.",
  icon: "🗄️",
  color: "#f29111",
  order: 7,
};

export const sections = [
  {
    topicSlug: "sql", slug: "introduction", order: 1,
    title: "Introduction & DDL Basics",
    summary: "Database, table, types — CREATE/DROP.",
    content: [
      T("SQL = **Structured Query Language**. Relational databases (PostgreSQL, MySQL, SQLite, SQL Server) se baat karne ka standard."),
      L([
        "**Database** — folder of tables.",
        "**Table** — rows × columns (Excel sheet jaisa).",
        "**Row (record)** — ek entity.",
        "**Column (field)** — attribute with fixed type.",
        "**Primary Key (PK)** — unique row identifier.",
        "**Foreign Key (FK)** — kisi aur table ka PK reference.",
      ]),
      C("sql",
`CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  name        VARCHAR(100),
  tier        VARCHAR(20) DEFAULT 'free',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE llm_calls (
  id          BIGSERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id) ON DELETE CASCADE,
  model       VARCHAR(50) NOT NULL,
  tokens_in   INT,
  tokens_out  INT,
  cost_usd    NUMERIC(10, 6),
  latency_ms  INT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_calls_user_created ON llm_calls(user_id, created_at);`,
        "Production schema example — LLM API logging service. `REFERENCES` foreign key, `ON DELETE CASCADE` parent delete pe child rows bhi gayi."),
      N("`SERIAL` = auto-increment integer. `TIMESTAMPTZ` = timezone-aware. `NUMERIC(p,s)` = exact decimal (cost ke liye float mat use karo — precision loss)."),
    ],
  },
  {
    topicSlug: "sql", slug: "crud", order: 2,
    title: "INSERT / SELECT / UPDATE / DELETE",
    summary: "Basic CRUD operations.",
    content: [
      C("sql",
`-- INSERT
INSERT INTO users (email, name, tier)
VALUES ('ali@x.com', 'Ali', 'pro');

-- Bulk insert
INSERT INTO users (email, name) VALUES
  ('a@x.com', 'A'),
  ('b@x.com', 'B');

-- SELECT
SELECT * FROM users;
SELECT id, name FROM users WHERE tier = 'pro';
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;

-- UPDATE
UPDATE users SET tier = 'enterprise' WHERE id = 5;
UPDATE users SET tier = 'free' WHERE created_at < NOW() - INTERVAL '90 days';

-- DELETE
DELETE FROM users WHERE id = 5;
DELETE FROM llm_calls WHERE created_at < NOW() - INTERVAL '1 year';`,
        "**UPDATE/DELETE bina WHERE bilkul mat chalao** — pure table affect. Transaction me hamesha pehle SELECT karke verify."),
    ],
  },
  {
    topicSlug: "sql", slug: "filtering", order: 3,
    title: "WHERE, IN, LIKE, BETWEEN, NULL",
    summary: "Conditions in depth.",
    content: [
      C("sql",
`-- Comparison
WHERE age >= 18 AND age < 65
WHERE tier IN ('pro', 'enterprise')
WHERE tier NOT IN ('free')
WHERE created_at BETWEEN '2026-01-01' AND '2026-06-30'

-- Pattern match
WHERE email LIKE '%@gmail.com'         -- ends with
WHERE name LIKE 'A%'                   -- starts with
WHERE name ILIKE 'shah%'               -- case-insensitive (PostgreSQL)

-- NULL handling (NULL != anything, even NULL)
WHERE email IS NULL
WHERE email IS NOT NULL
WHERE email = NULL          -- WRONG, never matches

-- Regex (PostgreSQL)
WHERE email ~ '^[a-z]+@(gmail|yahoo)\\.com$'`,
        "`NULL` ka logic 3-valued (TRUE/FALSE/UNKNOWN). Hamesha `IS NULL` / `IS NOT NULL` use karo, `= NULL` kabhi nahi."),
    ],
  },
  {
    topicSlug: "sql", slug: "joins", order: 4,
    title: "JOINs — INNER, LEFT, RIGHT, FULL, CROSS",
    summary: "Multiple tables connect karna.",
    content: [
      C("sql",
`-- INNER JOIN — dono taraf match wali rows
SELECT u.name, c.model, c.cost_usd
FROM users u
INNER JOIN llm_calls c ON u.id = c.user_id;

-- LEFT JOIN — left ki sab rows, right me match na ho to NULL
SELECT u.name, COUNT(c.id) AS calls
FROM users u
LEFT JOIN llm_calls c ON u.id = c.user_id
GROUP BY u.id, u.name;
-- Includes users with 0 calls

-- RIGHT JOIN — right ki sab rows (kam use hota)
-- FULL OUTER JOIN — dono taraf ki sab rows

-- CROSS JOIN — cartesian product (A rows × B rows)
SELECT * FROM models CROSS JOIN tiers;

-- Self-join (employee/manager pattern)
SELECT e.name AS emp, m.name AS mgr
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;`,
        "Practical: LEFT JOIN + COUNT karne se 'users with 0 calls' bhi report me aayenge — pure INNER JOIN se woh miss ho jate."),
      H("JOIN performance tip"),
      L([
        "Join key par INDEX hona chahiye.",
        "Filter pehle (WHERE), join later — query planner usually optimize karta hai par CTE me sequence matters.",
        "Big × small me small ko in-memory hash banayega DB.",
      ]),
    ],
  },
  {
    topicSlug: "sql", slug: "aggregations", order: 5,
    title: "GROUP BY, HAVING, Aggregations",
    summary: "COUNT, SUM, AVG, MIN, MAX, percentile.",
    content: [
      C("sql",
`SELECT
  model,
  COUNT(*)                     AS total_calls,
  SUM(cost_usd)                AS total_cost,
  AVG(latency_ms)              AS avg_latency,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms) AS p95_latency,
  MAX(latency_ms)              AS max_latency
FROM llm_calls
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY model
HAVING SUM(cost_usd) > 10
ORDER BY total_cost DESC;`,
        "LLM monitoring dashboard ki backbone query. `HAVING` group level filter (`WHERE` row level). `PERCENTILE_CONT` p95/p99 latency standard practice."),
      H("COUNT(*) vs COUNT(col) vs COUNT(DISTINCT col)"),
      L([
        "`COUNT(*)` — total rows (NULL bhi gini).",
        "`COUNT(col)` — non-NULL values gini.",
        "`COUNT(DISTINCT col)` — unique non-NULL values.",
      ]),
    ],
  },
  {
    topicSlug: "sql", slug: "subqueries-ctes", order: 6,
    title: "Subqueries & CTEs (WITH)",
    summary: "Query ke andar query, readable form.",
    content: [
      H("Subquery (inline)"),
      C("sql",
`-- Average se zyada cost wale users
SELECT user_id, SUM(cost_usd) AS spent
FROM llm_calls
GROUP BY user_id
HAVING SUM(cost_usd) > (SELECT AVG(total) FROM (
  SELECT SUM(cost_usd) AS total FROM llm_calls GROUP BY user_id
) t);`,
        "Nested but unreadable. Production me CTE prefer karo."),
      H("CTE — Common Table Expression"),
      C("sql",
`WITH user_totals AS (
  SELECT user_id, SUM(cost_usd) AS spent
  FROM llm_calls
  GROUP BY user_id
),
avg_spend AS (
  SELECT AVG(spent) AS avg FROM user_totals
)
SELECT u.name, ut.spent
FROM user_totals ut
JOIN users u ON u.id = ut.user_id
WHERE ut.spent > (SELECT avg FROM avg_spend)
ORDER BY ut.spent DESC;`,
        "CTE = named subquery. Top-to-bottom readable, complex queries me lifesaver. Recursive CTE bhi possible (org hierarchies, graph traversal)."),
    ],
  },
  {
    topicSlug: "sql", slug: "window-functions", order: 7,
    title: "Window Functions (OVER)",
    summary: "Aggregate without collapsing rows — analytics ka king.",
    content: [
      C("sql",
`SELECT
  user_id,
  created_at,
  cost_usd,
  -- har user ke har row ke saath cumulative cost
  SUM(cost_usd) OVER (PARTITION BY user_id ORDER BY created_at) AS cum_cost,
  -- har user ke calls ka rank by cost
  RANK() OVER (PARTITION BY user_id ORDER BY cost_usd DESC) AS rk,
  -- previous call ka latency
  LAG(latency_ms) OVER (PARTITION BY user_id ORDER BY created_at) AS prev_latency,
  -- 7 row rolling average
  AVG(latency_ms) OVER (
    PARTITION BY user_id
    ORDER BY created_at
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS rolling_avg
FROM llm_calls;`,
        "Window function — group-wise calculation per row (group collapse nahi hota). `PARTITION BY` group define karta, `ORDER BY` sequence, frame clause (`ROWS BETWEEN`) window size."),
      H("Common window functions"),
      L([
        "`ROW_NUMBER()` — 1,2,3 (unique).",
        "`RANK()` — ties same rank, gap leaves (1,2,2,4).",
        "`DENSE_RANK()` — ties same rank, no gap (1,2,2,3).",
        "`LAG(col)` / `LEAD(col)` — previous/next row ka value.",
        "`FIRST_VALUE` / `LAST_VALUE` / `NTH_VALUE`.",
        "`PERCENT_RANK`, `CUME_DIST`, `NTILE(n)`.",
      ]),
      N("Top-N per group ka classic interview question — `ROW_NUMBER() OVER (PARTITION BY group ORDER BY metric DESC)` aur outer me `WHERE rn <= N`."),
    ],
  },
  {
    topicSlug: "sql", slug: "indexes", order: 8,
    title: "Indexes & Query Performance",
    summary: "Query fast banane ka tool #1.",
    content: [
      T("Index = column par lookup structure (usually B-tree). Book ke index jaisa — pehle index dekho, phir actual page pe jao. Sequential scan se 10-1000x fast for selective queries."),
      C("sql",
`-- Single column
CREATE INDEX idx_users_email ON users(email);

-- Composite (multi-column) — order matters!
CREATE INDEX idx_calls_user_date ON llm_calls(user_id, created_at);

-- Unique
CREATE UNIQUE INDEX uniq_users_email ON users(email);

-- Partial (subset only — smaller, faster)
CREATE INDEX idx_active ON users(email) WHERE deleted_at IS NULL;

-- Functional / expression
CREATE INDEX idx_lower_email ON users(LOWER(email));

-- Drop
DROP INDEX idx_users_email;`,
        "Composite index me leading column ka use hona chahiye query me — `(a,b)` index `WHERE a=X` me chalega, but `WHERE b=Y` me nahi."),
      H("EXPLAIN — query plan dekho"),
      C("sql",
`EXPLAIN ANALYZE
SELECT * FROM llm_calls WHERE user_id = 42 AND created_at > NOW() - INTERVAL '1 day';

-- Output me dekho:
-- Index Scan vs Seq Scan
-- Actual rows vs estimate
-- Total cost`,
        "Production me slow query = `EXPLAIN ANALYZE` dekho pehle. Seq Scan on big table = index missing/unused."),
      N("Index trade-off: SELECT fast, INSERT/UPDATE slow + extra disk. Sirf un columns par index jin pe WHERE/JOIN/ORDER BY frequent hai."),
    ],
  },
  {
    topicSlug: "sql", slug: "transactions", order: 9,
    title: "Transactions & ACID",
    summary: "Multi-step ops atomically.",
    content: [
      C("sql",
`BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- Sab thik hai
COMMIT;

-- Ya
ROLLBACK;     -- saara undo`,
        "Transaction me sab statements ek atomic unit hain — sab succeed ya sab fail. Bank transfer, double-write to DB+queue jaisa pattern."),
      H("ACID — DB ki guarantee"),
      L([
        "**A**tomicity — all-or-nothing.",
        "**C**onsistency — constraints (FK, UNIQUE, CHECK) hamesha valid.",
        "**I**solation — concurrent txns ek dusre ko affect na karein.",
        "**D**urability — commit hone par data permanent (disk pe).",
      ]),
      H("Isolation levels (PostgreSQL)"),
      L([
        "Read Uncommitted (PostgreSQL me Read Committed se kam nahi).",
        "Read Committed — default. Only committed reads.",
        "Repeatable Read — same query repeat karoge to same result.",
        "Serializable — strictest, lock heavy.",
      ]),
    ],
  },
  {
    topicSlug: "sql", slug: "advanced", order: 10,
    title: "Advanced — JSON, Upsert, Generated Cols",
    summary: "Modern Postgres features AI workloads me useful.",
    content: [
      H("JSON / JSONB (PostgreSQL)"),
      C("sql",
`CREATE TABLE prompts (
  id SERIAL PRIMARY KEY,
  meta JSONB
);

INSERT INTO prompts (meta) VALUES
  ('{"model":"gpt-4", "temp":0.7, "tags":["rag","chatbot"]}');

-- Extract
SELECT meta->>'model' AS model FROM prompts;        -- text
SELECT meta->'temp' AS temp FROM prompts;           -- json
SELECT meta @> '{"model":"gpt-4"}' FROM prompts;    -- contains
SELECT * FROM prompts WHERE meta @> '{"tags":["rag"]}';

-- Index on JSON
CREATE INDEX idx_meta ON prompts USING GIN (meta);`,
        "Semi-structured data (LLM responses, configs) JSON me store karna — schema flexibility + queryable."),
      H("UPSERT (INSERT ON CONFLICT)"),
      C("sql",
`INSERT INTO users (email, name) VALUES ('ali@x.com', 'Ali')
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name, updated_at = NOW();`,
        "Insert ya update — atomically. Idempotent seed/ingestion scripts ke liye perfect."),
      H("Generated Columns"),
      C("sql",
`CREATE TABLE products (
  price NUMERIC,
  tax_rate NUMERIC,
  total NUMERIC GENERATED ALWAYS AS (price * (1 + tax_rate)) STORED
);`,
        "Computed values DB level pe — application bug se inconsistency nahi hogi."),
    ],
  },
  {
    topicSlug: "sql", slug: "pgvector", order: 11,
    title: "pgvector — Vector Search in Postgres",
    summary: "RAG ke liye Postgres me embeddings store + search.",
    content: [
      T("pgvector PostgreSQL extension hai jo vector column + nearest neighbour search add karta hai. Dedicated vector DB (Pinecone/Weaviate) ka alternative — existing Postgres me hi sab kuch."),
      C("sql",
`CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id        BIGSERIAL PRIMARY KEY,
  content   TEXT,
  embedding VECTOR(1536)     -- OpenAI text-embedding-3-small dim
);

-- Insert (Python se aayega embedding)
INSERT INTO documents (content, embedding)
VALUES ('AI is the future', '[0.012, -0.34, ...]');

-- Nearest neighbour search (cosine distance)
SELECT id, content, 1 - (embedding <=> '[0.01, ...]') AS similarity
FROM documents
ORDER BY embedding <=> '[0.01, ...]'
LIMIT 5;

-- Index for speed (HNSW — best for accuracy/speed tradeoff)
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);`,
        "Operators: `<->` L2, `<=>` cosine distance, `<#>` inner product. HNSW index 10-100x faster than brute force."),
      N("Production RAG architectures: Postgres + pgvector hi enough hai 10M docs tak. Beyond that → dedicated vector DB."),
    ],
  },
];

export const interview = [
  { topicSlug: "sql", order: 1, difficulty: "easy",
    question: "WHERE vs HAVING?",
    answer: "WHERE row-level filter (GROUP BY ke pehle). HAVING aggregated groups filter (GROUP BY ke baad). HAVING me aggregates use kar sakte (SUM, COUNT), WHERE me nahi." },
  { topicSlug: "sql", order: 2, difficulty: "easy",
    question: "INNER vs LEFT JOIN?",
    answer: "INNER → dono taraf match wali rows hi. LEFT → left ki saari rows + matched right (na ho to NULL). Practical: 'users with 0 orders' chahiye to LEFT JOIN + COUNT use karo." },
  { topicSlug: "sql", order: 3, difficulty: "easy",
    question: "NULL = NULL — TRUE ya FALSE?",
    answer: "Neither — UNKNOWN. NULL kisi se equal nahi (even NULL). Isliye `IS NULL` / `IS NOT NULL` use karo, `= NULL` kabhi nahi." },
  { topicSlug: "sql", order: 4, difficulty: "medium",
    question: "Subquery vs CTE — kab kya?",
    answer:
`• Subquery — chhoti, inline, ek baar use.
• CTE (WITH) — named, multiple references, recursive support, readable.
Big queries me CTE prefer karo. Postgres me CTE optimization fence remove ho gaya 12+, so performance same.` },
  { topicSlug: "sql", order: 5, difficulty: "medium",
    question: "Top-N per group kaise nikaloge?",
    answer:
`WITH ranked AS (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY category ORDER BY sales DESC
  ) AS rn
  FROM products
)
SELECT * FROM ranked WHERE rn <= 3;
Window function ka classic use case.` },
  { topicSlug: "sql", order: 6, difficulty: "medium",
    question: "Composite index me column order matter karta?",
    answer: "Haan. `(a, b)` index `WHERE a=X` ya `WHERE a=X AND b=Y` me chalega — par `WHERE b=Y` me nahi. Most selective column first me daalo. PostgreSQL me 'leftmost prefix' rule." },
  { topicSlug: "sql", order: 7, difficulty: "medium",
    question: "Normalization (1NF/2NF/3NF) ka basic?",
    answer:
`• 1NF — atomic values (no arrays/repeating groups in cells).
• 2NF — 1NF + non-key columns full PK pe depend karein (composite PK me partial dependency nahi).
• 3NF — 2NF + non-key columns kisi aur non-key pe depend na karein (transitive).
Analytics/warehousing me denormalize bhi karte hain speed ke liye.` },
  { topicSlug: "sql", order: 8, difficulty: "hard",
    question: "Window function vs GROUP BY — difference?",
    answer:
`GROUP BY rows ko collapse karta hai, ek group ek row.
Window function rows preserve karta hai, har row ke saath aggregate calculation attach karta hai (PARTITION BY se group define).
SELECT user, cost,
  AVG(cost) OVER (PARTITION BY user) AS user_avg
har row ke saath user-level avg dikha dega.` },
  { topicSlug: "sql", order: 9, difficulty: "hard",
    question: "N+1 query problem aur fix?",
    answer:
`Loop me parent fetch karke har parent ke liye separate child query → 1+N queries.
Fix:
• JOIN ya WHERE child IN (parent_ids) — ek query me sab.
• ORM me 'eager load' / 'prefetch' use karo (SQLAlchemy joinedload, Django select_related/prefetch_related).` },
  { topicSlug: "sql", order: 10, difficulty: "hard",
    question: "Index hone par bhi query slow ho to?",
    answer:
`EXPLAIN ANALYZE dekho. Common reasons:
• Column par function (WHERE LOWER(email)=...) → index unused. Functional index banao.
• Type mismatch (string column par int compare).
• OR conditions (har side index nahi).
• Selectivity low (90% rows match → seq scan faster).
• Stats stale → ANALYZE table.
• Composite index ka leading col use nahi.` },
  { topicSlug: "sql", order: 11, difficulty: "hard",
    question: "ACID kya hai? Real example?",
    answer:
`Atomicity — multi-step txn all-or-nothing.
Consistency — constraints (FK, CHECK, UNIQUE) always valid.
Isolation — concurrent txns each other ko affect na karein.
Durability — commit ke baad data permanent (crash bhi survive).
Bank transfer A→B (debit + credit) atomic chahiye — ek fail to dono undo.` },
];
