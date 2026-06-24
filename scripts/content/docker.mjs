import { T, H, C, N, L } from "./_helpers.mjs";

export const topic = {
  slug: "docker",
  title: "Docker",
  description:
    "Container-based packaging. LLM apps, vector DBs, dependencies — same setup local/staging/prod. AI deployment me unavoidable.",
  icon: "🐳",
  color: "#2496ed",
  order: 9,
};

export const sections = [
  {
    topicSlug: "docker", slug: "introduction", order: 1,
    title: "Introduction — Container vs VM",
    summary: "Kyu Docker, kab use kare.",
    content: [
      T("Docker app ko **container** me package karta hai — app + dependencies + config ek isolated unit. 'Mere PC pe chal raha tha' wali problem khatam."),
      H("Container vs VM"),
      L([
        "**VM** — full guest OS virtualize. Heavy (GB), slow boot (minutes).",
        "**Container** — host OS kernel share. Light (MB), fast (seconds).",
        "Container me isolation namespaces + cgroups se aata hai — process level.",
      ]),
      H("Use cases for AI engineer"),
      L([
        "FastAPI service + Python deps containerize.",
        "Postgres + pgvector + Redis local me ek command me.",
        "GPU-enabled inference container (nvidia-docker).",
        "Reproducible eval pipelines.",
        "CI/CD me consistent build env.",
      ]),
      C("bash", "docker --version", "Install: Docker Desktop (Mac/Win) ya Docker Engine (Linux)."),
    ],
  },
  {
    topicSlug: "docker", slug: "basic-commands", order: 2,
    title: "Basic Commands",
    summary: "pull, run, ps, logs, exec, stop.",
    content: [
      C("bash",
`# Image pull (download from registry, default Docker Hub)
docker pull postgres:16

# Run container
docker run -d \\
  --name pg \\
  -e POSTGRES_PASSWORD=secret \\
  -p 5432:5432 \\
  postgres:16

# Common flags:
#   -d         detached (background)
#   --name     human-readable name
#   -e         env variable
#   -p H:C     host:container port map
#   -v H:C     volume mount
#   --rm       container exit hote hi delete
#   -it        interactive + tty (shells ke liye)

# List
docker ps                  # running
docker ps -a               # sab (stopped bhi)

# Logs
docker logs -f pg          # follow (tail -f)

# Shell andar
docker exec -it pg bash
docker exec -it pg psql -U postgres

# Stop / start / remove
docker stop pg
docker start pg
docker rm pg               # delete container
docker rm -f pg            # force (running ho to bhi)
docker rmi postgres:16     # delete image`,
        "AI engineer roz ye commands use karta hai — local dev me Postgres/Redis/Qdrant Docker me hi run hote hain."),
    ],
  },
  {
    topicSlug: "docker", slug: "dockerfile-basics", order: 3,
    title: "Dockerfile — Apna Image Banao",
    summary: "Reproducible image build instructions.",
    content: [
      C("dockerfile",
`# Base image
FROM python:3.11-slim

# Metadata
LABEL maintainer="shahrukh@example.com"

# Env vars
ENV PYTHONUNBUFFERED=1 \\
    PYTHONDONTWRITEBYTECODE=1 \\
    PIP_NO_CACHE_DIR=1

# Working dir
WORKDIR /app

# Dependencies pehle (cache-friendly)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Phir code
COPY . .

# Port (informational only)
EXPOSE 8000

# Container start command
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]`,
        "**Order matters!** Dependencies pehle copy → kuch change na ho to install layer cache se aati hai. Code change pe sirf last layer rebuild."),
      H("Build & run"),
      C("bash",
`# Build (Dockerfile current dir me)
docker build -t my-ai-app:0.1 .

# Run
docker run -d -p 8000:8000 --env-file .env my-ai-app:0.1

# Push to registry
docker tag my-ai-app:0.1 myregistry.com/my-ai-app:0.1
docker push myregistry.com/my-ai-app:0.1`),
      H("Common Dockerfile instructions"),
      L([
        "`FROM` — base image.",
        "`RUN` — build time pe command (creates layer).",
        "`COPY` / `ADD` — files copy.",
        "`WORKDIR` — cd into directory.",
        "`ENV` — env variable.",
        "`EXPOSE` — port document (publish nahi karta).",
        "`CMD` — default run command (override possible).",
        "`ENTRYPOINT` — fixed executable.",
        "`USER` — non-root user pe switch.",
        "`HEALTHCHECK` — container health probe.",
      ]),
    ],
  },
  {
    topicSlug: "docker", slug: "dockerignore", order: 4,
    title: ".dockerignore — Build context chhota karo",
    summary: "Faster builds, smaller images.",
    content: [
      C("text",
`# .dockerignore
__pycache__
*.pyc
.venv
venv
.env
.env.local
.git
.github
.vscode
.idea
node_modules
*.md
tests/
docs/
*.log
.DS_Store`,
        "Build context (saari files Docker daemon ko bhejti hain) chhota karne se build 5-10x fast ho jata hai. Plus accidentally `.env` image me jaane ka risk khatam."),
    ],
  },
  {
    topicSlug: "docker", slug: "multistage", order: 5,
    title: "Multi-Stage Builds",
    summary: "Final image chhoti — production must.",
    content: [
      T("Multi-stage me build dependencies (compilers, dev libs) ek stage me, sirf artifacts final stage me copy. Final image **bahut chhoti aur secure**."),
      C("dockerfile",
`# ---- Stage 1: builder ----
FROM python:3.11 AS builder
WORKDIR /build
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# ---- Stage 2: runtime ----
FROM python:3.11-slim
WORKDIR /app

# Sirf installed packages copy (build tools nahi)
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Non-root user (security)
RUN useradd -m -u 1000 appuser && chown -R appuser /app
USER appuser

COPY --chown=appuser . .

EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]`,
        "Final image se compilers, build artifacts hat gaye. Slim Python base + sirf installed wheels. Production size aksar 80% chhoti."),
      H("ML use case — model training vs serving"),
      C("dockerfile",
`FROM nvidia/cuda:12.2-devel AS trainer
# heavy: torch+cuda+training scripts
...

FROM python:3.11-slim AS serve
# light: torch-cpu/onnx + FastAPI + model weights
COPY --from=trainer /model/output.onnx /app/model.onnx
...`,
        "Training stage me CUDA, dev tools. Serving stage me sirf inference dependencies — image GB se MB me aa jati hai."),
    ],
  },
  {
    topicSlug: "docker", slug: "volumes-networks", order: 6,
    title: "Volumes & Networks",
    summary: "Persistent data + container-to-container.",
    content: [
      H("Volumes — data persist karo"),
      C("bash",
`# Named volume (recommended)
docker volume create pgdata

docker run -d \\
  -v pgdata:/var/lib/postgresql/data \\
  -e POSTGRES_PASSWORD=secret \\
  -p 5432:5432 \\
  postgres:16

# Bind mount (host path — dev me code reload ke liye)
docker run -d \\
  -v $(pwd):/app \\
  -p 8000:8000 \\
  my-ai-app

# Inspect
docker volume ls
docker volume inspect pgdata
docker volume rm pgdata`,
        "Container delete = inside data gone. Volume = data persists across container lifecycle. DB/Redis hamesha volume pe."),
      H("Networks — containers ko connect"),
      C("bash",
`# Custom network banao
docker network create ai-net

# Same network me services
docker run -d --network ai-net --name pg postgres:16
docker run -d --network ai-net --name app -p 8000:8000 my-ai-app

# 'app' container 'pg' ko hostname se reach kar sakta hai
# Inside app: psycopg2.connect(host='pg', port=5432, ...)`,
        "Same network ke containers ek dusre ko **service name se** access kar sakte hain. localhost nahi chalti — container me localhost = container itself."),
    ],
  },
  {
    topicSlug: "docker", slug: "compose", order: 7,
    title: "Docker Compose — Multi-Container Apps",
    summary: "App + DB + Vector DB + Redis ek YAML me.",
    content: [
      C("yaml",
`# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgres://postgres:secret@db:5432/myapp
      - REDIS_URL=redis://redis:6379
      - QDRANT_URL=http://qdrant:6333
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
      qdrant:
        condition: service_started
    volumes:
      - ./src:/app/src   # dev hot-reload

  db:
    image: postgres:16
    environment:
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=myapp
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  pgdata:
  qdrant_data:`,
        "Pura GenAI stack — FastAPI app + Postgres + Redis (cache) + Qdrant (vector DB). Industry me yahi pattern."),
      H("Compose commands"),
      C("bash",
`docker compose up -d            # sab start (background)
docker compose down             # sab stop + remove
docker compose down -v          # volumes bhi delete
docker compose logs -f app      # specific service logs
docker compose exec app bash    # service me shell
docker compose ps               # status
docker compose build app        # rebuild specific
docker compose restart app`,
        "**`up -d`** = sabse common dev command. Onboarding script literally yehi hota."),
    ],
  },
  {
    topicSlug: "docker", slug: "ai-deployment", order: 8,
    title: "Docker for AI/ML Deployment",
    summary: "GPU, model serving, healthchecks.",
    content: [
      H("GPU support (NVIDIA)"),
      C("bash",
`# Install nvidia-container-toolkit (host pe)
# Phir:
docker run --gpus all nvidia/cuda:12.2-base nvidia-smi

# PyTorch GPU container
docker run --gpus all -it \\
  -v $(pwd):/workspace \\
  pytorch/pytorch:2.3.0-cuda12.1-cudnn8-runtime \\
  python train.py`,
        "Production GPU inference servers Docker me hi deploy hote hain. `--gpus all` ya `--gpus '\"device=0,1\"'`."),
      H("Inference server Dockerfile"),
      C("dockerfile",
`FROM python:3.11-slim AS base

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Model weights pre-load karo (cold start fast)
COPY models/ /app/models/
COPY src/ /app/src/

# Non-root
RUN useradd -m -u 1000 mlserver
USER mlserver

# Health check (Kubernetes/load balancer ke liye)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s \\
  CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]`,
        "Healthcheck endpoint Kubernetes liveness probe banata hai — unhealthy container auto-restart hota hai."),
      H("Image size — embedding model example"),
      L([
        "Naive: `FROM python` + `pip install sentence-transformers` → 5-8 GB image (CUDA libs include).",
        "Optimized: slim base + CPU-only torch + cache model in build → 1-2 GB.",
        "Production: multi-stage + alpine where possible → sub-1 GB.",
      ]),
    ],
  },
  {
    topicSlug: "docker", slug: "best-practices", order: 9,
    title: "Production Best Practices",
    summary: "Security, size, speed.",
    content: [
      L([
        "**Specific tags** — `python:3.11.9-slim`, NOT `python:latest` (drift).",
        "**Multi-stage** — final image small + no build tools.",
        "**Non-root user** — `USER appuser` (security).",
        "**Layer caching** — dependencies pehle copy.",
        "**.dockerignore** — context fast + no secret leaks.",
        "**Healthchecks** — orchestrator ko bata sake.",
        "**Read-only fs** where possible — `docker run --read-only`.",
        "**Resource limits** — `--memory 2g --cpus 1.5`.",
        "**Scan images** — `docker scout`, `trivy` se vulnerabilities check.",
        "**Pin digests** — `python:3.11.9-slim@sha256:abc...` (supply chain).",
      ]),
      N("Secrets ko **image me kabhi bake mat karo**. Build-time env, multi-stage me bhi history me reh jate hain. Runtime env vars ya secret manager use karo."),
    ],
  },
];

export const interview = [
  { topicSlug: "docker", order: 1, difficulty: "easy",
    question: "Image vs Container?",
    answer: "Image — read-only template (class jaisa). Container — image ka running instance with writable layer (object jaisa). Ek image se 100 containers run kar sakte hain." },
  { topicSlug: "docker", order: 2, difficulty: "easy",
    question: "CMD vs ENTRYPOINT?",
    answer: "CMD — default command/args, run time pe override ho jaate. ENTRYPOINT — fixed executable, CMD uske args ban jate. Best practice: ENTRYPOINT me binary, CMD me default args. `docker run img --custom-arg` se CMD override hota." },
  { topicSlug: "docker", order: 3, difficulty: "easy",
    question: "COPY vs ADD?",
    answer: "COPY — simple file/dir copy. ADD — COPY + tar auto-extract + URL fetch. ADD ka URL feature flaky aur insecure. Mostly COPY use karo, tar extract chahiye tabhi ADD." },
  { topicSlug: "docker", order: 4, difficulty: "medium",
    question: "Multi-stage build kyu?",
    answer: "Build tools (compilers, dev libs) ek stage me, sirf artifact final stage me copy. Final image small (50-80% reduction), secure (no compilers), fast deploy. ML me training stage CUDA-heavy, serving stage lightweight." },
  { topicSlug: "docker", order: 5, difficulty: "medium",
    question: "Container me data persist kaise hoga?",
    answer: "Container ka writable layer ephemeral hai. Persistent data ke liye VOLUME use karo. Named volume (docker manage karta) ya bind mount (host path). DB/Redis hamesha volume pe — warna restart pe sab gone." },
  { topicSlug: "docker", order: 6, difficulty: "medium",
    question: "Image size chhota kaise karein?",
    answer:
`• Slim/alpine base.
• Multi-stage build.
• Single RUN me commands combine (less layers).
• apt-get install ke baad cache clean (rm -rf /var/lib/apt/lists/*).
• .dockerignore se garbage skip.
• Pip me --no-cache-dir.
• Unused dependencies remove (audit requirements).` },
  { topicSlug: "docker", order: 7, difficulty: "medium",
    question: "Docker Compose vs docker run — kab kya?",
    answer: "Single container quick test → docker run. Multi-service app (app+db+cache+vector-db) → Compose. Compose me declarative YAML, networks/volumes auto, ek command me sab. Production Kubernetes me Compose nahi chalti — par dev/CI me standard." },
  { topicSlug: "docker", order: 8, difficulty: "hard",
    question: "Compose me service A, service B ko hostname se kaise dhundhta?",
    answer: "Compose default ek bridge network banata hai jisme sab services join hoti hain. Service NAME = DNS hostname. Service `db` ko `app` container `postgres://db:5432` se reach karta — localhost nahi." },
  { topicSlug: "docker", order: 9, difficulty: "hard",
    question: "Secrets Docker me kaise handle?",
    answer:
`• Image me NEVER bake — git history aur image layers me leak.
• Build args bhi history me — sensitive ke liye mat use.
• Runtime: env vars (--env / --env-file), volumes me mounted file, Docker secrets (Swarm), ya external secret manager (Vault, AWS SM, k8s Secrets).
• Compose me .env file (gitignored) + \${VAR} interpolation common pattern.` },
  { topicSlug: "docker", order: 10, difficulty: "hard",
    question: "GPU container kaise chalate?",
    answer:
`Host pe nvidia-container-toolkit install. Phir:
docker run --gpus all my-img
ya specific GPU:
docker run --gpus '"device=0"' my-img
Image me NVIDIA CUDA base (nvidia/cuda) ya pytorch/pytorch (CUDA included) use karo. Inside container nvidia-smi se verify.` },
];
