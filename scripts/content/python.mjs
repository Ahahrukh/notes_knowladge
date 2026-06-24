import { T, H, C, N, L } from "./_helpers.mjs";

export const topic = {
  slug: "python",
  title: "Python",
  description:
    "AI/GenAI engineer ki rooh. Syntax simple, ecosystem (NumPy/Pandas/PyTorch/LangChain) world-class.",
  icon: "🐍",
  color: "#3776ab",
  order: 1,
};

export const sections = [
  {
    topicSlug: "python", slug: "introduction", order: 1,
    title: "Introduction & Setup",
    summary: "Python kya hai, kyu AI ke liye standard hai, install.",
    content: [
      H("Python kya hai?"),
      T("Python ek **high-level, interpreted, dynamically-typed** language hai. AI/ML/GenAI me almost saari major libraries (PyTorch, TensorFlow, NumPy, Pandas, LangChain, LlamaIndex, FastAPI) Python me hi hain — isliye ye field ki *default* language hai."),
      H("Install karo"),
      L([
        "Mac: `brew install python@3.11` (recommend 3.11 ya 3.12, avoid latest bleeding-edge).",
        "Windows: python.org/downloads → installer chalao, **'Add to PATH' tick karo**.",
        "Linux: `sudo apt install python3 python3-pip python3-venv`",
      ]),
      C("bash", "python3 --version\npip3 --version", "Install confirm karo."),
      H("Pehla program"),
      C("python", `print("Hello, Duniya!")`,
        "`print()` built-in function hai. Python me semicolons nahi chahiye line end pe."),
      N("Python 2 mat use karo — dead hai. Always Python 3.10+ rakho."),
    ],
  },
  {
    topicSlug: "python", slug: "variables-datatypes", order: 2,
    title: "Variables & Data Types",
    summary: "int, float, str, bool, list, tuple, dict, set.",
    content: [
      T("Variable = naam jisme value store hoti hai. Dynamic typing — type runtime pe decide hota hai."),
      C("python",
`name = "Shahrukh"           # str
age = 22                    # int
height = 5.9                # float
is_engineer = True          # bool
skills = ["Python", "SQL"]  # list  -- mutable, ordered
loc = ("Delhi", "IN")       # tuple -- immutable
profile = {"name": name, "age": age}  # dict
tags = {"ai", "ml", "ai"}   # set   -- unique only`,
        "Dict aur set me **hashing** use hoti hai isliye lookup O(1) hota hai — list me linear search hota hai (O(n))."),
      H("Type checking & casting"),
      C("python",
`type(age)         # <class 'int'>
isinstance(age, int)  # True

int("42")         # 42
float("3.14")     # 3.14
str(100)          # "100"
list("abc")       # ['a', 'b', 'c']`,
        "`isinstance` inheritance bhi handle karta hai, isliye `type()` se behtar hai checks ke liye."),
      N("Strings, tuples, frozensets — **immutable**. Lists, dicts, sets — **mutable**. Function arguments me mutability bahut bada bug-source hai."),
    ],
  },
  {
    topicSlug: "python", slug: "strings", order: 3,
    title: "Strings — Slicing, f-strings, Methods",
    summary: "Prompt engineering ke liye string mastery zaroori.",
    content: [
      C("python",
`s = "Generative AI"
s.lower()        # 'generative ai'
s.upper()        # 'GENERATIVE AI'
s.split()        # ['Generative', 'AI']
"_".join(["a","b","c"])   # 'a_b_c'
s.replace("AI", "ML")     # 'Generative ML'
s.startswith("Gen")       # True
"  hi  ".strip()          # 'hi'`,
        "Strings immutable hain — methods naya string return karte hain, original unchanged rehta hai."),
      H("Slicing"),
      C("python",
`s = "AgenticAI"
s[0]       # 'A'
s[-1]      # 'I'
s[0:7]     # 'Agentic'
s[::-1]    # 'IAcitnegA'  (reverse)`,
        "Syntax `[start:stop:step]`. Negative index end se count karta hai."),
      H("f-strings (formatted strings)"),
      C("python",
`name = "Shahrukh"
score = 92.5
print(f"{name} ne {score:.1f}% laaye.")
# Shahrukh ne 92.5% laaye.

# Expression bhi chal jata hai
print(f"Double = {score * 2}")`,
        "f-strings sabse fast aur readable formatting hai (Python 3.6+). Inside `{}` koi bhi expression chal sakti hai. `:.1f` = 1 decimal float."),
      N("Prompt engineering me f-strings extensively use hote hain template variables fill karne ke liye."),
    ],
  },
  {
    topicSlug: "python", slug: "control-flow", order: 4,
    title: "Control Flow — if / loops",
    summary: "Decisions aur repetition.",
    content: [
      C("python",
`x = 75
if x >= 90: grade = "A"
elif x >= 60: grade = "B"
else: grade = "C"`,
        "Single-line if/else allowed hai par readability ke liye multi-line preferred."),
      H("for loop"),
      C("python",
`for i in range(5):           # 0..4
    print(i)

for ch in "AI":              # iterable
    print(ch)

for idx, val in enumerate(["a","b","c"]):
    print(idx, val)          # 0 a, 1 b, 2 c

for k, v in {"x":1, "y":2}.items():
    print(k, v)`,
        "`enumerate` index+value ek saath deta hai. `dict.items()` key-value pairs. `range(start, stop, step)`."),
      H("while + break/continue"),
      C("python",
`while True:
    user = input("type 'q' to quit: ")
    if user == "q":
        break          # loop se nikal jao
    if not user:
        continue       # next iteration pe jao
    print("Got:", user)`,
        "`break` loop end karta hai. `continue` current iteration skip karta hai."),
    ],
  },
  {
    topicSlug: "python", slug: "comprehensions", order: 5,
    title: "Comprehensions — List/Dict/Set",
    summary: "Loop ka short, Pythonic form.",
    content: [
      C("python",
`nums = [1, 2, 3, 4, 5]

squares = [n*n for n in nums]                 # [1,4,9,16,25]
evens   = [n for n in nums if n % 2 == 0]     # [2, 4]

# Dict comprehension
sq_map = {n: n*n for n in nums}               # {1:1, 2:4, ...}

# Set comprehension
unique = {n % 3 for n in nums}                # {0, 1, 2}

# Nested
pairs = [(x, y) for x in [1,2] for y in [3,4]]
# [(1,3),(1,4),(2,3),(2,4)]`,
        "Pattern: `[expression for item in iterable if condition]`. Bahut readable + fast — loop+append se behtar."),
      N("Generator expression me `( )` use hota hai — memory efficient because lazy: `sum(n*n for n in nums)`."),
    ],
  },
  {
    topicSlug: "python", slug: "functions", order: 6,
    title: "Functions & Lambda",
    summary: "Reusable code, default args, *args/**kwargs, lambda.",
    content: [
      C("python",
`def greet(name, msg="Namaste"):
    """Returns greeting."""
    return f"{msg}, {name}!"

greet("Ali")               # 'Namaste, Ali!'
greet("Ali", "Hello")      # 'Hello, Ali!'
greet(msg="Hi", name="Bob")# keyword args`,
        "Positional + keyword args dono allowed hain. Default value caller side optional bana deti hai."),
      H("*args & **kwargs"),
      C("python",
`def chat(model, *messages, **options):
    print("Model:", model)
    print("Msgs:", messages)
    print("Opts:", options)

chat("gpt-4", "hi", "how r u", temperature=0.7, top_p=0.9)
# Model: gpt-4
# Msgs: ('hi', 'how r u')
# Opts: {'temperature': 0.7, 'top_p': 0.9}`,
        "`*args` extra positional args ko tuple me collect karta hai. `**kwargs` extra keyword args ko dict me. LangChain/OpenAI SDK me bahut common pattern."),
      H("Lambda (anonymous function)"),
      C("python",
`add = lambda a, b: a + b
add(2, 3)                  # 5

items = [("a", 3), ("b", 1), ("c", 2)]
items.sort(key=lambda x: x[1])   # tuple ke 2nd element pe sort
# [('b', 1), ('c', 2), ('a', 3)]`,
        "Lambda short anonymous function. Use only when ek line ka logic ho — warna `def` use karo."),
    ],
  },
  {
    topicSlug: "python", slug: "iterators-generators", order: 7,
    title: "Iterators, Generators & yield",
    summary: "LLM streaming, large data — generator zaroori hai.",
    content: [
      T("**Iterator** = object jo `__next__()` implement karta hai aur ek-ek karke values deta hai. **Generator** = function jo `yield` use karta hai — Python automatically iterator bana deta hai."),
      C("python",
`def counter(n):
    i = 0
    while i < n:
        yield i           # pause yahan, value return karo
        i += 1

for x in counter(3):
    print(x)              # 0, 1, 2`,
        "`yield` ke baad function pauses, next call pe wahi se resume hota hai. Memory me ek baar me ek hi value hoti hai — bade datasets ke liye perfect."),
      H("Why important for AI/LLMs?"),
      C("python",
`# OpenAI streaming response — generator pattern
def stream_llm(prompt):
    # imagine API call returning chunks
    for chunk in ["Hello, ", "how ", "can ", "I ", "help?"]:
        yield chunk

for piece in stream_llm("hi"):
    print(piece, end="", flush=True)
# Hello, how can I help?`,
        "LLM responses chunk-by-chunk aate hain (streaming). Generator pattern hi ye handle karta hai bina full response wait kiye."),
      N("Generator expression: `sum(x*x for x in range(1_000_000))` — 1 million squares ka sum bina list banaye."),
    ],
  },
  {
    topicSlug: "python", slug: "exceptions", order: 8,
    title: "Exception Handling",
    summary: "try/except/finally, custom exceptions.",
    content: [
      C("python",
`try:
    result = 10 / 0
except ZeroDivisionError as e:
    print("Math error:", e)
except (TypeError, ValueError):
    print("Type/value issue")
except Exception as e:           # catch-all (last me)
    print("Unknown:", e)
else:
    print("No error")
finally:
    print("Cleanup hamesha chalega")`,
        "`finally` me cleanup (file close, DB disconnect) likho — error ho ya na ho, run hoga."),
      H("Custom exception"),
      C("python",
`class RateLimitError(Exception):
    """LLM API rate limit hit."""

def call_llm(prompt):
    if some_condition():
        raise RateLimitError("Too many requests")`,
        "Production code me domain-specific exceptions banao — caller meaningful catch kar sake."),
      N("Bare `except:` (bina exception type) **mat likho** — KeyboardInterrupt bhi swallow ho jata hai. At least `except Exception:` use karo."),
    ],
  },
  {
    topicSlug: "python", slug: "file-io", order: 9,
    title: "File I/O & JSON",
    summary: "Text, CSV, JSON read/write. Context managers.",
    content: [
      H("Context manager (`with` statement)"),
      C("python",
`with open("notes.txt", "r", encoding="utf-8") as f:
    text = f.read()

with open("out.txt", "w", encoding="utf-8") as f:
    f.write("Hello")`,
        "`with` block ke baad file **automatically close** ho jati hai — exception aaye to bhi. Always use this pattern."),
      H("JSON read/write"),
      C("python",
`import json

# Write
data = {"name": "Shahrukh", "skills": ["AI", "Python"]}
with open("profile.json", "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# Read
with open("profile.json") as f:
    loaded = json.load(f)

# String me kaam — useful for LLM JSON responses
s = json.dumps(data)
obj = json.loads(s)`,
        "`dump`/`load` files ke liye, `dumps`/`loads` strings ke liye. LLM se structured output JSON me parse karne me yehi use hota hai."),
      H("pathlib (modern path handling)"),
      C("python",
`from pathlib import Path

p = Path("data") / "users.json"   # OS-agnostic join
p.exists()
p.stem            # 'users'
p.suffix          # '.json'
p.read_text()     # full content
list(Path("data").glob("*.json"))  # all JSONs`,
        "`pathlib.Path` modern way hai — `os.path` string juggling se behtar."),
    ],
  },
  {
    topicSlug: "python", slug: "oop", order: 10,
    title: "OOP — Classes, Inheritance, Dunder",
    summary: "Encapsulation, inheritance, polymorphism, magic methods.",
    content: [
      C("python",
`class LLM:
    def __init__(self, name, temp=0.7):
        self.name = name
        self.temp = temp

    def generate(self, prompt):
        return f"[{self.name}] response to: {prompt}"

    def __repr__(self):
        return f"LLM(name={self.name!r}, temp={self.temp})"

class OpenAILLM(LLM):       # inheritance
    def generate(self, prompt):    # override
        # call OpenAI API ...
        return super().generate(prompt).upper()

m = OpenAILLM("gpt-4")
print(m.generate("hi"))
print(m)            # LLM(name='gpt-4', temp=0.7)`,
        "`__init__` constructor. `self` current instance. `super()` parent class ka method. `__repr__` developer-friendly string."),
      H("Common dunders"),
      L([
        "`__init__` — constructor",
        "`__repr__` — developer string (`repr(obj)`)",
        "`__str__` — user string (`str(obj)`)",
        "`__len__` — `len(obj)` ke liye",
        "`__getitem__` — `obj[key]` indexing",
        "`__call__` — object ko function ki tarah call karna",
        "`__eq__`, `__hash__` — equality & dict key support",
      ]),
    ],
  },
  {
    topicSlug: "python", slug: "decorators", order: 11,
    title: "Decorators",
    summary: "Function ko wrap karke extra behaviour add karna.",
    content: [
      C("python",
`from functools import wraps
import time

def timeit(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = fn(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{fn.__name__} took {elapsed:.3f}s")
        return result
    return wrapper

@timeit
def slow_task():
    time.sleep(0.5)

slow_task()    # slow_task took 0.501s`,
        "`@timeit` syntax = `slow_task = timeit(slow_task)`. `@wraps` ensures wrapped function ka `__name__`, docstring preserve ho."),
      H("Real-world: retry decorator (LLM API ke liye)"),
      C("python",
`def retry(times=3, delay=1):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return fn(*args, **kwargs)
                except Exception as e:
                    print(f"Try {attempt+1} failed: {e}")
                    time.sleep(delay * (2 ** attempt))   # exponential backoff
            raise
        return wrapper
    return decorator

@retry(times=3, delay=2)
def call_openai(prompt):
    ...`,
        "Parameterized decorator (decorator factory). LLM APIs me rate-limit ya transient error pe retry common pattern hai."),
      N("FastAPI, LangChain, pytest sab decorators pe heavy reliance karte hain — concept solid hona chahiye."),
    ],
  },
  {
    topicSlug: "python", slug: "type-hints", order: 12,
    title: "Type Hints & Pydantic Basics",
    summary: "Modern Python — types, dataclasses, Pydantic.",
    content: [
      H("Type hints"),
      C("python",
`from typing import Optional, Union

def greet(name: str, times: int = 1) -> str:
    return ("Hi " + name) * times

# Containers
nums: list[int] = [1, 2, 3]
lookup: dict[str, int] = {"a": 1}

# Optional & Union (Python 3.10+ syntax)
def find(id: int) -> str | None:
    return None`,
        "Type hints **runtime pe enforce nahi hote** — sirf IDE/mypy ke liye hain. Production code me hamesha use karo, readability + bug-catching massively improve hoti hai."),
      H("dataclasses"),
      C("python",
`from dataclasses import dataclass

@dataclass
class Message:
    role: str
    content: str
    tokens: int = 0

m = Message("user", "hello")
print(m)   # Message(role='user', content='hello', tokens=0)`,
        "`@dataclass` automatically `__init__`, `__repr__`, `__eq__` generate karta hai. Plain data containers ke liye perfect."),
      H("Pydantic (industry standard)"),
      C("python",
`from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    model: str
    messages: list[dict]
    temperature: float = Field(0.7, ge=0, le=2)

# Automatic validation
req = ChatRequest(model="gpt-4", messages=[{"role":"user","content":"hi"}])
req.model_dump()   # → dict
req.model_dump_json()  # → JSON string

# Invalid → ValidationError
ChatRequest(model="gpt-4", messages=[], temperature=5)`,
        "Pydantic = type-hinted dataclass + **runtime validation**. FastAPI, LangChain, instructor — sab Pydantic use karte hain. AI engineer ke liye must."),
      N("LLM se structured output (JSON) lena ho to Pydantic model define karke validate karna industry pattern hai."),
    ],
  },
  {
    topicSlug: "python", slug: "modules-packages", order: 13,
    title: "Modules, Packages & Imports",
    summary: "Code organize karna, __init__.py, relative imports.",
    content: [
      C("text",
`my_project/
├── pyproject.toml
└── src/
    └── myapp/
        ├── __init__.py
        ├── llm.py
        ├── tools.py
        └── agents/
            ├── __init__.py
            └── researcher.py`,
        "Industrial Python project ka standard layout — `src/` layout test isolation aur packaging me help karta hai."),
      C("python",
`# myapp/agents/researcher.py
from myapp.llm import call_llm        # absolute import (preferred)
from ..tools import web_search        # relative import (parent package)

def research(topic):
    results = web_search(topic)
    return call_llm(f"Summarize: {results}")`,
        "**Absolute imports preferred** hain — explicit aur refactor-safe. Relative (`..`, `.`) sirf intra-package use karo."),
      H("Common pitfalls"),
      L([
        "Circular imports — A imports B, B imports A → restructure or move common code to C.",
        "`__init__.py` empty bhi ho sakti hai — sirf folder ko package mark karti hai.",
        "Module-level code import time pe chalta hai — heavy work init me mat karo.",
      ]),
    ],
  },
  {
    topicSlug: "python", slug: "async-await", order: 14,
    title: "Async / Await — Concurrency for APIs",
    summary: "LLM API parallel calls ke liye essential.",
    content: [
      T("AI engineer ko async aana **must** hai. Ek prompt ka response 2-30 sec lag sakta hai — async se 100 prompts parallel ja sakte hain ek hi thread me."),
      C("python",
`import asyncio
import httpx

async def fetch(url):
    async with httpx.AsyncClient() as client:
        r = await client.get(url)
        return r.json()

async def main():
    urls = ["https://api.x.com/1", "https://api.x.com/2", "https://api.x.com/3"]
    # Parallel — 3 requests ek saath
    results = await asyncio.gather(*[fetch(u) for u in urls])
    return results

asyncio.run(main())`,
        "`async def` coroutine define karta hai. `await` pe coroutine pauses aur event loop dusra kaam karta hai. `asyncio.gather` parallel run."),
      H("Sync vs Async time comparison"),
      C("python",
`# Sync — 3 calls of 1s each = 3s total
for url in urls:
    r = httpx.get(url)

# Async — 3 calls of 1s each = ~1s total (overlap)
await asyncio.gather(*[fetch(u) for u in urls])`,
        "I/O bound work (network, DB, file) me async massive speedup deta hai. CPU bound me **fayda nahi** — multiprocessing use karo."),
      N("OpenAI/Anthropic SDKs me `client.chat.completions.create` ka async version available hai — `await client.chat.completions.acreate(...)` jaisa."),
    ],
  },
  {
    topicSlug: "python", slug: "logging", order: 15,
    title: "Logging — print() ke baad ka step",
    summary: "Production me logging zaroori hai, print nahi.",
    content: [
      C("python",
`import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

logger = logging.getLogger(__name__)

logger.debug("low level details")
logger.info("LLM call started")
logger.warning("Rate limit close")
logger.error("API failed", exc_info=True)`,
        "Levels: DEBUG < INFO < WARNING < ERROR < CRITICAL. Production me INFO/WARNING, dev me DEBUG. `exc_info=True` full traceback log karta hai."),
      N("print() debugging ke liye ok, **production code me logger** use karo — levels, timestamps, redirect to file/Datadog/CloudWatch easy hote hain."),
    ],
  },
];

export const interview = [
  { topicSlug: "python", order: 1, difficulty: "easy",
    question: "List vs Tuple — difference?",
    answer: "• List mutable, tuple immutable.\n• Tuple thoda fast aur dict key ban sakta hai.\n• Use tuple jab fixed records ho (lat,lng), list jab modify karna ho." },
  { topicSlug: "python", order: 2, difficulty: "easy",
    question: "`is` vs `==`?",
    answer: "`==` value compare karta hai, `is` identity (memory) compare. `a=[1,2]; b=[1,2]; a==b → True, a is b → False`." },
  { topicSlug: "python", order: 3, difficulty: "easy",
    question: "Shallow vs Deep copy?",
    answer: "import copy. copy.copy() shallow (top-level new, nested references shared). copy.deepcopy() har nested level bhi clone. Mutable nested data me deepcopy zaroori." },
  { topicSlug: "python", order: 4, difficulty: "medium",
    question: "Mutable default args ka bug?",
    answer: "def f(x, arr=[]): arr.append(x); return arr. Default list ek hi instance hai sab calls me — first call [1], second [1,2]. Fix: default None aur function ke andar arr=[]." },
  { topicSlug: "python", order: 5, difficulty: "medium",
    question: "*args aur **kwargs?",
    answer: "*args extra positional args ko tuple me. **kwargs extra keyword args ko dict me collect karte hain. LangChain/OpenAI SDK me kwargs pass through bahut common." },
  { topicSlug: "python", order: 6, difficulty: "medium",
    question: "Generator kya hota hai? Kab use?",
    answer: "yield use karne wala function. Memory-efficient — ek-ek karke values produce karta hai bina list me hold kiye. LLM streaming, badi files, infinite sequences me ideal." },
  { topicSlug: "python", order: 7, difficulty: "medium",
    question: "Decorator likho jo retry kare 3 baar.",
    answer:
`def retry(n=3):
    def deco(fn):
        @wraps(fn)
        def wrap(*a, **kw):
            for i in range(n):
                try: return fn(*a, **kw)
                except Exception as e:
                    if i == n-1: raise
                    time.sleep(2**i)
        return wrap
    return deco
LLM API call wrap karne me kaam aata hai (rate-limit/transient errors).` },
  { topicSlug: "python", order: 8, difficulty: "medium",
    question: "GIL kya hai?",
    answer: "Global Interpreter Lock — CPython me ek time pe ek hi thread Python bytecode execute karta hai. CPU-bound multithreading ka fayda nahi — multiprocessing use karo. I/O bound me threads/async dono kaam karte hain." },
  { topicSlug: "python", order: 9, difficulty: "hard",
    question: "async vs threading vs multiprocessing — kab kya?",
    answer:
`• async/await → bahut saare I/O ops (HTTP/LLM API/DB) parallel. Single thread, lightweight.
• threading → I/O bound, blocking libs jo async support nahi karti.
• multiprocessing → CPU bound (NumPy heavy compute, image processing). GIL bypass.
AI engineer mostly async (LLM calls) + multiprocessing (batch inference) use karta hai.` },
  { topicSlug: "python", order: 10, difficulty: "hard",
    question: "Pydantic vs dataclass?",
    answer: "Dataclass — plain typed container, no runtime validation. Pydantic — type-checked at runtime (raises ValidationError on bad data), JSON schema generation, FastAPI integration. AI engineer ke liye Pydantic standard hai (LLM structured output, API contracts)." },
  { topicSlug: "python", order: 11, difficulty: "hard",
    question: "Context manager kya hai? Custom kaise banayein?",
    answer:
`Resource acquire/release safe karta hai (file, DB, lock). \`with\` block end pe cleanup guaranteed.
Two ways:
1) Class with __enter__ / __exit__.
2) @contextlib.contextmanager decorator on a generator function.

from contextlib import contextmanager
@contextmanager
def timer(label):
    s = time.perf_counter()
    yield
    print(label, time.perf_counter()-s)

with timer("LLM call"):
    call_llm(...)` },
];
