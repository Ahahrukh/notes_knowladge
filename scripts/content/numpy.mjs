import { T, H, C, N, L } from "./_helpers.mjs";

export const topic = {
  slug: "numpy",
  title: "NumPy",
  description:
    "Numerical computing ka base. Embeddings, tensors, matrix math — sab NumPy ke ndarray se start hote hain.",
  icon: "🔢",
  color: "#013243",
  order: 4,
};

export const sections = [
  {
    topicSlug: "numpy", slug: "introduction", order: 1,
    title: "Introduction & Install",
    summary: "Kya hai, kyu fast hai, install.",
    content: [
      T("NumPy = **Numerical Python**. Core data structure `ndarray` (N-dimensional array). PyTorch/TensorFlow tensors NumPy se inspired hain — convert bhi free me hota hai."),
      H("Kyu fast hai?"),
      L([
        "Contiguous memory me C arrays.",
        "Vectorized ops — Python loop ka overhead nahi.",
        "BLAS/LAPACK linked — SIMD/AVX instructions use karta hai.",
        "Single dtype isliye type check har element pe nahi.",
      ]),
      C("bash", "pip install numpy"),
      C("python", "import numpy as np", "Convention: alias `np`."),
    ],
  },
  {
    topicSlug: "numpy", slug: "arrays-create", order: 2,
    title: "Array Create & Inspect",
    summary: "shape, dtype, ndim — embeddings ke liye foundational.",
    content: [
      C("python",
`a = np.array([1, 2, 3, 4])              # 1D
b = np.array([[1,2,3],[4,5,6]])          # 2D matrix
c = np.array([[[1,2],[3,4]],[[5,6],[7,8]]])  # 3D tensor

a.shape, b.shape, c.shape   # (4,), (2,3), (2,2,2)
b.dtype                     # int64
b.ndim                      # 2
b.size                      # 6 (total elements)
b.itemsize                  # 8 bytes per element`,
        "Shape always tuple. AI me embeddings usually `(N, D)` shape ka 2D array — N samples, D dimensions."),
      H("Quick constructors"),
      C("python",
`np.zeros((3, 5))            # 3x5 zeros
np.ones((2, 4))             # 2x4 ones
np.full((2,3), 7)           # 2x3 sab 7
np.eye(4)                   # identity matrix
np.arange(0, 10, 2)         # [0 2 4 6 8]
np.linspace(0, 1, 5)        # 5 equally-spaced  [0, .25, .5, .75, 1]
np.empty((3,3))             # uninitialized (fast, garbage values)`,
        "ML me weights init karne, masks banane, indexing test me kaam aate hain."),
      H("dtype set/cast"),
      C("python",
`np.array([1,2,3], dtype=np.float32)
a.astype(np.float16)        # memory bachao (half precision)`,
        "AI me float32/float16/bfloat16 kaafi common — GPU memory + speed tradeoffs."),
    ],
  },
  {
    topicSlug: "numpy", slug: "indexing-slicing", order: 3,
    title: "Indexing, Slicing & Fancy Indexing",
    summary: "Cells, rows, columns, boolean mask.",
    content: [
      C("python",
`a = np.arange(20).reshape(4, 5)
# [[ 0  1  2  3  4]
#  [ 5  6  7  8  9]
#  [10 11 12 13 14]
#  [15 16 17 18 19]]

a[1, 2]             # 7         (row 1, col 2)
a[0]                # [0,1,2,3,4]  (row 0)
a[:, 1]             # column 1
a[1:3, :2]          # rows 1-2, cols 0-1
a[::-1]             # rows reversed`,
        "Slicing `start:stop:step`, har dim me alag. **Slice VIEW deta hai — copy nahi**. Modify karoge to original bhi change."),
      H("Boolean mask"),
      C("python",
`a = np.array([3, 7, 1, 9, 4])
mask = a > 4              # [False, True, False, True, False]
a[mask]                   # [7, 9]
a[a > 4] = 0              # condition wali jagah modify`,
        "ML me bahut common — outliers replace, conditions filter."),
      H("Fancy indexing"),
      C("python",
`a = np.array([10, 20, 30, 40, 50])
a[[0, 2, 4]]              # [10, 30, 50]
a[[True, False, True, False, True]]
# Same as boolean above`,
        "Index ki list pass karke arbitrary order me values nikal sakte ho — **copy banta hai**, view nahi."),
    ],
  },
  {
    topicSlug: "numpy", slug: "broadcasting", order: 4,
    title: "Vectorization & Broadcasting",
    summary: "Loop ke bina element-wise math — speed ka secret.",
    content: [
      C("python",
`a = np.array([1, 2, 3])
b = np.array([10, 20, 30])

a + b      # [11, 22, 33]   element-wise
a * b      # [10, 40, 90]
np.sqrt(a) # [1, 1.41, 1.73]
a ** 2     # [1, 4, 9]
a > 2      # [False, False, True]`,
        "**Universal functions (ufuncs)** — element-wise, internal C loop. Python loop se 50-100x fast."),
      H("Broadcasting rules"),
      T("Different shape ke arrays ko NumPy automatically compatible bana deta hai (logically replicate karke). Right-to-left dims compare: equal ya size 1 ho to ok."),
      C("python",
`M = np.array([[1,2,3],[4,5,6]])    # (2,3)
v = np.array([10, 20, 30])         # (3,)
M + v
# [[11, 22, 33],
#  [14, 25, 36]]   -- v har row me broadcast hua

col = np.array([[1],[2]])          # (2,1)
M + col
# [[2, 3, 4],
#  [6, 7, 8]]      -- col har column me broadcast hua`,
        "Broadcasting memory efficient hai — actual replication nahi hoti, just logical view."),
      H("Real example: normalize features"),
      C("python",
`X = np.random.randn(1000, 50)       # 1000 samples, 50 features
mean = X.mean(axis=0)               # shape (50,)
std  = X.std(axis=0)                # shape (50,)
X_norm = (X - mean) / std           # broadcast — (1000,50) - (50,)`,
        "ML preprocessing me roz aata hai. Loop likhne ki zarurat nahi."),
    ],
  },
  {
    topicSlug: "numpy", slug: "reshape-stack", order: 5,
    title: "Reshape, Transpose, Stack, Split",
    summary: "Tensors ko shape badalna — neural nets me daily kaam.",
    content: [
      C("python",
`a = np.arange(12)
a.reshape(3, 4)             # (3,4)
a.reshape(2, 2, 3)          # (2,2,3)
a.reshape(-1, 4)            # -1 means "auto calc" → (3,4)

m = np.array([[1,2,3],[4,5,6]])
m.T                         # transpose (3,2)
m.transpose()               # same
np.transpose(m, (1, 0))     # axes reorder explicit
m.flatten()                 # 1D copy
m.ravel()                   # 1D view (faster)`,
        "`-1` reshape me 'figure it out' karta hai. Neural nets me `(batch, channels, H, W) ↔ (batch, H*W*C)` flatten common."),
      H("Stack / concat / split"),
      C("python",
`a = np.array([1,2,3])
b = np.array([4,5,6])

np.concatenate([a, b])          # [1,2,3,4,5,6]
np.stack([a, b])                # (2,3) — new axis add
np.vstack([a, b])               # (2,3) row-wise
np.hstack([a, b])               # (6,) horizontal

x = np.arange(8).reshape(2,4)
np.split(x, 2, axis=1)          # 2 arrays of (2,2)`,
        "Batch processing, train/test split, channel concat — sab me kaam aate hain."),
    ],
  },
  {
    topicSlug: "numpy", slug: "math-stats", order: 6,
    title: "Math, Stats, Aggregations",
    summary: "sum, mean, std, max — axis ke saath.",
    content: [
      C("python",
`a = np.array([[1,2,3],[4,5,6]])

a.sum()              # 21        (all)
a.sum(axis=0)        # [5, 7, 9]   (column-wise)
a.sum(axis=1)        # [6, 15]     (row-wise)

a.mean()             # 3.5
a.std()              # standard deviation
a.var()              # variance
a.min(), a.max()
a.argmax()           # max ka flat index
a.argmax(axis=1)     # har row ka max ka index

np.percentile(a, 50)     # median
np.quantile(a, 0.95)     # 95th percentile`,
        "**axis = jis dimension ko collapse karna hai**. axis=0 → rows collapse (column-wise output). axis=1 → cols collapse (row-wise)."),
      H("argmax / argsort — ML me critical"),
      C("python",
`# Classification — predicted class
logits = np.array([0.1, 0.7, 0.2])
predicted_class = logits.argmax()     # 1

# Top-k retrieval (cosine similarity scores)
scores = np.array([0.3, 0.9, 0.1, 0.7, 0.5])
top3 = scores.argsort()[::-1][:3]     # [1, 3, 4]
# Vector DB retrieval ka core logic`,
        "RAG / vector search me yehi pattern: similarity scores → argsort → top-k indices."),
    ],
  },
  {
    topicSlug: "numpy", slug: "linalg", order: 7,
    title: "Linear Algebra — Matrix Ops",
    summary: "Dot product, matmul, inverse — embeddings/transformer ka math.",
    content: [
      C("python",
`A = np.array([[1,2],[3,4]])
B = np.array([[5,6],[7,8]])

A @ B                       # matrix multiply (Python 3.5+ operator)
np.matmul(A, B)             # same
A.dot(B)                    # same

A * B                       # element-wise (NOT matrix mult!)
np.linalg.inv(A)            # inverse
np.linalg.det(A)            # determinant

eigvals, eigvecs = np.linalg.eig(A)
U, S, Vt = np.linalg.svd(A)     # SVD — dimensionality reduction (PCA)`,
        "**`@` matrix multiply, `*` element-wise** — sabse common confusion. Transformer attention: `Q @ K.T / sqrt(d)`."),
      H("Cosine similarity (RAG ka heart)"),
      C("python",
`def cosine_sim(a, b):
    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Batch version — 1 query vs many docs
def cosine_sim_batch(query, docs):
    # query: (D,), docs: (N, D)
    q_norm = query / np.linalg.norm(query)
    d_norm = docs / np.linalg.norm(docs, axis=1, keepdims=True)
    return d_norm @ q_norm    # (N,) similarity scores

scores = cosine_sim_batch(query_emb, doc_embs)
top_k = scores.argsort()[::-1][:5]`,
        "Yehi har vector DB ka core hai. Sirf NumPy se mini-RAG ban sakta hai!"),
    ],
  },
  {
    topicSlug: "numpy", slug: "random", order: 8,
    title: "Random Numbers & Seeding",
    summary: "Reproducibility ke liye seed must.",
    content: [
      C("python",
`rng = np.random.default_rng(seed=42)    # Modern Generator API

rng.random((3, 3))                # uniform [0,1)
rng.integers(0, 10, size=5)       # int in [0,10)
rng.normal(loc=0, scale=1, size=100)   # Gaussian (mean=0, std=1)
rng.choice([1,2,3,4,5], size=3)   # random pick
rng.shuffle(arr)                  # in-place shuffle

# Old API (still works)
np.random.seed(42)
np.random.randn(3, 3)`,
        "**Seed lagao reproducibility ke liye** — same seed = same numbers. Training/experiments compare karne me critical."),
      N("Modern API (`default_rng`) recommended hai — thread-safe, faster, better statistics."),
    ],
  },
  {
    topicSlug: "numpy", slug: "save-load", order: 9,
    title: "Save / Load Arrays",
    summary: "Embeddings cache, model weights persist.",
    content: [
      C("python",
`# Single array
np.save("embeddings.npy", arr)
loaded = np.load("embeddings.npy")

# Multiple arrays in one file
np.savez("model.npz", weights=W, biases=b)
data = np.load("model.npz")
W = data["weights"]

# Compressed
np.savez_compressed("big.npz", X=X, y=y)

# Text (slow, human-readable)
np.savetxt("out.csv", arr, delimiter=",")`,
        "Embeddings recompute karna mehnga hai — disk pe cache karke load karna common pattern."),
    ],
  },
  {
    topicSlug: "numpy", slug: "performance", order: 10,
    title: "Performance Tips",
    summary: "Loop hatao, vectorize, dtype smart choose.",
    content: [
      L([
        "**Vectorize** — Python loop ki jagah NumPy ops.",
        "**Pre-allocate** — `np.zeros(N)` banake fill karo, dynamic append nahi.",
        "**Right dtype** — float32 mostly enough (float64 ka memory 2x).",
        "**Views vs copies** — slicing view hai, fancy indexing copy. Aware raho.",
        "**Avoid concatenate in loop** — O(n²). Pre-allocate ya list me append karke end me array.",
        "**`np.where`** — branching ke liye loop ki jagah.",
      ]),
      C("python",
`# SLOW
result = []
for x in arr:
    result.append(x*2 if x>0 else 0)

# FAST (vectorized)
result = np.where(arr > 0, arr*2, 0)`,
        "Same logic, 50-100x speedup."),
    ],
  },
];

export const interview = [
  { topicSlug: "numpy", order: 1, difficulty: "easy",
    question: "Python list vs NumPy array — kyu NumPy?",
    answer: "NumPy: contiguous C array, single dtype, vectorized ops, SIMD instructions. List: heterogeneous, pointers everywhere, slow loops. Numerical work me NumPy 50-100x faster + 4-10x less memory." },
  { topicSlug: "numpy", order: 2, difficulty: "easy",
    question: "View vs Copy?",
    answer: "Basic slicing → view (same memory, modify reflects in original). Fancy indexing & boolean mask → copy. Check: `arr.base is None` → copy, warna view." },
  { topicSlug: "numpy", order: 3, difficulty: "easy",
    question: "axis=0 vs axis=1 me kya difference?",
    answer: "axis = jis dimension ko collapse karna hai. 2D me axis=0 → column-wise aggregate (rows collapse). axis=1 → row-wise aggregate. arr.sum(axis=0) har column ka sum deta hai." },
  { topicSlug: "numpy", order: 4, difficulty: "medium",
    question: "Broadcasting kya hai? Rules?",
    answer:
`Different shape arrays ko compatible banake operate karna bina actual replication. Rules (right-to-left compare):
1. Trailing dimensions equal ho ya
2. Unme se ek 1 ho ya
3. Missing ho.
e.g., (3,4) + (4,) → ok. (3,4) + (3,) → error (use (3,1)).` },
  { topicSlug: "numpy", order: 5, difficulty: "medium",
    question: "@ aur * me difference matrix me?",
    answer: "`A @ B` matrix multiplication. `A * B` element-wise (Hadamard). Transformer attention me Q @ K.T matmul karte hain." },
  { topicSlug: "numpy", order: 6, difficulty: "medium",
    question: "Cosine similarity NumPy me likho.",
    answer:
`def cosine(a, b):
    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Batch (1 query vs N docs)
q = query / np.linalg.norm(query)
D = docs / np.linalg.norm(docs, axis=1, keepdims=True)
scores = D @ q   # (N,)
RAG/vector-DB ka core operation.` },
  { topicSlug: "numpy", order: 7, difficulty: "medium",
    question: "Seed kyu lagana zaroori?",
    answer: "Random ops reproducible banane ke liye. Same seed → same outputs. Experiments compare karne, debugging, paper results replicate karne ke liye must. Modern API: `rng = np.random.default_rng(42)`." },
  { topicSlug: "numpy", order: 8, difficulty: "hard",
    question: "Loop ko vectorize karne ka example do.",
    answer:
`SLOW:
result = []
for x in arr:
    result.append(x*2 if x>0 else 0)

FAST:
result = np.where(arr > 0, arr*2, 0)
~50-100x faster. NumPy ufuncs C level pe SIMD use karti hain — Python loop ka overhead bachta hai.` },
  { topicSlug: "numpy", order: 9, difficulty: "hard",
    question: "float32 vs float64 — kab kya?",
    answer: "float64 default (high precision). float32 = half memory, 2x faster on GPU, ML training me sufficient. float16/bfloat16 inference & large models me — speed up 2-4x but precision risk. AI engineer mostly float32 use karta hai." },
];
