import { T, H, C, N, L } from "./_helpers.mjs";

export const topic = {
  slug: "environment-setup",
  title: "Environment Setup (Industrial)",
  description:
    "venv, conda, poetry, uv — Python project industrial style me kaise setup karte hain. Dependency, .env, pre-commit, linting.",
  icon: "⚙️",
  color: "#10b981",
  order: 2,
};

export const sections = [
  {
    topicSlug: "environment-setup", slug: "why-env", order: 1,
    title: "Virtual Environment kyu chahiye?",
    summary: "Project-wise isolated dependencies — interview & job dono me must.",
    content: [
      H("Problem: Global install ka chakkar"),
      T("Agar har project ka package globally install karoge to:"),
      L([
        "**Version conflict** — Project A ko `langchain==0.1`, Project B ko `langchain==0.2` chahiye.",
        "**System pollution** — purane packages garbage banke pade rahenge.",
        "**Reproducibility gayab** — colleague ke machine pe wahi versions kaise milengi?",
        "**Deploy break** — local me chal raha, server pe alag versions = bug.",
      ]),
      H("Solution: Virtual Environment"),
      T("Ek **isolated folder** banao jisme us project ke specific Python + packages hote hain. Project khatam = folder delete, system clean."),
      N("Industry me **har project ka apna venv hota hai** — exceptions nahi. AI/ML me to PyTorch/TensorFlow versions itne picky hote hain ki bina venv project chalega hi nahi."),
    ],
  },
  {
    topicSlug: "environment-setup", slug: "venv", order: 2,
    title: "venv — Python ka built-in tool",
    summary: "Sabse simple, zero install — Python ke saath aata hai.",
    content: [
      H("Create + Activate"),
      C("bash",
`# Project folder me jao
cd my-ai-project

# Create (folder ka naam .venv standard hai)
python3 -m venv .venv

# Activate (Mac/Linux)
source .venv/bin/activate

# Activate (Windows PowerShell)
.venv\\Scripts\\Activate.ps1

# Activate (Windows CMD)
.venv\\Scripts\\activate.bat

# Check — prompt me (.venv) dikhna chahiye
which python      # path .venv ke andar ka hoga`,
        "Activate ke baad `python` aur `pip` is venv ke andar wale chalenge. System Python untouched rahega."),
      H("Install packages"),
      C("bash",
`pip install --upgrade pip
pip install openai langchain pandas

# Saare installed packages dekho
pip list

# Freeze (current versions ko file me save)
pip freeze > requirements.txt`,
        "`requirements.txt` me exact versions hoti hain — koi bhi same setup recreate kar sakta hai."),
      H("Recreate environment (naya machine pe)"),
      C("bash",
`python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt`,
        "3 lines me poora environment exactly waisa hi mil jata hai. Yehi reproducibility hai."),
      H("Deactivate"),
      C("bash", "deactivate", "Wapas system Python pe aa jaoge."),
      N("`.venv/` folder ko **hamesha `.gitignore` me daalo** — code share karna hai, venv binaries nahi."),
    ],
  },
  {
    topicSlug: "environment-setup", slug: "conda", order: 3,
    title: "Conda / Miniconda — Data Science Standard",
    summary: "Python + non-Python (CUDA, gcc) packages bhi handle karta hai.",
    content: [
      T("`conda` ek package + environment manager hai jo Python ke saath **system libraries** (CUDA, MKL, gcc) bhi install kar sakta hai — yahi ML/AI me iska bada fayda hai."),
      H("Install — Miniconda recommended"),
      L([
        "Miniconda (light, ~400MB) — docs.conda.io/projects/miniconda",
        "Anaconda (heavy, ~3GB, GUI + 1500+ packages) — beginners ke liye, par disk bhar deti hai.",
      ]),
      H("Common commands"),
      C("bash",
`# Naya env (with specific Python version)
conda create -n my-ai python=3.11 -y

# Activate / Deactivate
conda activate my-ai
conda deactivate

# Packages install (conda-forge channel preferred)
conda install -c conda-forge numpy pandas
# Conda me na ho to pip use kar lo
pip install langchain

# List environments
conda env list

# Export (saara state)
conda env export > environment.yml

# Recreate
conda env create -f environment.yml

# Remove
conda env remove -n my-ai`,
        "Conda ki killer feature: `conda install pytorch pytorch-cuda=12.1 -c pytorch -c nvidia` — CUDA bhi install ho jata hai bina manual setup."),
      N("AI/ML me Conda + pip mix common hai: heavy bins (PyTorch, CUDA) conda se, pure Python libs (LangChain, FastAPI) pip se."),
    ],
  },
  {
    topicSlug: "environment-setup", slug: "poetry", order: 4,
    title: "Poetry — Modern Dependency Management",
    summary: "pyproject.toml + lockfile, professional projects ke liye.",
    content: [
      T("`poetry` JavaScript ke npm jaisa experience deta hai — declarative `pyproject.toml`, lockfile, version resolution, build/publish. Production projects me bahut popular."),
      H("Install"),
      C("bash",
`curl -sSL https://install.python-poetry.org | python3 -

# Verify
poetry --version`),
      H("New project / existing project"),
      C("bash",
`# Naya project
poetry new my-ai-app
cd my-ai-app

# Existing project me poetry use karna
cd my-existing-app
poetry init       # interactive prompts

# Dependencies add
poetry add fastapi langchain openai
poetry add --group dev pytest ruff   # dev-only deps

# Install
poetry install

# Shell activate
poetry shell

# Ya direct run command env me
poetry run python main.py`,
        "`poetry add` automatically `pyproject.toml` + `poetry.lock` update karta hai. Lockfile exact resolved versions store karta hai."),
      H("pyproject.toml sample"),
      C("toml",
`[tool.poetry]
name = "my-ai-app"
version = "0.1.0"
description = "GenAI agent service"
authors = ["Shahrukh <s@example.com>"]

[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.115.0"
openai = "^1.40.0"
langchain = "^0.3.0"

[tool.poetry.group.dev.dependencies]
pytest = "^8.0.0"
ruff = "^0.6.0"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"`,
        "`^0.3.0` matlab `>=0.3.0, <0.4.0` (SemVer). Lockfile commit hota hai git me, reproducible installs ke liye."),
      N("Poetry industrial standard ban gaya hai backend/API projects me. Pure data science me conda zyada common hai."),
    ],
  },
  {
    topicSlug: "environment-setup", slug: "uv", order: 5,
    title: "uv — Sabse Fast (Rust-based)",
    summary: "2024 ka rising star. pip se 10-100x fast.",
    content: [
      T("`uv` Astral (ruff banane wale) ka Rust me likha hua tool hai — venv create + pip install dono karta hai, **bahut fast**. AI/ML community rapidly adopt kar rahi hai."),
      C("bash",
`# Install
curl -LsSf https://astral.sh/uv/install.sh | sh
# Mac: brew install uv

uv --version`),
      C("bash",
`# Naya project
uv init my-app
cd my-app

# Add dependencies (super fast)
uv add fastapi openai langchain
uv add --dev pytest ruff

# Sync env (install everything)
uv sync

# Run
uv run python main.py

# venv banao manually
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt`,
        "uv automatically `.venv` manage karta hai, `pyproject.toml` + `uv.lock` write karta hai. pip se 10-100x fast install."),
      N("Naye projects me uv recommend hai. Speed + simplicity ek saath. Backward compatible — purane requirements.txt bhi chalti hain."),
    ],
  },
  {
    topicSlug: "environment-setup", slug: "env-files", order: 6,
    title: ".env Files — Secrets Properly",
    summary: "API keys hardcode kabhi mat karo.",
    content: [
      H("Problem"),
      T("OPENAI_API_KEY agar code me likha to:"),
      L([
        "Git me push ho jayega → public repo me leak.",
        "Multiple developers me share karna painful.",
        "Dev/staging/prod me alag values nahi de sakte easily.",
      ]),
      H("Solution: .env file"),
      C("text",
`# .env (ye file NEVER COMMIT)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx
DATABASE_URL=postgres://user:pass@localhost:5432/app
LOG_LEVEL=INFO`,
        "Simple key=value pairs. Yeh file `.gitignore` me must hai."),
      C("text",
`# .gitignore me ye add karo
.env
.env.local
.env.*.local
.venv/
__pycache__/
*.pyc`),
      H("Code me read karna"),
      C("python",
`from dotenv import load_dotenv
import os

load_dotenv()   # .env file ki values environment me load

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("OPENAI_API_KEY missing")`,
        "`python-dotenv` package install karna padta hai: `pip install python-dotenv`. Production me actual env vars set hote hain (docker, k8s), .env sirf local dev ke liye."),
      H(".env.example commit karo"),
      C("text",
`# .env.example (commit this — sirf keys, dummy values)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
DATABASE_URL=
LOG_LEVEL=INFO`,
        "Naya developer dekh leta hai kaun-si vars set karni hain bina actual secret leak kiye."),
      H("Pydantic Settings (production-grade)"),
      C("python",
`from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    openai_api_key: str
    log_level: str = "INFO"
    db_url: str

    class Config:
        env_file = ".env"

settings = Settings()    # auto-validation, missing key → error`,
        "Type-safe config. Industry me FastAPI projects me ye pattern dominant hai."),
    ],
  },
  {
    topicSlug: "environment-setup", slug: "industrial-layout", order: 7,
    title: "Industrial Project Layout",
    summary: "Real GenAI service ka structure.",
    content: [
      C("text",
`my-ai-service/
├── .env.example
├── .gitignore
├── .python-version           # 3.11.7  (pyenv ke liye)
├── pyproject.toml
├── README.md
├── Dockerfile
├── docker-compose.yml
├── Makefile                  # common commands
├── src/
│   └── myapp/
│       ├── __init__.py
│       ├── main.py           # FastAPI entrypoint
│       ├── config.py         # Pydantic Settings
│       ├── api/
│       │   ├── __init__.py
│       │   └── routes.py
│       ├── core/
│       │   ├── llm.py        # LLM client wrapper
│       │   ├── prompts.py    # prompt templates
│       │   └── vectorstore.py
│       ├── agents/
│       │   └── research.py
│       ├── schemas/          # Pydantic models
│       │   └── chat.py
│       └── utils/
│           └── logger.py
├── tests/
│   ├── conftest.py
│   ├── test_api.py
│   └── test_agents.py
└── scripts/
    └── ingest_docs.py`,
        "Bigger projects me `src/` layout test isolation aur packaging me help karta hai. Each folder ek clear responsibility."),
      H("Makefile — common commands ek jagah"),
      C("makefile",
`.PHONY: install dev test lint format

install:
	uv sync

dev:
	uv run uvicorn src.myapp.main:app --reload

test:
	uv run pytest -v

lint:
	uv run ruff check src tests

format:
	uv run ruff format src tests

docker-build:
	docker build -t myapp:latest .`,
        "`make dev`, `make test` likhna — har dev ko same commands. Onboarding 10x easy."),
    ],
  },
  {
    topicSlug: "environment-setup", slug: "linting-formatting", order: 8,
    title: "Linting & Formatting — ruff + pre-commit",
    summary: "Code quality automated.",
    content: [
      H("ruff — sabse fast linter + formatter"),
      C("bash",
`uv add --dev ruff
# ya
pip install ruff

# Check (linting)
ruff check src

# Auto-fix
ruff check --fix src

# Format (black-compatible)
ruff format src`,
        "Ruff Rust me likha hai — flake8/black/isort sab ka kaam karta hai aur 100x fast hai. Industry me dominate kar raha hai 2024+."),
      H("Config in pyproject.toml"),
      C("toml",
`[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP", "N"]
# E=pycodestyle, F=pyflakes, I=isort, B=bugbear, UP=pyupgrade, N=naming
ignore = ["E501"]   # line too long (formatter handle karega)`,
        "Project-wide rules. Team me consistency aati hai."),
      H("pre-commit — commit se pehle automatic check"),
      C("yaml",
`# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.6.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format

  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files`,
        "Git commit karte hi ye hooks run honge — bad code commit hi nahi hone dega."),
      C("bash",
`pip install pre-commit
pre-commit install     # git hook setup (one time)
pre-commit run --all-files   # manually check sab files`),
      N("CI pipeline me bhi same checks chalao — bypass kisi se na ho jaye."),
    ],
  },
  {
    topicSlug: "environment-setup", slug: "python-version", order: 9,
    title: "Multiple Python Versions — pyenv",
    summary: "Project ko specific Python version chahiye to.",
    content: [
      T("Different projects me alag Python version chahiye (3.10, 3.11, 3.12). `pyenv` system pe multiple versions install/switch karne deta hai bina system Python touch kiye."),
      C("bash",
`# Install (Mac)
brew install pyenv

# Available versions
pyenv install --list | grep " 3.1"

# Install specific version
pyenv install 3.11.9
pyenv install 3.12.4

# Set globally
pyenv global 3.11.9

# Set per-project (folder me .python-version file banegi)
cd my-project
pyenv local 3.12.4

python --version    # 3.12.4 yahan, baki folders me global`,
        "`.python-version` file commit hoti hai — koi bhi clone karke same version use kare."),
      N("Conda use kar rahe ho to pyenv ki utni zarurat nahi — conda khud Python install karta hai."),
    ],
  },
];

export const interview = [
  { topicSlug: "environment-setup", order: 1, difficulty: "easy",
    question: "Virtual environment kyu zaroori hai?",
    answer: "Project-wise isolated dependencies. Version conflicts avoid karne, reproducibility (same versions everywhere), aur clean uninstall (folder delete = done) ke liye." },
  { topicSlug: "environment-setup", order: 2, difficulty: "easy",
    question: "requirements.txt kaise banate aur use karte ho?",
    answer: "`pip freeze > requirements.txt` se generate. New env me `pip install -r requirements.txt` se recreate. Exact versions pin karna chahiye (e.g., `langchain==0.3.5`), `>=` se random updates aakar break ho sakta hai." },
  { topicSlug: "environment-setup", order: 3, difficulty: "easy",
    question: "venv vs conda?",
    answer:
`• venv → built-in, lightweight, Python-only packages.
• conda → Python + system libs (CUDA, MKL, gcc), heavy bins, multi-language. ML/AI me CUDA setup ke liye conda preferred.
General backend services → venv/poetry/uv. GPU heavy ML → conda.` },
  { topicSlug: "environment-setup", order: 4, difficulty: "medium",
    question: "poetry vs pip + requirements.txt?",
    answer:
`pip + requirements.txt — simple, manual dependency tracking, no lockfile by default.
poetry — pyproject.toml (declarative), poetry.lock (exact resolved tree), version resolution, dev/prod groups, build/publish. Modern projects me poetry standard hai.` },
  { topicSlug: "environment-setup", order: 5, difficulty: "medium",
    question: "API keys ko code me daalna kyu galat hai? Sahi tarika?",
    answer:
`Git me leak ho jata hai (public/team visible), rotate karna painful, env-wise alag value dena impossible.
Sahi: .env file + python-dotenv ya Pydantic Settings. .env ko .gitignore me. Production me actual env vars set karo (docker/k8s/secret manager). Repo me .env.example commit karo (keys with empty values).` },
  { topicSlug: "environment-setup", order: 6, difficulty: "medium",
    question: "pyproject.toml me kya hota hai?",
    answer: "Modern Python project ka manifest file. Project metadata (name, version, authors), dependencies, dev-dependencies, build config, tool configs (ruff, pytest, mypy) — sab ek hi file me. PEP 518/621 standard." },
  { topicSlug: "environment-setup", order: 7, difficulty: "medium",
    question: "Lockfile kya hota hai? Kyu commit karna chahiye?",
    answer: "poetry.lock / uv.lock me exact resolved version + hash of every direct & transitive dependency hota hai. Commit karne se har developer & CI/CD pe exactly same versions install hoti hain — reproducibility guarantee." },
  { topicSlug: "environment-setup", order: 8, difficulty: "hard",
    question: "uv ka kya advantage hai pip/poetry pe?",
    answer:
`• Rust me likha → 10-100x fast install/resolve.
• Single tool — venv + pip + poetry ka kaam.
• pyproject.toml + uv.lock standard format.
• Backward compatible (pip install requirements.txt bhi chalti hai).
• Drop-in: \`uv pip install\` pip ki tarah chalti hai. AI/ML community fast adopt kar rahi hai.` },
  { topicSlug: "environment-setup", order: 9, difficulty: "hard",
    question: "pre-commit hooks ka kya use? Setup kaise?",
    answer: "Commit karne se PEHLE automatic checks (lint, format, secret detection). Bad code/secrets commit hi nahi honge. Setup: `.pre-commit-config.yaml` likho, `pre-commit install` se git hook setup, `pre-commit run --all-files` se manually run. CI me bhi same checks chalao." },
];
