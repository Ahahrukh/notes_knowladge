import { T, H, C, N, L } from "./_helpers.mjs";

export const topic = {
  slug: "langchain",
  title: "LangChain & LangGraph",
  description:
    "LLM orchestration frameworks. Chains, prompts, agents, memory, tools — sab abstract karte hain.",
  icon: "🦜",
  color: "#1c3c3c",
  order: 15,
};

export const sections = [
  {
    topicSlug: "langchain", slug: "introduction", order: 1,
    title: "LangChain kya hai?",
    summary: "LLM apps build karne ka framework.",
    content: [
      T("**LangChain** ek framework hai jo LLM apps ke common building blocks — prompts, model calls, retrievers, tools, memory — abstract karta. Provider-agnostic (OpenAI/Claude/Gemini swap karna easy)."),
      H("Core components"),
      L([
        "**LLMs / ChatModels** — model providers ka unified interface.",
        "**Prompt Templates** — variable-fill prompts.",
        "**Output Parsers** — LLM text → structured Python objects.",
        "**Retrievers** — vector stores ka abstraction.",
        "**Tools** — functions LLM ko call karne ke liye.",
        "**Memory** — conversation history manage.",
        "**Chains / LCEL** — components ko pipeline me jodo.",
        "**Agents (LangGraph)** — autonomous tool-using LLM flows.",
      ]),
      H("Install"),
      C("bash", `pip install langchain langchain-openai langchain-community langchain-chroma`,
        "Modular packages — sirf jo chahiye install karo, lighter install."),
      N("LangChain rapidly evolve hota hai. Docs check karte raho. Alternative: LlamaIndex (RAG-focused), DSPy (programmatic prompts)."),
    ],
  },
  {
    topicSlug: "langchain", slug: "prompts-models", order: 2,
    title: "Prompts, Models, Output Parsers",
    summary: "Core building blocks.",
    content: [
      C("python",
`from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. Prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", "Tu Hinglish me concise jawab deta hai."),
    ("user", "{topic} ke baare me 3 line likho."),
])

# 2. Model
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.5)

# 3. Output parser
parser = StrOutputParser()

# 4. Chain (LCEL — pipe operator)
chain = prompt | llm | parser

# Invoke
result = chain.invoke({"topic": "RAG"})
print(result)`,
        "LCEL = LangChain Expression Language. `|` pipe operator components ko jodtdda hai (Unix pipes jaisa). Async, streaming, batch sab automatic milte hain."),
      H("Pydantic structured output"),
      C("python",
`from pydantic import BaseModel, Field

class Summary(BaseModel):
    title: str = Field(description="Topic ka short title")
    bullets: list[str] = Field(description="3-5 key points")
    difficulty: str = Field(description="easy/medium/hard")

structured_llm = llm.with_structured_output(Summary)

prompt = ChatPromptTemplate.from_template("Summarize this topic: {topic}")

chain = prompt | structured_llm
result: Summary = chain.invoke({"topic": "Vector databases"})
print(result.title, result.bullets, result.difficulty)`,
        "`with_structured_output` automatically Pydantic schema enforce karta (OpenAI Structured Outputs / function calling internally use)."),
    ],
  },
  {
    topicSlug: "langchain", slug: "lcel", order: 3,
    title: "LCEL — Pipeline Composition",
    summary: "Pipe operator se chains banao.",
    content: [
      C("python",
`from langchain_core.runnables import RunnablePassthrough, RunnableParallel

# Parallel execution
chain = RunnableParallel(
    summary=summary_chain,
    keywords=keywords_chain,
    sentiment=sentiment_chain,
)

result = chain.invoke({"text": doc})
# {"summary": ..., "keywords": [...], "sentiment": "positive"}

# RunnablePassthrough — input ko aage le jao bina change kiye
rag_chain = {
    "context": retriever,
    "question": RunnablePassthrough(),
} | prompt | llm | parser`,
        "LCEL declarative pipelines deta — async/streaming/batch free me kaam karte. Production me main pattern."),
      H("Streaming with LCEL"),
      C("python",
`for chunk in chain.stream({"topic": "agents"}):
    print(chunk, end="", flush=True)

# Async
async for chunk in chain.astream({"topic": "agents"}):
    print(chunk, end="", flush=True)`,
        "Same chain stream/invoke/batch karta hai bina alag code likhe."),
    ],
  },
  {
    topicSlug: "langchain", slug: "retrievers-rag", order: 4,
    title: "Retrievers & RAG with LangChain",
    summary: "Vector store + RAG chain.",
    content: [
      C("python",
`from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# Vector store
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings,
)

# Retriever
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 5}
)

# RAG prompt
prompt = ChatPromptTemplate.from_template("""
Answer based ONLY on context. Cite [doc:N].

Context:
{context}

Question: {question}
""")

def format_docs(docs):
    return "\\n\\n".join(f"[doc:{i+1}] {d.page_content}"
                          for i, d in enumerate(docs))

# RAG chain
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

answer = rag_chain.invoke("RAG kya hai?")`,
        "Complete RAG in ~10 lines of LCEL. Production grade — async, streaming, batch built-in."),
    ],
  },
  {
    topicSlug: "langchain", slug: "tools", order: 5,
    title: "Tools — LLM ko Functions Do",
    summary: "Calculator, search, DB query — LLM call kar sake.",
    content: [
      C("python",
`from langchain_core.tools import tool

@tool
def calculator(expression: str) -> str:
    """Evaluate a math expression like '2+3*4'."""
    try:
        return str(eval(expression))   # production me safer evaluator
    except Exception as e:
        return f"Error: {e}"

@tool
def get_weather(city: str) -> str:
    """Get current weather for a city."""
    # actual API
    return f"{city}: 32°C, sunny"

@tool
def search_docs(query: str) -> str:
    """Search internal knowledge base."""
    results = retriever.invoke(query)
    return "\\n".join(r.page_content[:200] for r in results)

tools = [calculator, get_weather, search_docs]`,
        "`@tool` decorator se function signature, docstring se schema auto-generate. LLM ko bhejne ke liye structured JSON description."),
      H("LLM with tools (raw)"),
      C("python",
`llm_with_tools = llm.bind_tools(tools)

response = llm_with_tools.invoke("Delhi ka mausam aur 23*45 batao")
print(response.tool_calls)
# [{name: 'get_weather', args: {city: 'Delhi'}, id: '...'},
#  {name: 'calculator', args: {expression: '23*45'}, id: '...'}]

# Manually execute aur loop karna padega.
# LangGraph isse abstract karta hai (next section).`,
        "Tools call dispatch + execute + result feedback ka manual loop. LangGraph yehi automate karta."),
    ],
  },
  {
    topicSlug: "langchain", slug: "memory", order: 6,
    title: "Memory — Conversation History",
    summary: "Multi-turn chat ke liye state.",
    content: [
      C("python",
`from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

# Per-session history
store = {}

def get_history(session_id: str) -> ChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

prompt = ChatPromptTemplate.from_messages([
    ("system", "Tu helpful Hinglish assistant hai."),
    ("placeholder", "{history}"),
    ("user", "{input}"),
])

chain = prompt | llm

with_history = RunnableWithMessageHistory(
    chain,
    get_history,
    input_messages_key="input",
    history_messages_key="history",
)

config = {"configurable": {"session_id": "user-123"}}
with_history.invoke({"input": "Mera naam Shahrukh"}, config=config)
with_history.invoke({"input": "Mera naam yaad hai?"}, config=config)
# → "Haan, aapka naam Shahrukh hai"`,
        "Production me `store` ko Redis/Postgres backed banao — server restart pe history persist."),
      H("Memory strategies"),
      L([
        "**Buffer (full)** — saara history append. Simple but token cost badhta.",
        "**Window (last K)** — sirf last K messages.",
        "**Summary** — purane messages ko LLM summarize karke replace.",
        "**Vector memory** — old messages embed karke retrieve karo as needed.",
      ]),
    ],
  },
  {
    topicSlug: "langchain", slug: "langgraph-intro", order: 7,
    title: "LangGraph — Agentic Workflows",
    summary: "Stateful graph-based agents (LangChain ka future).",
    content: [
      T("**LangGraph** LangChain team ka newer framework agent workflows ke liye. Pure agent (autonomous tool loop) + structured workflow (pre-defined steps with branching). 2024-25 me industry standard ban gaya."),
      H("Concepts"),
      L([
        "**State** — shared dictionary jo nodes me flow karta.",
        "**Nodes** — Python functions jo state ko transform karte.",
        "**Edges** — node se node ka flow.",
        "**Conditional edges** — LLM ya logic decide kare next node.",
      ]),
      C("python",
`from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]

def chatbot_node(state: AgentState):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

# Build graph
graph = StateGraph(AgentState)
graph.add_node("chatbot", chatbot_node)
graph.set_entry_point("chatbot")
graph.add_edge("chatbot", END)

app = graph.compile()

# Run
result = app.invoke({"messages": [("user", "Namaste!")]})
print(result["messages"][-1].content)`,
        "Simplest agent — ek node jo LLM call karta. Real agents me multiple nodes + tools + conditional edges."),
    ],
  },
  {
    topicSlug: "langchain", slug: "langgraph-agent", order: 8,
    title: "LangGraph Agent — Tools + Loop",
    summary: "Full agentic pattern: think → act → observe → repeat.",
    content: [
      C("python",
`from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")

# Tools defined earlier (calculator, weather, search_docs)
agent = create_react_agent(llm, tools=tools)

# Run
result = agent.invoke({
    "messages": [("user", "Delhi me 30 degree hai to fahrenheit me kitna? Aur weather kaisa hai?")]
})

for msg in result["messages"]:
    print(msg.type, msg.content)
# user → assistant (tool calls) → tool results → assistant (final answer)`,
        "`create_react_agent` ReAct loop automatically banata. Production ke liye custom graph likho — more control."),
      H("Custom agent graph"),
      C("python",
`from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode

def call_llm(state):
    response = llm_with_tools.invoke(state["messages"])
    return {"messages": [response]}

def should_continue(state):
    last_msg = state["messages"][-1]
    return "tools" if last_msg.tool_calls else END

graph = StateGraph(AgentState)
graph.add_node("agent", call_llm)
graph.add_node("tools", ToolNode(tools))
graph.set_entry_point("agent")
graph.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
graph.add_edge("tools", "agent")    # tools ke baad wapas agent

app = graph.compile()`,
        "Conditional edge LLM ke output (tool_calls hai ya nahi) ke base pe route karta. Yehi pure agentic loop hai."),
      H("State persistence (long agents)"),
      C("python",
`from langgraph.checkpoint.postgres import PostgresSaver

checkpointer = PostgresSaver.from_conn_string("postgresql://...")
app = graph.compile(checkpointer=checkpointer)

# Multi-step agents persist state — interrupt/resume possible
config = {"configurable": {"thread_id": "session-1"}}
app.invoke({"messages": [("user", "Plan a trip to Goa")]}, config=config)
# Later — same thread, continues
app.invoke({"messages": [("user", "Budget under 30K")]}, config=config)`,
        "Long-running agents (research, planning) state persist karna zaroori — crash recovery + human-in-the-loop."),
    ],
  },
];

export const interview = [
  { topicSlug: "langchain", order: 1, difficulty: "easy",
    question: "LangChain kya hai? Kyu use karein?",
    answer: "LLM apps ke common building blocks (prompts, models, retrievers, tools, memory) ka abstraction framework. Provider-agnostic (OpenAI/Claude swap easy), prebuilt RAG/agent patterns, fast prototyping. Cons: rapidly changing, abstraction overhead, sometimes over-engineered for simple use cases." },
  { topicSlug: "langchain", order: 2, difficulty: "easy",
    question: "LCEL kya hai?",
    answer: "LangChain Expression Language — `|` pipe operator se chains compose karne ka declarative syntax. Components (prompt, model, parser, retriever) ko Unix pipes ki tarah jodte hain. Async/stream/batch automatically support kar jata." },
  { topicSlug: "langchain", order: 3, difficulty: "medium",
    question: "LangChain me structured output kaise?",
    answer:
`llm.with_structured_output(PydanticSchema)
Internally OpenAI Structured Outputs / function calling use karta. Output direct Pydantic instance — validated.
Older method: PydanticOutputParser (less reliable, prompt me schema embed karta).` },
  { topicSlug: "langchain", order: 4, difficulty: "medium",
    question: "Tool kya hai? @tool decorator kya karta?",
    answer:
`Tool = function jo LLM call kar sake structured args ke saath.
@tool decorator:
• Function signature se JSON schema generate karta.
• Docstring se description.
• LLM ko bind_tools(tools) se pata chalta available tools.
Production me Pydantic models se explicit args_schema dena cleaner.` },
  { topicSlug: "langchain", order: 5, difficulty: "medium",
    question: "Memory strategies — kab konsi?",
    answer:
`• Buffer (full) — short conversations.
• Window (last K) — long, casual chats.
• Summary — long task-oriented (older context summarize karke compact).
• Vector — pure long-term, retrieve relevant past as needed.
Hybrid common: window for recent + vector for older.` },
  { topicSlug: "langchain", order: 6, difficulty: "hard",
    question: "LangChain vs LangGraph — kab kya?",
    answer:
`LangChain (LCEL) — linear pipelines, RAG, chains without state branching.
LangGraph — stateful workflows, agents with loops, conditional routing, human-in-the-loop, checkpointing.
Simple chain → LCEL.
Multi-step agent / branching workflow / long-running → LangGraph.` },
  { topicSlug: "langchain", order: 7, difficulty: "hard",
    question: "Agent infinite loop me phasa — kaise prevent?",
    answer:
`• max_iterations limit (default 10-20).
• Checkpoint state, detect repeated tool calls.
• Tool result validation — same args repeat ho rahe to break.
• Timeout per call (LLM + tool).
• Cost cap — token budget cross to abort.
• Observability — LangSmith/Phoenix tracing, debug loops visible.` },
  { topicSlug: "langchain", order: 8, difficulty: "hard",
    question: "Production me LangChain debug kaise?",
    answer:
`• LangSmith (managed) ya self-host trace UI.
• set_debug(True) verbose logs.
• Callbacks/handlers se per-step capture.
• LCEL me .with_config({'callbacks':[handler]}) se step-by-step inspect.
• Streaming events (astream_events) granular visibility.
• Unit test components separately (mock LLM with FakeChatModel).` },
];
