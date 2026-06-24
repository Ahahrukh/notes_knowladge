import { T, H, C, N, L } from "./_helpers.mjs";

export const topic = {
  slug: "mathematics",
  title: "Mathematics for AI",
  description:
    "Linear algebra, calculus, probability, statistics, info theory — AI/ML/DL ke saare papers aur libraries ki neev. Hinglish + NumPy code.",
  icon: "📐",
  color: "#ef4444",
  order: 3,
};

export const sections = [
  {
    topicSlug: "mathematics", slug: "introduction", order: 1,
    title: "Introduction — Kitna Math Chahiye?",
    summary: "AI engineer ke liye math ka practical mindset.",
    content: [
      T("AI/ML papers, deep learning frameworks (PyTorch/TensorFlow), embeddings, attention, loss functions — sab math ke concepts pe khade hain. **PhD level math nahi chahiye** — par 4 cheezein samajhna must:"),
      L([
        "**Linear Algebra** — vectors, matrices, dot product, decompositions. Embeddings, transformers, PCA ka base.",
        "**Calculus** — derivatives, gradients. Neural network training (backprop) ka core.",
        "**Probability & Statistics** — distributions, Bayes, expectation. Uncertainty, sampling, evaluation.",
        "**Information Theory** — entropy, cross-entropy, KL. Loss functions, model comparison.",
      ]),
      H("Practical mindset"),
      L([
        "Formulae ratta marna nahi — **intuition + code implementation** pe focus.",
        "NumPy/PyTorch me hands-on practice se concept clear hota hai paper padhne se zyada.",
        "Geometric visualization (2D/3D) se intuition mazboot hoti.",
        "Probabilistic thinking — 'agar' aur 'kitne chance' wala mindset.",
      ]),
      N("Sirf yahi 4 area covered hain to BERT, GPT, diffusion models ke papers padh sakte ho. Beyond hoga to advanced topics (measure theory, manifolds) tab dekhenge."),
    ],
  },
  {
    topicSlug: "mathematics", slug: "linear-algebra-basics", order: 2,
    title: "Linear Algebra — Vectors & Operations",
    summary: "Vectors, dot product, geometric meaning.",
    content: [
      H("Vector kya hai?"),
      T("Vector = ordered list of numbers. Geometrically: ek arrow jiski direction aur magnitude hai. AI me embeddings, weights, gradients — sab vectors hi hain."),
      C("text",
`v = [3, 4]              # 2D vector
v = [1.2, -0.5, 3.0]    # 3D vector  
v = [0.01, 0.34, ..., -0.12]   # 1536D (OpenAI embedding)`,
        "Embedding ek 1536D vector hota hai jo text ka meaning capture karta."),
      H("Magnitude (length / norm)"),
      C("text",
`||v|| = sqrt(v1² + v2² + ... + vn²)

Example: v = [3, 4]
||v|| = sqrt(9 + 16) = sqrt(25) = 5`),
      C("python",
`import numpy as np

v = np.array([3, 4])
np.linalg.norm(v)         # 5.0
# Same as: np.sqrt((v**2).sum())`),
      H("Dot Product"),
      C("text",
`a · b = a1*b1 + a2*b2 + ... + an*bn

Geometric: a · b = ||a|| * ||b|| * cos(θ)
  where θ = angle between vectors`,
        "Dot product = component-wise multiply karke sum. **Cosine similarity ka direct foundation**."),
      C("python",
`a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

a @ b              # 32 = 1*4 + 2*5 + 3*6
np.dot(a, b)       # 32 (same)
(a * b).sum()      # 32 (manual)`,
        "AI me dot product har jagah — attention scores (Q · K), similarity, neural layer activation."),
      H("Cosine similarity"),
      C("python",
`def cosine_similarity(a, b):
    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Embeddings ka similarity check
text_a = np.array([0.1, 0.5, -0.3])   # mock
text_b = np.array([0.2, 0.4, -0.2])
print(cosine_similarity(text_a, text_b))   # 0 to 1, higher = more similar`,
        "RAG, semantic search, document clustering — sab cosine similarity pe based."),
    ],
  },
  {
    topicSlug: "mathematics", slug: "matrices", order: 3,
    title: "Matrices & Matrix Multiplication",
    summary: "Matmul — transformers ka core.",
    content: [
      H("Matrix kya hai?"),
      T("Matrix = 2D array (rows × columns). Neural network weights, batch of data, attention scores — sab matrices."),
      C("text",
`A = [[1, 2, 3],         # shape (2, 3) — 2 rows, 3 cols
     [4, 5, 6]]`),
      H("Matrix multiplication (matmul)"),
      C("text",
`Rule: (m × n) @ (n × p) = (m × p)
       Inner dimensions match karne chahiye.

A = [[1, 2],          B = [[5, 6],
     [3, 4]]               [7, 8]]
A shape: (2, 2)       B shape: (2, 2)

A @ B = [[1*5+2*7, 1*6+2*8],
         [3*5+4*7, 3*6+4*8]]
      = [[19, 22],
         [43, 50]]`,
        "Result[i][j] = row i of A · column j of B (dot product). **Order matters** — A@B ≠ B@A generally."),
      C("python",
`import numpy as np

A = np.array([[1, 2], [3, 4]])      # (2, 2)
B = np.array([[5, 6], [7, 8]])      # (2, 2)

A @ B                # (2, 2) matrix multiplication
A * B                # ELEMENT-WISE (Hadamard), NOT matmul!

# Element-wise vs matmul — most common confusion
# @ = matmul, * = element-wise`),
      H("Transpose"),
      C("python",
`A.T          # rows ↔ cols swap
# [[1, 3],
#  [2, 4]]

# Attention: Q @ K.T / sqrt(d)  ← transformer formula`,
        "Transpose me row index = old col index. Transformers attention me K matrix transpose karke Q se multiply hota."),
      H("Identity & Inverse"),
      C("python",
`I = np.eye(3)        # identity matrix (diagonal 1s)
# Property: A @ I = A

# Inverse — A @ A_inv = I
A = np.array([[1, 2], [3, 5]])
A_inv = np.linalg.inv(A)
A @ A_inv            # ≈ identity (floating point noise)`),
      N("**Matmul = transformers ka engine.** Attention score: Q (queries) @ K.T (keys transpose) / sqrt(d_k). Output: scores @ V (values)."),
    ],
  },
  {
    topicSlug: "mathematics", slug: "norms-distances", order: 4,
    title: "Norms & Distance Metrics",
    summary: "L1, L2, cosine — embeddings me kab kya.",
    content: [
      H("L2 norm (Euclidean)"),
      C("text",
`||v||₂ = sqrt(v1² + v2² + ... + vn²)

L2 distance(a, b) = ||a - b||₂ = sqrt(Σ(ai - bi)²)`,
        "Default norm. Geometric: straight-line distance. Most ML loss functions (MSE) L2 use karte."),
      H("L1 norm (Manhattan / Taxicab)"),
      C("text",
`||v||₁ = |v1| + |v2| + ... + |vn|

L1 distance(a, b) = Σ|ai - bi|`,
        "Sum of absolute values. **Sparse solutions** induce karta (Lasso regression). Outliers ko less penalize."),
      H("L∞ (max) norm"),
      C("text",
`||v||∞ = max(|v1|, |v2|, ..., |vn|)`),
      C("python",
`import numpy as np

v = np.array([3, -4, 5])

np.linalg.norm(v, ord=1)    # 12 = 3 + 4 + 5  (L1)
np.linalg.norm(v, ord=2)    # 7.07 (L2)
np.linalg.norm(v, ord=np.inf)   # 5 (L∞)`,
        "ord parameter se konsi norm chahiye specify karo."),
      H("Cosine similarity vs distance"),
      C("text",
`cosine_similarity(a, b) = (a · b) / (||a|| * ||b||)
                         ∈ [-1, 1]   higher = more similar

cosine_distance(a, b) = 1 - cosine_similarity(a, b)
                       ∈ [0, 2]    lower = more similar`,
        "Embeddings me magnitude often meaningless — sirf direction matter karta. Isliye cosine preferred over Euclidean."),
      N("Vector DBs me default: cosine for text embeddings, L2 for image features (sometimes), dot product for normalized vectors."),
    ],
  },
  {
    topicSlug: "mathematics", slug: "decompositions", order: 5,
    title: "Matrix Decompositions — SVD & PCA",
    summary: "Dimensionality reduction, recommendations.",
    content: [
      H("Eigenvalues & Eigenvectors (briefly)"),
      C("text",
`A · v = λ · v

A = square matrix
v = eigenvector (special direction jo A transformation ke baad same direction me rehta)
λ = eigenvalue (scalar — kitna stretch/shrink hua)`,
        "Eigenvectors matrix ke 'principal directions' hote. PCA, spectral methods, PageRank — sab eigen-based."),
      C("python",
`A = np.array([[4, -2], [1, 1]])
eigvals, eigvecs = np.linalg.eig(A)
print(eigvals)    # [3, 2]
print(eigvecs)    # columns = eigenvectors`),
      H("SVD — Singular Value Decomposition"),
      T("Har matrix M ko 3 matrices me decompose kar sakte:"),
      C("text",
`M = U · Σ · V.T

M: (m × n) original
U: (m × m) left singular vectors (orthogonal)
Σ: (m × n) diagonal of singular values (largest first)
V: (n × n) right singular vectors (orthogonal)`,
        "Universal — kisi bhi matrix pe kaam karta. Compression, recommendation systems, noise reduction me use."),
      C("python",
`M = np.random.randn(5, 3)
U, S, Vt = np.linalg.svd(M, full_matrices=False)

# Reconstruct
M_reconstructed = U @ np.diag(S) @ Vt
print(np.allclose(M, M_reconstructed))   # True

# Top-2 components se approximate (compression)
k = 2
M_approx = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]`,
        "Top-k singular values se matrix approximate karna = compression. Recommender systems (Netflix prize era) SVD-based the."),
      H("PCA — Principal Component Analysis"),
      T("PCA = data ko low-dimensional space me project karta jisme variance max preserve ho. Internally SVD ya eigen-decomposition use karta."),
      C("python",
`from sklearn.decomposition import PCA

# 1000 samples, 50 features → reduce to 2D for plotting
X = np.random.randn(1000, 50)

pca = PCA(n_components=2)
X_2d = pca.fit_transform(X)

print(pca.explained_variance_ratio_)
# [0.04, 0.03] — top 2 components capture 7% variance

# Visualization use case
import matplotlib.pyplot as plt
plt.scatter(X_2d[:, 0], X_2d[:, 1])`,
        "**Embeddings visualize karne ka standard** — 1536D ko 2D pe project. UMAP/t-SNE non-linear alternatives (better cluster structure)."),
    ],
  },
  {
    topicSlug: "mathematics", slug: "calculus", order: 6,
    title: "Calculus — Derivatives & Gradients",
    summary: "Neural network training ka heart.",
    content: [
      H("Derivative — single variable"),
      T("Derivative = function ka rate of change at a point. Geometrically: tangent line ka slope."),
      C("text",
`f(x) = x²
f'(x) = 2x

f(x) = sin(x)
f'(x) = cos(x)

f(x) = e^x
f'(x) = e^x      (apne aap derivative)`),
      H("Partial derivatives — multivariable"),
      C("text",
`f(x, y) = x² + 3xy + y²

∂f/∂x = 2x + 3y       (y ko constant treat karo)
∂f/∂y = 3x + 2y       (x ko constant treat karo)`,
        "Multi-variable function me ek variable ke saath derivative, baki ko constant treat karke."),
      H("Gradient (∇f)"),
      C("text",
`Gradient = saare partial derivatives ka vector
∇f(x, y) = [∂f/∂x, ∂f/∂y]

Geometric meaning:
- Direction: function jis taraf SABSE TEZ badhta hai
- Magnitude: rate of increase`,
        "Gradient = steepest ascent direction. Opposite (-∇f) = steepest descent → **yehi gradient descent ka idea hai**."),
      C("python",
`# Numerical gradient (small perturbation)
def f(x, y):
    return x**2 + 3*x*y + y**2

def grad(f, x, y, h=1e-5):
    df_dx = (f(x+h, y) - f(x-h, y)) / (2*h)
    df_dy = (f(x, y+h) - f(x, y-h)) / (2*h)
    return np.array([df_dx, df_dy])

print(grad(f, 1, 2))   # ≈ [8, 7]  (analytic: 2(1)+3(2)=8, 3(1)+2(2)=7)`,
        "Numerical gradient debug ke kaam aata. Production me autodiff (PyTorch's `backward()`) use hota — exact + fast."),
      H("PyTorch autograd"),
      C("python",
`import torch

x = torch.tensor(1.0, requires_grad=True)
y = torch.tensor(2.0, requires_grad=True)

f = x**2 + 3*x*y + y**2
f.backward()           # automatic differentiation

print(x.grad)    # 8.0
print(y.grad)    # 7.0`,
        "PyTorch/TensorFlow computational graph build karke chain rule apply karte hain. Manual derivative likhne ki zarurat nahi."),
    ],
  },
  {
    topicSlug: "mathematics", slug: "gradient-descent", order: 7,
    title: "Gradient Descent",
    summary: "Optimization ka core algorithm.",
    content: [
      H("Idea"),
      T("Loss function L(θ) ko minimize karna hai (θ = model parameters). Gradient ulti direction me chalo:"),
      C("text",
`θ_new = θ_old - α · ∇L(θ_old)

α = learning rate (kitna bada kadam)
∇L = loss ka gradient at current θ`,
        "Choti steps me 'pahad' se neeche utarte jao. Min pe gradient zero ho jata."),
      C("python",
`# Find min of f(x) = (x - 3)²
def f(x): return (x - 3) ** 2
def df(x): return 2 * (x - 3)

x = 0.0           # start
lr = 0.1          # learning rate

for step in range(50):
    grad = df(x)
    x = x - lr * grad
    if step % 10 == 0:
        print(f"Step {step}: x={x:.4f}, f(x)={f(x):.4f}")

# Step 0:  x=0.6, f=5.76
# Step 10: x=2.74, f=0.066
# Step 50: x≈3.0,  f≈0    ← converged to minimum`,
        "Pure gradient descent. Neural networks me same idea but millions of parameters + complex loss."),
      H("Learning rate trade-off"),
      L([
        "Too small → slow convergence, training takes forever.",
        "Too large → overshoot, oscillation, divergence.",
        "Production: scheduler (cosine, warmup) ya adaptive (Adam) better than fixed.",
      ]),
      H("Variants"),
      L([
        "**Batch GD** — full dataset ka gradient. Slow per epoch, accurate.",
        "**SGD** — ek sample ka gradient. Fast, noisy. Often escape local minima.",
        "**Mini-batch SGD** — chhote batches (32, 64, 256). Practical sweet spot.",
        "**Momentum** — past gradients accumulate karke smooth updates.",
        "**Adam** — adaptive learning rates per parameter. Default 2024+.",
      ]),
    ],
  },
  {
    topicSlug: "mathematics", slug: "chain-rule-backprop", order: 8,
    title: "Chain Rule & Backpropagation",
    summary: "Neural networks kaise sikhte hain.",
    content: [
      H("Chain rule"),
      C("text",
`Composite function: f(g(x))

(f ∘ g)'(x) = f'(g(x)) · g'(x)

Example:
y = (3x + 1)²
Let u = 3x + 1, then y = u²
dy/dx = dy/du · du/dx = 2u · 3 = 6(3x + 1)`,
        "Function of function ke derivative ke liye — inner * outer derivatives."),
      H("Backpropagation = chain rule on neural network"),
      T("Neural network ka loss output layer pe compute hota. Har weight ke saath loss ka gradient chahiye — chain rule se layer-by-layer **piche** propagate karte."),
      C("text",
`Simple 2-layer network:

x → [W1] → h → [σ] → a → [W2] → y → L (loss)

∂L/∂W2 = ∂L/∂y · ∂y/∂W2
∂L/∂W1 = ∂L/∂y · ∂y/∂a · ∂a/∂h · ∂h/∂W1
       = (output gradient) chain to W1

Backprop = chain rule efficiently apply layer-by-layer.`,
        "PyTorch's `loss.backward()` automatically yehi compute karta hai computational graph traversal se."),
      C("python",
`import torch
import torch.nn as nn

# Simple network
model = nn.Sequential(
    nn.Linear(10, 5),
    nn.ReLU(),
    nn.Linear(5, 1),
)

x = torch.randn(4, 10)
target = torch.randn(4, 1)

# Forward
output = model(x)
loss = ((output - target) ** 2).mean()

# Backward — chain rule auto-apply, har param ka gradient compute
loss.backward()

# Har parameter ka .grad ab populated hai
for p in model.parameters():
    print(p.grad.shape)`,
        "Manual chain rule likhne ki zarurat nahi — PyTorch/TF computational graph track karke automatic backprop karte."),
      N("**Vanishing gradient problem** — deep networks me chain ke andar multiply hote-hote gradient zero ke kareeb ho jata. ReLU activation + ResNet skip connections solution hain."),
    ],
  },
  {
    topicSlug: "mathematics", slug: "probability-basics", order: 9,
    title: "Probability — Random Variables & Distributions",
    summary: "Uncertainty quantify karna.",
    content: [
      H("Random variable"),
      T("RV = ek variable jiska value random hai — kisi distribution se aata hai."),
      L([
        "**Discrete** — finite/countable values (coin toss, dice).",
        "**Continuous** — real numbers (height, temperature).",
      ]),
      H("PDF / PMF"),
      C("text",
`PMF (Probability Mass Function) — discrete RV ke liye
P(X = x) ∈ [0, 1]   and   Σ P(X = x) = 1

PDF (Probability Density Function) — continuous RV ke liye
f(x) ≥ 0   and   ∫ f(x) dx = 1
P(a ≤ X ≤ b) = ∫[a,b] f(x) dx`),
      H("Common distributions"),
      L([
        "**Bernoulli** — single coin toss. P(1)=p, P(0)=1-p.",
        "**Binomial** — n independent Bernoulli trials. # of successes.",
        "**Normal (Gaussian)** — bell curve. Mean μ, std σ. Sabse common assumption.",
        "**Uniform** — har value equal likely in range.",
        "**Categorical** — softmax output (multi-class probabilities).",
        "**Poisson** — events per time interval (LLM API requests per second).",
      ]),
      C("python",
`import numpy as np
import scipy.stats as st

# Sample from Normal(0, 1)
samples = np.random.normal(loc=0, scale=1, size=10000)

# PDF value at x=1
print(st.norm.pdf(1, loc=0, scale=1))    # 0.2419

# Probability that X < 1.5
print(st.norm.cdf(1.5))                  # 0.9332

# Sample from Bernoulli (p=0.7)
np.random.binomial(n=1, p=0.7, size=10)`,
        "scipy.stats me saari standard distributions ke PDF, CDF, sample, fit methods milte."),
      H("Expectation & Variance"),
      C("text",
`E[X] = Σ x · P(x)        (discrete)
     = ∫ x · f(x) dx       (continuous)

Var(X) = E[(X - E[X])²]
       = E[X²] - E[X]²

Std(X) = sqrt(Var(X))`,
        "Expectation = average value. Variance = spread. Cross-entropy loss internally expectation hai."),
    ],
  },
  {
    topicSlug: "mathematics", slug: "bayes", order: 10,
    title: "Bayes Theorem & Conditional Probability",
    summary: "Belief update karne ka formula.",
    content: [
      H("Conditional probability"),
      C("text",
`P(A | B) = P(A ∩ B) / P(B)

"A hone ki probability, given B already happened"`,
        "Independent events me P(A|B) = P(A) (B se A ko fark nahi padta)."),
      H("Bayes Theorem"),
      C("text",
`P(A | B) = P(B | A) · P(A) / P(B)

Components:
- P(A)     = prior (pehle se belief)
- P(B | A) = likelihood (A given hai to B kitna likely)
- P(B)     = evidence (normalizer)
- P(A | B) = posterior (B dekh ke updated belief)`,
        "Naye evidence se belief update — ML ka heart. Spam classifier, medical diagnosis, AI uncertainty estimation."),
      H("Classic example — spam classifier"),
      C("text",
`P(spam | "free money") = P("free money" | spam) · P(spam) / P("free money")

P(spam) = 0.2          (20% emails spam in general)
P("free money" | spam) = 0.7    (70% spam me ye phrase)
P("free money" | not spam) = 0.01   (1% normal emails)
P("free money") = 0.7 * 0.2 + 0.01 * 0.8 = 0.148

P(spam | "free money") = (0.7 * 0.2) / 0.148 ≈ 0.946`,
        "Sirf 'free money' phrase se spam probability 20% → 94.6% jump."),
      C("python",
`def bayes(prior, likelihood, marginal):
    return likelihood * prior / marginal

prior = 0.2
likelihood = 0.7
marginal = 0.7 * 0.2 + 0.01 * 0.8
print(bayes(prior, likelihood, marginal))   # 0.946`),
      N("Naive Bayes classifier — assume features independent given class. Despite naive assumption, text classification me kaafi acha kaam karta."),
    ],
  },
  {
    topicSlug: "mathematics", slug: "statistics", order: 11,
    title: "Statistics — Mean, Variance, Covariance, Correlation",
    summary: "Data summarize karne ke tools.",
    content: [
      C("python",
`import numpy as np
x = np.array([1, 2, 3, 4, 5])

x.mean()       # 3.0  — average
np.median(x)   # 3.0  — middle value (outliers se robust)
x.var()        # 2.0  — average squared deviation from mean
x.std()        # 1.41 — sqrt(var), data ki spread
x.min(), x.max()
np.percentile(x, [25, 50, 75])   # quartiles`,
        "Mean outliers se affected hota, median nahi. Skewed distributions me median report karo."),
      H("Covariance & Correlation"),
      C("text",
`Cov(X, Y) = E[(X - E[X])(Y - E[Y])]

Positive — together up/down jate
Negative — opposite
Zero — uncorrelated

Correlation = Cov(X, Y) / (σ_X · σ_Y)   ∈ [-1, 1]
              (covariance normalized)`,
        "Covariance scale-dependent (units affect karte). Correlation scale-free — comparison easy."),
      C("python",
`import numpy as np

# 1000 samples — height aur weight
height = np.random.normal(170, 10, 1000)
weight = 0.5 * height + np.random.normal(0, 5, 1000)   # correlated

# Covariance matrix
np.cov(height, weight)
# [[~100, ~50],   ← Var(h), Cov(h,w)
#  [~50,  ~30]]   ← Cov(w,h), Var(w)

# Correlation
np.corrcoef(height, weight)
# [[1.0, ~0.9],
#  [~0.9, 1.0]]   ← high positive correlation`,
        "Feature engineering me correlation matrix dekhke redundant features identify karte (correlation > 0.9 → ek drop kar sakte)."),
      H("Pearson vs Spearman"),
      L([
        "**Pearson** — linear correlation. Outliers sensitive.",
        "**Spearman** — rank-based, monotonic. Outliers robust, non-linear bhi capture.",
      ]),
    ],
  },
  {
    topicSlug: "mathematics", slug: "information-theory", order: 12,
    title: "Information Theory — Entropy, Cross-Entropy, KL",
    summary: "Loss functions ka math.",
    content: [
      H("Entropy — uncertainty measure"),
      C("text",
`H(p) = -Σ p(x) · log p(x)

Higher entropy = more uncertain
Lower entropy = more predictable

Fair coin (50-50): H = 1 bit  (maximum)
Biased coin (90-10): H ≈ 0.47 bit  (more predictable)`,
        "Log base 2 use to bits me. Log base e (natural) → nats. ML me natural log standard."),
      C("python",
`import numpy as np

def entropy(p):
    p = np.array(p)
    return -np.sum(p * np.log(p + 1e-12))

entropy([0.5, 0.5])         # 0.693 (nats), 1.0 (bits)
entropy([0.9, 0.1])         # 0.325 (more certain)
entropy([0.25, 0.25, 0.25, 0.25])   # 1.386 (4 classes equal)`),
      H("Cross-Entropy — predicted vs true distribution"),
      C("text",
`H(p, q) = -Σ p(x) · log q(x)

p = true distribution
q = predicted distribution

Lower = predicted matches true better.
Classification me LOSS function as cross-entropy.`,
        "**Multi-class classification ka default loss**. Softmax output ko cross-entropy se compare karte true label se."),
      C("python",
`# Binary cross-entropy
def bce(y_true, y_pred):
    eps = 1e-12
    return -np.mean(
        y_true * np.log(y_pred + eps) +
        (1 - y_true) * np.log(1 - y_pred + eps)
    )

# True labels [1, 0, 1, 1]
# Predicted prob [0.9, 0.1, 0.8, 0.7]
bce(np.array([1,0,1,1]), np.array([0.9,0.1,0.8,0.7]))   # 0.224 (good!)
bce(np.array([1,0,1,1]), np.array([0.1,0.9,0.2,0.3]))   # 1.95 (bad)`,
        "PyTorch me `nn.CrossEntropyLoss()` ya `nn.BCELoss()` — internally yehi formula."),
      H("KL Divergence — distribution distance"),
      C("text",
`KL(p || q) = Σ p(x) · log(p(x) / q(x))
            = H(p, q) - H(p)

p, q distributions par "distance" (not symmetric!)
KL(p || q) ≠ KL(q || p)

KL = 0 iff p == q
Higher → more different`,
        "Variational autoencoders, RLHF (LLM training), distribution matching — sab KL use karte."),
      C("python",
`def kl_div(p, q):
    p, q = np.array(p), np.array(q)
    eps = 1e-12
    return np.sum(p * np.log((p + eps) / (q + eps)))

p = np.array([0.4, 0.6])
q = np.array([0.5, 0.5])
print(kl_div(p, q))    # 0.020 (small — distributions close)`,
        "PPO/DPO (LLM RLHF algorithms) me KL constraint use hota — fine-tuned model original se zyada na divergde."),
    ],
  },
  {
    topicSlug: "mathematics", slug: "activations-losses", order: 13,
    title: "Activation & Loss Functions",
    summary: "Neural networks me kab kya use karein.",
    content: [
      H("Activation functions"),
      C("python",
`import numpy as np

# Sigmoid — binary classification output
def sigmoid(x):
    return 1 / (1 + np.exp(-x))
# Range: (0, 1). Issues: vanishing gradient, saturates.

# Tanh — sigmoid centered at 0
def tanh(x):
    return np.tanh(x)
# Range: (-1, 1). Better than sigmoid for hidden layers.

# ReLU — DEFAULT for hidden layers
def relu(x):
    return np.maximum(0, x)
# Range: [0, ∞). Fast, simple, no vanishing gradient on positive side.

# Softmax — multi-class probability distribution
def softmax(x):
    e = np.exp(x - x.max())   # subtract max for numerical stability
    return e / e.sum()

print(softmax([2.0, 1.0, 0.1]))   # [0.659, 0.242, 0.099]
print(sum(softmax([2.0, 1.0, 0.1])))   # ≈ 1.0`,
        "Softmax = exp + normalize. Output sum to 1 → probability distribution. Multi-class classification output layer me standard."),
      H("Common loss functions"),
      L([
        "**MSE (Mean Squared Error)** — regression. (y - y_pred)² ka average.",
        "**MAE (Mean Absolute Error)** — regression, outliers robust. |y - y_pred| average.",
        "**Binary Cross-Entropy** — binary classification.",
        "**Categorical Cross-Entropy** — multi-class classification (with softmax).",
        "**Hinge loss** — SVM-style margin classification.",
        "**Contrastive / Triplet loss** — embeddings (face recognition, search).",
      ]),
      C("python",
`# Regression
def mse(y_true, y_pred):
    return np.mean((y_true - y_pred) ** 2)

def mae(y_true, y_pred):
    return np.mean(np.abs(y_true - y_pred))

# MSE outliers heavily penalize (squared).
# MAE outliers se robust.

# Classification (cross-entropy already covered)`,
        "Regression me jab outliers concerning ho → MAE / Huber loss. Otherwise MSE default."),
      N("**Softmax + Cross-Entropy** numerical stability ke liye combined formula (`LogSoftmax + NLLLoss` PyTorch me, ya `CrossEntropyLoss`) — separately compute mat karo."),
    ],
  },
  {
    topicSlug: "mathematics", slug: "optimizers", order: 14,
    title: "Optimizers — SGD, Momentum, Adam",
    summary: "Gradient descent ke practical variants.",
    content: [
      H("Plain SGD"),
      C("text",
`θ_new = θ - α · ∇L(θ)

Plus pros: simple, well-understood.
Cons: same lr for all params, oscillates in narrow valleys, slow.`),
      H("SGD with Momentum"),
      C("text",
`v = β · v + ∇L(θ)         (β ~ 0.9, velocity accumulate)
θ = θ - α · v

Past gradients ko 'momentum' deta — smooth path, faster convergence,
local oscillation kam.`),
      H("Adam — Adaptive"),
      C("text",
`m = β1 · m + (1 - β1) · ∇L         (1st moment — gradient mean)
v = β2 · v + (1 - β2) · ∇L²         (2nd moment — gradient variance)

m_hat = m / (1 - β1^t)              (bias correction)
v_hat = v / (1 - β2^t)

θ = θ - α · m_hat / (sqrt(v_hat) + ε)

Effects:
- Per-param adaptive learning rate.
- Sparse gradients pe acha kaam.
- Most papers/code me default optimizer.`,
        "β1=0.9, β2=0.999, ε=1e-8 — standard defaults. Adam = momentum + RMSprop ka hybrid."),
      C("python",
`import torch.optim as optim

# PyTorch — production me yehi use hota
opt = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)
opt = optim.Adam(model.parameters(), lr=1e-3)
opt = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)  # transformer default

# Training loop
opt.zero_grad()
loss = criterion(model(x), y)
loss.backward()
opt.step()`,
        "AdamW = Adam + decoupled weight decay. **Transformers/LLMs me default**."),
      H("Learning rate schedulers"),
      L([
        "**Step decay** — har N epochs me lr / 10.",
        "**Cosine annealing** — smooth decay from max to min.",
        "**Warmup + cosine** — slow start (warmup) phir cosine decay. LLM training standard.",
        "**ReduceLROnPlateau** — validation loss stuck ho to lr reduce.",
      ]),
      N("Optimizer choice se zyada **learning rate aur scheduler** matter karte. Wrong lr → no convergence regardless of optimizer."),
    ],
  },
];

export const interview = [
  { topicSlug: "mathematics", order: 1, difficulty: "easy",
    question: "Dot product kya hai? AI me kahan use hota?",
    answer:
`a · b = Σ ai · bi = ||a|| · ||b|| · cos(θ)
Element-wise multiply karke sum.
AI me:
• Cosine similarity (RAG, semantic search).
• Transformer attention scores: Q · K.T.
• Linear layer activation: W · x + b.
• Embedding similarity.` },
  { topicSlug: "mathematics", order: 2, difficulty: "easy",
    question: "L1 vs L2 norm — kab kya?",
    answer:
`L1 = Σ|xi|        (Manhattan)
L2 = sqrt(Σxi²)   (Euclidean, default)

L1: sparse solutions induce karta (Lasso). Outliers robust. Feature selection.
L2: smooth, differentiable everywhere (gradient friendly). Most ML losses (MSE, weight decay) L2.
L1 + L2 mix → ElasticNet.` },
  { topicSlug: "mathematics", order: 3, difficulty: "easy",
    question: "Gradient kya hota? Sign kyu negative leta gradient descent me?",
    answer:
`Gradient = saare partial derivatives ka vector. Direction = function jis taraf SABSE TEZ badhta.
Magnitude = rate of increase.
Gradient descent me minimize karna hai loss → opposite direction (steepest descent) me jana → -gradient.
θ_new = θ - α · ∇L(θ)` },
  { topicSlug: "mathematics", order: 4, difficulty: "easy",
    question: "Bayes theorem apne words me?",
    answer:
`P(A|B) = P(B|A) · P(A) / P(B)
"Naya evidence B mila — A ki belief kaise update karein?"
P(A) prior (pehle belief), P(B|A) likelihood (A se B kitna likely),
P(A|B) posterior (updated belief).
Spam classifier, medical diagnosis, Bayesian ML ka foundation.` },
  { topicSlug: "mathematics", order: 5, difficulty: "medium",
    question: "SVD vs PCA?",
    answer:
`SVD — universal matrix decomposition (M = UΣV.T). Any matrix par kaam karta.
PCA — data ke covariance matrix ka SVD/eigen. Centered data me top-k components variance maximize karte.
Implementation: PCA internally usually SVD use karta (numerically stable). Conceptually PCA = data-aware dimensionality reduction, SVD = generic decomposition.` },
  { topicSlug: "mathematics", order: 6, difficulty: "medium",
    question: "Chain rule backpropagation me kyu zaroori?",
    answer:
`Neural net composite function hai: y = f(g(h(x))). Output pe loss compute hota. Har layer (g, h, etc.) ke weights ka loss pe asar chahiye → chain rule se layer-by-layer derivatives multiply karke trace karte hain.
∂L/∂w_layer1 = ∂L/∂y · ∂y/∂a3 · ∂a3/∂a2 · ∂a2/∂a1 · ∂a1/∂w_layer1
PyTorch autograd computational graph se ye automatic kar deta.` },
  { topicSlug: "mathematics", order: 7, difficulty: "medium",
    question: "MSE vs Cross-Entropy — kab kya?",
    answer:
`MSE: regression (continuous output). Penalizes large errors heavily (squared).
Cross-Entropy: classification (probability output). Sigmoid/softmax + cross-entropy together stable.
Classification me MSE use karne se gradients weak/saturate ho jaate (sigmoid output region). Hamesha cross-entropy use karo classification ke liye.` },
  { topicSlug: "mathematics", order: 8, difficulty: "medium",
    question: "Variance vs Standard deviation?",
    answer:
`Variance = E[(X - μ)²] — average squared deviation. Units squared (e.g., cm²).
Std deviation = sqrt(variance). Same units as data, interpretable.
Practical: std preferred for reporting/visualization. Variance use hota math derivations me (additive: Var(X+Y) = Var(X) + Var(Y) for independent).` },
  { topicSlug: "mathematics", order: 9, difficulty: "hard",
    question: "Multi-class classification me softmax kyu, sigmoid kyu nahi?",
    answer:
`Softmax classes me mutually exclusive probability distribute karta — sum to 1.
exp(xi) / Σ exp(xj) — normalization couples all logits.
Sigmoid har class ko independently 0-1 me map karta — sum can be anything, classes independent treat hote.
Multi-class (one-of-many): softmax.
Multi-label (multiple labels possible): sigmoid (each independent).` },
  { topicSlug: "mathematics", order: 10, difficulty: "hard",
    question: "Vanishing gradient problem — kya aur fix?",
    answer:
`Deep networks me backprop me chain ke andar gradients multiply hote — har layer pe sigmoid/tanh ki derivative <1 → product 0 ke kareeb → early layers nahi seekhte.
Fixes:
• ReLU activation (derivative 1 for x>0, no saturation).
• Skip/residual connections (ResNet) — gradient shortcut paths.
• Batch normalization — distribution stable.
• Good init (Xavier/He) — activations balanced start me.
• LSTM/GRU (RNNs me — gated memory).
• Layer normalization (transformers).` },
  { topicSlug: "mathematics", order: 11, difficulty: "hard",
    question: "KL divergence asymmetric kyu? Iska practical impact?",
    answer:
`KL(p || q) = Σ p · log(p/q) — p ke perspective se distance to q.
KL(p || q) ≠ KL(q || p) generally.

Impact:
• Forward KL — KL(p || q): mode-covering. q sab regions cover karta jahan p>0 → q broad ho jata.
• Reverse KL — KL(q || p): mode-seeking. q kisi ek mode pe concentrate.
• VAE training me forward KL.
• Variational inference me reverse KL.
• LLM RLHF (PPO) me KL constraint — fine-tuned model original se zyada divergde nahi.` },
  { topicSlug: "mathematics", order: 12, difficulty: "hard",
    question: "Adam SGD se behtar kyu? Phir bhi log SGD kab use karte?",
    answer:
`Adam advantages:
• Per-parameter adaptive learning rate.
• Momentum + RMSprop combined.
• Bias correction early steps me.
• Hyperparameter robust (default mostly works).

But SGD (with momentum) preferred kab:
• Image classification fine-tuning (ResNet etc.) — empirically better generalization.
• Final accuracy chahiye over fast convergence.
• Research suggests Adam sometimes flat minima escape karta, generalization gap.
Practice: LLMs/transformers → AdamW. Vision big models → SGD + momentum often.` },
];
