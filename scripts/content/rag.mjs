import { T, H, C, N, L } from "./_helpers.mjs";

export const topic = {
  slug: "rag",
  title: "RAG (Retrieval Augmented Generation)",
  description:
    "LLM ko external knowledge se augment karna. Document Q&A, chatbots, knowledge assistants ka core architecture.",
  icon: "🔍",
  color: "#f59e0b",
  order: 14,
};

export const sections = [
  {
    topicSlug: "rag", slug: "introduction", order: 1,
    title: "RAG kya hai aur kyu?",
    summary: "LLM + external knowledge = grounded answers.",
    content: [
      T("**RAG** = Retrieval Augmented Generation. Pure LLM problems:"),
      L([
        "**Knowledge cutoff** — model ka training data old (months/years pehle).",
        "**Hallucination** — model confidently galat facts banake bolta.",
        "**Private data** — company internal docs LLM ko nahi pata.",
        "**Source verification** — kaise pata 'kahan se' answer aaya?",
      ]),
      T("RAG ka solution: query par relevant documents retrieve karo, LLM ko context ke saath de do."),
      C("text",
`# Pure LLM
User: "Company X ki Q3 revenue kya thi?"
LLM:  "I don't have that information" / hallucinated number

# RAG
User: "Company X ki Q3 revenue kya thi?"
1. Search docs → find Q3 earnings report
2. LLM context: [Q3 report chunks] + user query
3. LLM: "Per the Q3 report, revenue was $45M [source: q3_report.pdf]"`,
        "Knowledge fresh, hallucination kam, citations possible."),
      H("RAG Pipeline (high level)"),
      L([
        "1. **Ingestion** — docs load, chunk, embed, store in vector DB.",
        "2. **Retrieval** — query embed, top-K similar chunks fetch.",
        "3. **Augmentation** — chunks ko prompt me inject.",
        "4. **Generation** — LLM context+query se answer generate.",
      ]),
    ],
  },
  {
    topicSlug: "rag", slug: "ingestion", order: 2,
    title: "Document Ingestion",
    summary: "Load → clean → chunk → embed → store.",
    content: [
      H("1) Load — file types"),
      C("python",
`# Common loaders (LangChain / LlamaIndex)
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    WebBaseLoader,
    UnstructuredHTMLLoader,
)

# PDF
docs = PyPDFLoader("manual.pdf").load()

# Web
docs = WebBaseLoader("https://example.com/blog").load()

# Multiple files
from langchain_community.document_loaders import DirectoryLoader
docs = DirectoryLoader("./docs", glob="**/*.md").load()`,
        "Each doc = `{page_content, metadata}`. Metadata me file name, page, URL — citations ke kaam aata."),
      H("2) Chunk — text ko pieces me todo"),
      C("python",
`from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,       # ~250-300 tokens
    chunk_overlap=200,     # context preserve
    separators=["\\n\\n", "\\n", ". ", " ", ""],
)
chunks = splitter.split_documents(docs)`,
        "Chunk size trade-off: chhota → fine-grained match, lekin context lose. Bada → context maintained, but irrelevant info bhi. Sweet spot: 500-1500 chars / 100-300 tokens."),
      H("3) Embed + Store"),
      C("python",
`from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

vectorstore = Chroma.from_documents(
    chunks,
    embedding=embeddings,
    persist_directory="./chroma_db",
    collection_name="company_docs",
)`,
        "Ek line me embed + store. Production me batch karke embedding API costs control."),
    ],
  },
  {
    topicSlug: "rag", slug: "chunking-strategies", order: 3,
    title: "Chunking Strategies",
    summary: "Smart chunking RAG quality ka biggest lever.",
    content: [
      H("1) Fixed-size (character/token)"),
      T("Simple, fast. Problem: sentences/paragraphs midway tut jate."),
      H("2) Recursive (separator hierarchy)"),
      T("Try paragraph break first, then sentence, then word. **Default safe choice.**"),
      H("3) Markdown / Code aware"),
      C("python",
`from langchain.text_splitter import MarkdownHeaderTextSplitter

headers_to_split_on = [
    ("#", "h1"),
    ("##", "h2"),
    ("###", "h3"),
]
splitter = MarkdownHeaderTextSplitter(headers_to_split_on)
chunks = splitter.split_text(md_content)
# Har chunk ka metadata me parent headings preserve hota`,
        "Documentation/structured content me semantic boundaries pe split — far better retrieval."),
      H("4) Semantic chunking"),
      T("Embeddings ke similarity se boundaries decide. Sentences ke embeddings nikalo, jahan large drop mile waha break. Slow but high quality."),
      H("5) Sentence window / Parent-Child"),
      L([
        "**Sentence window** — embed single sentence, retrieve me usse aage-piche ki sentences bhi attach.",
        "**Parent-child** — chhote chunks embed (precise match), parent (bigger context) retrieve me return.",
      ]),
      N("Generic rule: docs structured (markdown/HTML) → header-aware splitter. Plain text → recursive. Code → language-aware."),
    ],
  },
  {
    topicSlug: "rag", slug: "retrieval", order: 4,
    title: "Retrieval — Query → Relevant Chunks",
    summary: "Top-K, hybrid search, reranking.",
    content: [
      H("Basic semantic retrieval"),
      C("python",
`query = "Company ka leave policy kya hai?"
results = vectorstore.similarity_search(query, k=5)
for r in results:
    print(r.page_content[:200], r.metadata)`,
        "Query bhi embed hoti hai, top-K nearest chunks return."),
      H("Hybrid search — Semantic + Keyword (BM25)"),
      C("python",
`# Sirf semantic se exact keywords miss ho sakte (e.g., product code)
# BM25 = traditional keyword scoring
from langchain.retrievers import BM25Retriever, EnsembleRetriever

bm25 = BM25Retriever.from_documents(chunks)
bm25.k = 5

vec_retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

# Combine — 50/50 weight
hybrid = EnsembleRetriever(
    retrievers=[bm25, vec_retriever],
    weights=[0.5, 0.5],
)
results = hybrid.invoke(query)`,
        "Hybrid search 10-20% better recall — exact terms (product codes, names) BM25 catch karta, semantic embeddings concepts."),
      H("Reranking — top-K se best-K"),
      C("python",
`# Retrieve top-20, rerank, return top-5
from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

candidates = vectorstore.similarity_search(query, k=20)
pairs = [(query, c.page_content) for c in candidates]
scores = reranker.predict(pairs)

ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)
top_5 = [c for c, _ in ranked[:5]]`,
        "Reranker cross-encoder embedding se behtar relevance scoring deta — slow but high quality. Production RAG ka standard 2024+. Cohere/Voyage AI managed rerankers bhi popular."),
      H("Query transformation"),
      L([
        "**HyDE** — Hypothetical answer generate karo, usko embed karo, search karo. User query short ho to helpful.",
        "**Multi-query** — LLM se 3-5 alternate phrasings generate, sab se search, union return.",
        "**Step-back** — abstract version of query generate, broader context retrieve.",
      ]),
    ],
  },
  {
    topicSlug: "rag", slug: "generation", order: 5,
    title: "Generation — LLM se Answer Banao",
    summary: "Prompt design, citations, hallucination defense.",
    content: [
      C("python",
`from openai import OpenAI

client = OpenAI()

def rag_answer(query, retrieved_chunks):
    context = "\\n\\n".join([
        f"[doc:{i}] {c.page_content}\\n(source: {c.metadata.get('source')})"
        for i, c in enumerate(retrieved_chunks, 1)
    ])

    system = """Tu ek RAG assistant hai.
Rules:
1. ONLY use the provided context to answer.
2. Agar context me answer nahi hai → 'Mere paas is sawal ka answer nahi hai.' bolo.
3. Har claim ke baad source cite karo [doc:N] format me.
4. Hinglish me concise jawab do."""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": f"Context:\\n{context}\\n\\nQuestion: {query}"},
        ],
        temperature=0.1,
    )
    return response.choices[0].message.content`,
        "Strict prompt + low temperature = grounded, citable answers. Hallucination 80%+ reduce hoti."),
    ],
  },
  {
    topicSlug: "rag", slug: "advanced-rag", order: 6,
    title: "Advanced RAG Patterns",
    summary: "Production techniques.",
    content: [
      H("1) Multi-step / Iterative RAG"),
      T("Single retrieval enough nahi ho to LLM follow-up questions banake multiple retrievals chalata."),
      H("2) HyDE (Hypothetical Document Embeddings)"),
      C("python",
`# Step 1: LLM se hypothetical answer
hyp = llm("Generate a likely answer paragraph for: " + query)
# Step 2: Hypothetical answer embed karo (not query itself)
hyp_emb = embed(hyp)
# Step 3: Search with hyp_emb
results = vector_db.search(hyp_emb, k=5)`,
        "Short queries (1-3 words) ke liye especially helpful — query-document semantic gap bridges."),
      H("3) Self-RAG / Corrective RAG"),
      T("Retrieve karne ke baad LLM khud judge kare ki chunks relevant hain ya nahi. Nahi to query reformulate ya web search fallback."),
      H("4) Contextual Retrieval (Anthropic)"),
      C("python",
`# Har chunk ko store karne se pehle LLM se context add karo
def add_context(chunk, full_doc):
    return llm(f"""Document: {full_doc}
Chunk: {chunk}
Generate 1-2 sentences explaining what this chunk is about
in the context of the full document. Output only the contextualized chunk.""")

contextualized = [add_context(c, doc) for c in chunks]
# Phir embed + store`,
        "Anthropic ka 2024 finding — chunk pe document-level context add karne se retrieval accuracy 35-50% improve hoti."),
      H("5) Graph RAG"),
      T("Documents se entities + relations extract karke knowledge graph. Hybrid: graph traversal + vector search. Complex queries (multi-hop) me bahut better."),
    ],
  },
  {
    topicSlug: "rag", slug: "full-example", order: 7,
    title: "Full Example — End-to-End RAG",
    summary: "Production-ready FastAPI RAG service.",
    content: [
      C("python",
`# rag.py
from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# ---- INGEST (one-time) ----
def ingest():
    docs = DirectoryLoader("./docs", glob="**/*.md").load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(docs)
    Chroma.from_documents(
        chunks,
        embedding=OpenAIEmbeddings(model="text-embedding-3-small"),
        persist_directory="./chroma_db",
    )

# ---- QUERY ----
def get_chain():
    db = Chroma(persist_directory="./chroma_db",
                embedding_function=OpenAIEmbeddings(model="text-embedding-3-small"))
    retriever = db.as_retriever(search_kwargs={"k": 5})

    prompt = ChatPromptTemplate.from_template("""
Context:
{context}

Question: {question}

Answer in Hinglish, concise. Cite sources as [doc:N].
If context lacks answer, say: 'Mere paas iska answer nahi hai.'
    """)

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)

    def format_docs(docs):
        return "\\n\\n".join(
            f"[doc:{i+1}] {d.page_content}" for i, d in enumerate(docs))

    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt | llm | StrOutputParser()
    )
    return chain

# main.py
from fastapi import FastAPI
from pydantic import BaseModel
app = FastAPI()
chain = get_chain()

class Q(BaseModel):
    question: str

@app.post("/ask")
def ask(q: Q):
    return {"answer": chain.invoke(q.question)}`,
        "Real production RAG api — ingestion separate, query chain reusable, FastAPI endpoint. LCEL (LangChain Expression Language) se pipeline declarative."),
    ],
  },
  {
    topicSlug: "rag", slug: "evaluation", order: 8,
    title: "RAG Evaluation",
    summary: "Quality measure karo systematically.",
    content: [
      L([
        "**Retrieval metrics** — Recall@K, MRR, NDCG (gold relevant docs ke against).",
        "**Faithfulness** — answer me kya kya context-supported hai (LLM judge se).",
        "**Answer relevance** — query ke kitna fit hai.",
        "**Context precision/recall** — retrieved chunks me relevant + sab relevant retrieved?",
        "**Latency, cost** — production metrics.",
      ]),
      C("python",
`# RAGAS — popular RAG eval framework
from ragas import evaluate
from ragas.metrics import (
    faithfulness, answer_relevancy,
    context_precision, context_recall,
)

dataset = [...]   # question, ground_truth, answer, contexts

result = evaluate(
    dataset=dataset,
    metrics=[faithfulness, answer_relevancy,
             context_precision, context_recall],
)`,
        "RAGAS / DeepEval / Phoenix — open source RAG eval libraries. Production me chalate har release pe."),
    ],
  },
];

export const interview = [
  { topicSlug: "rag", order: 1, difficulty: "easy",
    question: "RAG kyu? Pure LLM kyu kafi nahi?",
    answer:
`Pure LLM problems:
• Knowledge cutoff (training se purana).
• Hallucinations (confident wrong answers).
• Private data nahi pata.
• No source attribution.
RAG context external docs se inject karke fresh + grounded + cite-able answers deta.` },
  { topicSlug: "rag", order: 2, difficulty: "easy",
    question: "RAG pipeline ke main steps?",
    answer: "1) Ingestion — load + chunk + embed + store. 2) Retrieval — query embed + top-K search. 3) Augmentation — chunks ko prompt me inject. 4) Generation — LLM context+query se answer banae." },
  { topicSlug: "rag", order: 3, difficulty: "medium",
    question: "Chunk size kaise decide karein?",
    answer:
`Trade-off:
• Chhota (200-500 chars) → precise match, miss context.
• Bada (1500+ chars) → context but noise + irrelevant info.
Default: 1000 chars, 200 overlap.
Domain-specific: code → bigger, FAQs → smaller.
Test on real queries, measure retrieval quality.` },
  { topicSlug: "rag", order: 4, difficulty: "medium",
    question: "Hybrid search kya hai? Kab use?",
    answer:
`Semantic (vector) + Keyword (BM25/TF-IDF) ka combination. EnsembleRetriever me weights se merge.
Kyu: pure semantic exact terms miss karta hai (product codes, names, jargon). BM25 keyword exact match deta. Ensemble 10-20% better recall.
Production RAG me standard.` },
  { topicSlug: "rag", order: 5, difficulty: "medium",
    question: "Reranking kya hai? Latency badhati phir bhi kyu?",
    answer:
`Bigger top-K (20-50) retrieve karo, fir cross-encoder reranker se best top-K (5-10) chuno.
Cross-encoder query+doc ko joint encode karta — bi-encoder (embeddings) se behtar relevance scoring. Latency +100-300ms but quality jump significant.
Cohere Rerank, Voyage AI rerankers, sentence-transformers cross-encoders — popular options.` },
  { topicSlug: "rag", order: 6, difficulty: "hard",
    question: "Hallucination minimize karne ke techniques?",
    answer:
`• Strict prompt: 'ONLY context use karo, baki kuch nahi'.
• Low temperature (0-0.2).
• Force citation: 'Cite [doc:N] after each claim'.
• Self-check: LLM se output verify karwao.
• Faithfulness metric monitor (LLM-as-judge).
• Fallback: 'Don't know' explicit allow karo.
• Retrieval quality first — agar bad chunks, generation kuch bhi karein.` },
  { topicSlug: "rag", order: 7, difficulty: "hard",
    question: "RAG accuracy production me low hai — debug kaise?",
    answer:
`Pipeline isolate karo:
1. Retrieval debug — for failing queries, retrieved chunks dekho. Relevant? Agar nahi → embed model / chunking change.
2. Reranking add karo top-K retrieve karke.
3. Prompt audit — context proper format me jaa raha? Citation rules clear?
4. LLM swap — gpt-4 vs gpt-4o-mini test.
5. RAGAS jaise framework se quantify — faithfulness, context precision, answer relevance.
6. Hybrid search add karo agar exact terms miss ho rahe.` },
  { topicSlug: "rag", order: 8, difficulty: "hard",
    question: "RAG vs Fine-tuning — kab kya?",
    answer:
`RAG — knowledge inject (facts, docs). Fast iterate, fresh updates, citable, cheap.
Fine-tuning — style/format teach, model behaviour shape. Permanent, hard to update, costly.
Often combined: fine-tune for tone, RAG for facts.
Knowledge changes? RAG.
Output format/style change? Fine-tune.
Both? Combine — start with RAG, fine-tune if specific behaviour gap.` },
];
