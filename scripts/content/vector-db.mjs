import { T, H, C, N, L } from "./_helpers.mjs";

export const topic = {
  slug: "vector-db",
  title: "Vector DBs & Embeddings",
  description:
    "Semantic search ka foundation. Embeddings, similarity, ANN indexes, FAISS / Chroma / Pinecone / pgvector / Qdrant.",
  icon: "🧬",
  color: "#06b6d4",
  order: 13,
};

export const sections = [
  {
    topicSlug: "vector-db", slug: "embeddings-intro", order: 1,
    title: "Embeddings kya hain?",
    summary: "Text → vector, semantic meaning capture.",
    content: [
      T("**Embedding** = text (ya image/audio) ko fixed-size vector me convert karna jo uska *meaning* numerically represent kare. Similar meanings → similar vectors (high cosine similarity)."),
      C("text",
`"king" - "man" + "woman" ≈ "queen"

Embeddings me ye math sahi nikalti hai — concepts space me directions ban jate.`,
        "Famous word2vec example. Modern transformer embeddings sentence-level ye property rakhte."),
      C("python",
`from openai import OpenAI
client = OpenAI()

resp = client.embeddings.create(
    model="text-embedding-3-small",
    input=["Cricket is a sport", "Cricket is an insect", "I love cricket matches"]
)

vectors = [d.embedding for d in resp.data]
# Each vector: 1536 floats

# Similar topics ke embeddings cosine similarity zyada hogi
import numpy as np
def cosine(a, b):
    a, b = np.array(a), np.array(b)
    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))

print(cosine(vectors[0], vectors[2]))   # high (~0.6+) — both about sport
print(cosine(vectors[0], vectors[1]))   # low — different meaning of 'cricket'`,
        "Modern embedding models 'cricket' word ki context se meaning samajhte — disambiguate karte sport vs insect."),
      H("Common embedding models"),
      L([
        "**OpenAI** `text-embedding-3-small` (1536d, $0.02/1M tokens, fast).",
        "**OpenAI** `text-embedding-3-large` (3072d, better quality).",
        "**Cohere** `embed-multilingual-v3` (multilingual top tier).",
        "**Open source** — `sentence-transformers/all-MiniLM-L6-v2` (free, run locally).",
        "**Open source large** — `BAAI/bge-large-en-v1.5` (very high quality, ~1GB).",
      ]),
    ],
  },
  {
    topicSlug: "vector-db", slug: "similarity", order: 2,
    title: "Similarity Metrics",
    summary: "Cosine, Euclidean, Dot product.",
    content: [
      L([
        "**Cosine similarity** — angle measure, normalized magnitude. Range [-1, 1], higher = closer. Most common for text.",
        "**Euclidean (L2)** distance — straight-line distance. Lower = closer. Sensitive to magnitude.",
        "**Dot product** — fast if vectors are L2-normalized (then = cosine). Used by FAISS, OpenAI internally.",
      ]),
      C("python",
`import numpy as np

a = np.array([0.1, 0.5, 0.3, 0.2])
b = np.array([0.2, 0.4, 0.3, 0.1])

# Cosine similarity
cos = (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Euclidean distance
l2 = np.linalg.norm(a - b)

# Dot product (works only on normalized vectors)
dot = a @ b`,
        "OpenAI embeddings already L2-normalized hain — dot product cosine ke equivalent (faster compute)."),
    ],
  },
  {
    topicSlug: "vector-db", slug: "ann-indexes", order: 3,
    title: "ANN Indexes — HNSW, IVF, Brute Force",
    summary: "Millions me search fast karne ka tarika.",
    content: [
      T("100 vectors me brute-force similarity calc fast hai. 10 million me? Per query 10s+ — unusable. ANN (Approximate Nearest Neighbour) indexes 100-1000x faster, 95-99% accurate (recall)."),
      H("Common index types"),
      L([
        "**Flat (brute force)** — har query har vector se compare. Slow but 100% accurate. <100K vectors me ok.",
        "**HNSW** — graph-based, layered. Best speed/recall trade-off. Industry standard 2024+.",
        "**IVF (Inverted File)** — k-means clustering, query nearest clusters scan. Fast indexing, ok recall.",
        "**IVF + PQ (Product Quantization)** — memory compression, billions of vectors fit on small hardware.",
      ]),
      H("Trade-offs"),
      L([
        "**Recall** — top-K retrieve karne pe true top-K ka kitna match (kitne sahi).",
        "**Query latency** — single query me time.",
        "**Build time + memory** — index construction.",
      ]),
      N("HNSW default choice hai start me. Tune `ef_construction` (build quality) aur `ef` (search quality)."),
    ],
  },
  {
    topicSlug: "vector-db", slug: "faiss", order: 4,
    title: "FAISS — Facebook's Library",
    summary: "Local/in-memory vector search, fast.",
    content: [
      C("bash", "pip install faiss-cpu   # or faiss-gpu for CUDA"),
      C("python",
`import faiss
import numpy as np

d = 1536    # embedding dim
nb = 10000  # database vectors

# Random data for demo
embeddings = np.random.randn(nb, d).astype("float32")

# Build index — Flat (brute force, 100% accurate)
index = faiss.IndexFlatL2(d)
index.add(embeddings)

# Search
query = np.random.randn(1, d).astype("float32")
k = 5
distances, indices = index.search(query, k)
print(indices[0])    # top-5 IDs
print(distances[0])  # distances

# For cosine similarity → normalize vectors + use IndexFlatIP
faiss.normalize_L2(embeddings)
index = faiss.IndexFlatIP(d)   # Inner Product
index.add(embeddings)`,
        "FAISS in-memory hai — restart me data gone. Production me persistence wrapper (Chroma, Qdrant) ya manual save/load."),
      H("HNSW index (fast at scale)"),
      C("python",
`# M = neighbours per node, ef = exploration depth
index = faiss.IndexHNSWFlat(d, M=32)
index.hnsw.efConstruction = 200
index.hnsw.efSearch = 50
index.add(embeddings)
distances, indices = index.search(query, k)

# Save/load
faiss.write_index(index, "my_index.faiss")
index = faiss.read_index("my_index.faiss")`,
        "HNSW 1M vectors me <10ms query latency easily. Production-grade RAG ka backbone."),
    ],
  },
  {
    topicSlug: "vector-db", slug: "chroma", order: 5,
    title: "ChromaDB — Easy Local Vector DB",
    summary: "Persistence, metadata filtering, in-process.",
    content: [
      C("bash", "pip install chromadb"),
      C("python",
`import chromadb

# Local persistent client
client = chromadb.PersistentClient(path="./chroma_db")

# Create / get collection
collection = client.get_or_create_collection(
    name="docs",
    metadata={"hnsw:space": "cosine"}   # cosine, l2, ip
)

# Add documents (Chroma embed karta auto — sentence-transformers default)
collection.add(
    ids=["1", "2", "3"],
    documents=[
        "AI is transforming healthcare",
        "Python is great for data science",
        "Cooking is an art form",
    ],
    metadatas=[
        {"topic": "ai", "year": 2024},
        {"topic": "programming", "year": 2023},
        {"topic": "lifestyle", "year": 2024},
    ],
)

# Query — semantic search
results = collection.query(
    query_texts=["machine learning in medicine"],
    n_results=2,
    where={"year": 2024},     # metadata filter
)
print(results["documents"])`,
        "Chroma ka killer feature: text de do, embedding khud generate karta hai. Local dev/prototypes ke liye perfect."),
      H("With custom embeddings (OpenAI)"),
      C("python",
`from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction

openai_ef = OpenAIEmbeddingFunction(
    api_key="sk-...",
    model_name="text-embedding-3-small",
)

collection = client.get_or_create_collection(
    name="docs",
    embedding_function=openai_ef,
)`),
    ],
  },
  {
    topicSlug: "vector-db", slug: "qdrant", order: 6,
    title: "Qdrant — Production-Grade Open Source",
    summary: "Rust-based, fast, filtering, REST/gRPC API.",
    content: [
      C("bash",
`# Docker se run (recommended)
docker run -p 6333:6333 -v qdrant_data:/qdrant/storage qdrant/qdrant

pip install qdrant-client`),
      C("python",
`from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

client = QdrantClient("localhost", port=6333)

# Collection create
client.create_collection(
    collection_name="docs",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
)

# Upsert points
client.upsert(
    collection_name="docs",
    points=[
        PointStruct(id=1, vector=embedding_1, payload={"topic": "ai", "text": "..."}),
        PointStruct(id=2, vector=embedding_2, payload={"topic": "ml", "text": "..."}),
    ]
)

# Search with filter
from qdrant_client.models import Filter, FieldCondition, MatchValue
results = client.search(
    collection_name="docs",
    query_vector=query_embedding,
    query_filter=Filter(
        must=[FieldCondition(key="topic", match=MatchValue(value="ai"))]
    ),
    limit=5,
)
for hit in results:
    print(hit.id, hit.score, hit.payload)`,
        "Qdrant strong production choice. Self-host free, cloud version available. Strong filtering, snapshots, replication."),
    ],
  },
  {
    topicSlug: "vector-db", slug: "pgvector", order: 7,
    title: "pgvector — Postgres me Vector Search",
    summary: "Existing Postgres infra me embeddings add karo.",
    content: [
      T("pgvector extension PostgreSQL me vector column + ANN search add karta. **Existing Postgres me hi RAG kar sakte** — separate vector DB ki zarurat nahi (10M vectors tak)."),
      C("sql",
`CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id          BIGSERIAL PRIMARY KEY,
  content     TEXT,
  metadata    JSONB,
  embedding   VECTOR(1536)
);

-- HNSW index (fast ANN)
CREATE INDEX ON documents
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Search top-5 similar + filter
SELECT id, content, 1 - (embedding <=> $1::vector) AS similarity
FROM documents
WHERE metadata->>'topic' = 'ai'
ORDER BY embedding <=> $1::vector
LIMIT 5;`,
        "Operators: `<->` L2, `<=>` cosine distance, `<#>` negative inner product. Standard SQL me kaam — joins, transactions, backups sab familiar."),
      C("python",
`import psycopg2
from pgvector.psycopg2 import register_vector

conn = psycopg2.connect("postgresql://...")
register_vector(conn)

with conn.cursor() as cur:
    cur.execute("""
        SELECT id, content
        FROM documents
        WHERE metadata @> %s
        ORDER BY embedding <=> %s
        LIMIT 5
    """, (json.dumps({"topic": "ai"}), query_embedding))
    for row in cur:
        print(row)`,
        "Python me `pgvector` package se direct numpy arrays pass kar sakte ho."),
      N("Best of both worlds — relational + vector in one DB. Transactions me hi update karo embeddings + metadata together."),
    ],
  },
  {
    topicSlug: "vector-db", slug: "pinecone", order: 8,
    title: "Pinecone — Managed Cloud",
    summary: "Serverless, pay-per-use, scale automatic.",
    content: [
      C("bash", "pip install pinecone"),
      C("python",
`from pinecone import Pinecone, ServerlessSpec

pc = Pinecone(api_key="...")

# Create index (one-time)
pc.create_index(
    name="docs",
    dimension=1536,
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1"),
)

index = pc.Index("docs")

# Upsert
index.upsert(vectors=[
    {"id": "1", "values": embedding_1, "metadata": {"topic": "ai"}},
    {"id": "2", "values": embedding_2, "metadata": {"topic": "ml"}},
])

# Query
result = index.query(
    vector=query_embedding,
    top_k=5,
    filter={"topic": "ai"},
    include_metadata=True,
)
for match in result.matches:
    print(match.id, match.score, match.metadata)`,
        "Pinecone managed hai — no infra, auto-scale. Cost is per-vector-per-month. Quick start ke liye, par lock-in aur cost considerations."),
    ],
  },
  {
    topicSlug: "vector-db", slug: "choosing", order: 9,
    title: "Kaunsa Vector DB Choose Karein?",
    summary: "Decision matrix.",
    content: [
      L([
        "**FAISS** — Library, in-memory, local. Best for: small/medium static datasets, research.",
        "**Chroma** — Easy local persistent. Best for: prototypes, dev, small apps.",
        "**Qdrant** — Production open-source. Best for: self-hosted, full control, performance.",
        "**Weaviate** — Similar to Qdrant, hybrid search built-in. Best for: graph + vector combos.",
        "**pgvector** — Postgres extension. Best for: existing Postgres infra, <10M vectors, transactional needs.",
        "**Pinecone** — Managed cloud. Best for: skip infra, fast scaling, willing to pay.",
        "**Milvus** — Enterprise scale (billions of vectors). Best for: very large scale.",
      ]),
      H("Quick decision tree"),
      L([
        "Prototype / <100K vectors → **Chroma** ya **FAISS**.",
        "Existing Postgres + <10M vectors → **pgvector**.",
        "Production, full control, >1M vectors → **Qdrant**.",
        "Don't want infra hassle → **Pinecone**.",
        "Billions of vectors → **Milvus** ya managed (Pinecone, Zilliz).",
      ]),
    ],
  },
];

export const interview = [
  { topicSlug: "vector-db", order: 1, difficulty: "easy",
    question: "Embedding kya hai?",
    answer: "Text/image ko fixed-size vector me convert karna jo semantic meaning capture kare. Similar meanings → close vectors (high cosine similarity). RAG, semantic search, classification — sab ka foundation." },
  { topicSlug: "vector-db", order: 2, difficulty: "easy",
    question: "Cosine vs Euclidean — kab kya?",
    answer: "Cosine — angle measure, magnitude ignore. Text embeddings me standard (magnitude meaningless usually). Euclidean — straight-line distance, magnitude matter karta. Image features me sometimes preferred. OpenAI embeddings already normalized — dot product = cosine." },
  { topicSlug: "vector-db", order: 3, difficulty: "medium",
    question: "ANN vs exact search?",
    answer: "Exact (brute force) — har vector compare, 100% recall but slow at scale (>100K). ANN (HNSW/IVF) — approximate, 95-99% recall but 100-1000x faster. Production me ANN standard. Trade-off: recall vs latency vs memory, tune kar sakte." },
  { topicSlug: "vector-db", order: 4, difficulty: "medium",
    question: "HNSW kya hai?",
    answer: "Hierarchical Navigable Small World — graph-based ANN index. Layers me organize vectors, har layer me edges connect similar vectors. Search top layer se start hota, gradually drill down. Best speed/recall trade-off. Params: M (edges per node), ef_construction (build), ef (search)." },
  { topicSlug: "vector-db", order: 5, difficulty: "medium",
    question: "10M docs ke liye vector DB choose karoge to?",
    answer:
`Decision factors:
• Existing Postgres? → pgvector (transactional, free, simple).
• Self-host capacity? → Qdrant ya Weaviate.
• Skip infra? → Pinecone (managed, costs more).
For 10M scale all the above viable. Beyond 100M → Milvus or specialized.` },
  { topicSlug: "vector-db", order: 6, difficulty: "hard",
    question: "Embedding model production me kaise choose?",
    answer:
`Factors:
• Quality (MTEB benchmark scores).
• Dimension (storage cost — 1536 vs 3072).
• Cost (API per-token vs self-host compute).
• Latency (managed API call vs local inference).
• Multilingual support (Cohere strong here).
• Domain-specific fine-tunes (medical, legal).
Default safe choice: OpenAI text-embedding-3-small (cheap, good quality, 1536d).` },
  { topicSlug: "vector-db", order: 7, difficulty: "hard",
    question: "Embeddings update kaise handle? Old vectors stale ho jate to?",
    answer:
`• New model release → re-embed full corpus, swap atomically (blue-green collection).
• Version tag embeddings: model_v1 / model_v2. Query both during transition.
• Cost: re-embed millions of docs mehnga. Schedule maintenance windows.
• Don't mix embeddings from different models in same index — distances meaningless.` },
];
