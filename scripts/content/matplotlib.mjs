import { T, H, C, N, L } from "./_helpers.mjs";

export const topic = {
  slug: "matplotlib",
  title: "Matplotlib",
  description:
    "Python plotting ki neev. ML/AI visualization — loss curves, confusion matrix, embeddings — sab yahin se.",
  icon: "📊",
  color: "#11557c",
  order: 6,
};

export const sections = [
  {
    topicSlug: "matplotlib", slug: "introduction", order: 1,
    title: "Introduction & First Plot",
    summary: "pyplot interface se quick start.",
    content: [
      C("bash", "pip install matplotlib seaborn"),
      C("python",
`import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [1, 4, 9, 16, 25]

plt.plot(x, y, marker="o", color="orange", label="x²")
plt.title("Square Numbers")
plt.xlabel("x"); plt.ylabel("x²")
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()`,
        "`plt.plot()` line chart. Markers, color, label customize karte hain. `show()` figure render karta hai."),
      N("Jupyter me `%matplotlib inline` ya default backend inline render karta hai. Script me `show()` se window khulti hai."),
    ],
  },
  {
    topicSlug: "matplotlib", slug: "object-oriented", order: 2,
    title: "Object-Oriented API (preferred)",
    summary: "fig, ax pattern — production code me yehi.",
    content: [
      T("`plt.*` state-based (implicit current figure) hai — quick scripts ke liye thik. Production / multiple subplots / reusable functions me **object-oriented API** preferred — `fig, ax = plt.subplots()`."),
      C("python",
`fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(x, y, label="x²", color="teal")
ax.set_title("Square Numbers")
ax.set_xlabel("x")
ax.set_ylabel("x²")
ax.legend()
ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()`,
        "`ax` ek axes (chart) hai. Saare methods `ax.set_*` se. Functions me figure pass karna easy hota hai."),
    ],
  },
  {
    topicSlug: "matplotlib", slug: "chart-types", order: 3,
    title: "Common Chart Types",
    summary: "bar, scatter, hist, pie, box.",
    content: [
      C("python",
`fig, axs = plt.subplots(2, 3, figsize=(14, 8))

# Bar
axs[0,0].bar(["A","B","C"], [10, 20, 15])
axs[0,0].set_title("Bar")

# Scatter
axs[0,1].scatter([1,2,3,4], [10,8,12,15], s=80, c="red")
axs[0,1].set_title("Scatter")

# Histogram (distribution)
import numpy as np
data = np.random.randn(1000)
axs[0,2].hist(data, bins=30, color="purple", alpha=0.7)
axs[0,2].set_title("Histogram")

# Pie
axs[1,0].pie([30,45,25], labels=["X","Y","Z"], autopct="%.1f%%")
axs[1,0].set_title("Pie")

# Box plot (outliers detection)
axs[1,1].boxplot([np.random.randn(100), np.random.randn(100)+1])
axs[1,1].set_title("Boxplot")

# Line with fill
ax = axs[1,2]
x = np.linspace(0, 10, 100)
ax.plot(x, np.sin(x), color="blue")
ax.fill_between(x, np.sin(x), alpha=0.3)
ax.set_title("Line + Fill")

plt.tight_layout(); plt.show()`,
        "Har chart type ka apna use case: bar (categorical), scatter (relationship), hist (distribution), box (spread+outliers), pie (proportion, avoid if >5 categories)."),
    ],
  },
  {
    topicSlug: "matplotlib", slug: "subplots", order: 4,
    title: "Subplots & Layouts",
    summary: "Ek figure me multiple charts.",
    content: [
      C("python",
`# Grid layout
fig, axs = plt.subplots(2, 2, figsize=(10, 8), sharex=True)
axs[0,0].plot(x, y1)
axs[0,1].plot(x, y2)
axs[1,0].plot(x, y3)
axs[1,1].plot(x, y4)
fig.suptitle("4 Charts")
plt.tight_layout()`,
        "`sharex=True`/`sharey=True` axes share — comparison plots me clean look."),
      H("Asymmetric layouts (GridSpec)"),
      C("python",
`from matplotlib.gridspec import GridSpec

fig = plt.figure(figsize=(10, 6))
gs = GridSpec(2, 3, figure=fig)
ax1 = fig.add_subplot(gs[0, :])      # full top row
ax2 = fig.add_subplot(gs[1, 0])      # bottom left
ax3 = fig.add_subplot(gs[1, 1:])     # bottom right (2 cols wide)

ax1.plot(x, y1)
ax2.bar(["A","B","C"], [3,5,7])
ax3.scatter(x, y2)`,
        "Dashboard style layouts ke liye. Subplot of subplot, irregular sizes — sab possible."),
    ],
  },
  {
    topicSlug: "matplotlib", slug: "styling", order: 5,
    title: "Styling — Colors, Legends, Annotations",
    summary: "Professional looking plots.",
    content: [
      C("python",
`# Style theme
plt.style.use("seaborn-v0_8-darkgrid")   # ya "ggplot", "fivethirtyeight"

fig, ax = plt.subplots(figsize=(9, 5))
ax.plot(x, y1, color="#0ea5e9", linewidth=2, label="Model A")
ax.plot(x, y2, color="#f97316", linewidth=2, linestyle="--", label="Model B")

# Annotation
ax.annotate("Best epoch",
    xy=(10, 0.9), xytext=(12, 0.95),
    arrowprops=dict(arrowstyle="->", color="red"))

ax.set_xlabel("Epoch", fontsize=12)
ax.set_ylabel("Accuracy", fontsize=12)
ax.set_title("Training Curves", fontsize=14, fontweight="bold")
ax.legend(loc="lower right", frameon=True)
ax.set_ylim(0, 1)
ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig("training.png", dpi=150, bbox_inches="tight")
plt.show()`,
        "ML training curves yehi banti hain. `savefig` ko `show()` se pehle call karo warna figure clear ho jata hai."),
    ],
  },
  {
    topicSlug: "matplotlib", slug: "ml-visualizations", order: 6,
    title: "ML/AI Visualizations",
    summary: "Confusion matrix, ROC, loss curves.",
    content: [
      H("1) Training loss / accuracy curves"),
      C("python",
`fig, ax = plt.subplots(figsize=(10, 5))
ax.plot(history["train_loss"], label="Train", color="blue")
ax.plot(history["val_loss"], label="Val", color="orange")
ax.set_xlabel("Epoch"); ax.set_ylabel("Loss")
ax.legend(); ax.set_title("Loss Curves")`,
        "Train vs val loss — overfitting detect karne ka pehla plot."),
      H("2) Confusion Matrix (heatmap)"),
      C("python",
`import seaborn as sns
from sklearn.metrics import confusion_matrix

cm = confusion_matrix(y_true, y_pred)
fig, ax = plt.subplots(figsize=(6,5))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=labels, yticklabels=labels, ax=ax)
ax.set_xlabel("Predicted"); ax.set_ylabel("Actual")
ax.set_title("Confusion Matrix")`,
        "Classification model evaluate karne ka most important visualization."),
      H("3) Embedding visualization (2D projection)"),
      C("python",
`from sklearn.decomposition import PCA

embeddings = np.random.randn(200, 768)  # OpenAI embeddings dim
labels = np.random.randint(0, 3, 200)

pca = PCA(n_components=2)
proj = pca.fit_transform(embeddings)

fig, ax = plt.subplots(figsize=(8, 6))
scatter = ax.scatter(proj[:,0], proj[:,1], c=labels, cmap="viridis", alpha=0.6)
plt.colorbar(scatter)
ax.set_title("Embeddings — PCA projection")`,
        "Vector DB me documents kaise cluster ho rahe hain visually dekhne ka tarika. UMAP/t-SNE bhi popular hain."),
    ],
  },
  {
    topicSlug: "matplotlib", slug: "seaborn", order: 7,
    title: "Seaborn — High Level on Matplotlib",
    summary: "Statistical plots, cleaner defaults.",
    content: [
      C("python",
`import seaborn as sns
sns.set_theme(style="whitegrid")

# Distribution
sns.histplot(df, x="latency_ms", hue="model", kde=True)

# Categorical comparison
sns.boxplot(data=df, x="model", y="cost_usd")
sns.violinplot(data=df, x="model", y="cost_usd")

# Correlation heatmap
corr = df.corr(numeric_only=True)
sns.heatmap(corr, annot=True, cmap="coolwarm", vmin=-1, vmax=1)

# Pair plot — multiple variable relationships
sns.pairplot(df[["latency_ms","cost_usd","tokens","quality"]], hue="model")`,
        "Seaborn ek line me beautiful charts deta hai. Pandas DataFrame directly accept karta hai. Heavy customization chahiye to underlying matplotlib `ax` access karke modify karo."),
    ],
  },
  {
    topicSlug: "matplotlib", slug: "save-export", order: 8,
    title: "Save & Export",
    summary: "Reports/papers ke liye high-DPI export.",
    content: [
      C("python",
`fig.savefig("chart.png", dpi=300, bbox_inches="tight")
fig.savefig("chart.pdf")                       # vector
fig.savefig("chart.svg")                       # vector for web
fig.savefig("chart.jpg", dpi=150, quality=95)

# Transparent background (slides ke liye)
fig.savefig("chart.png", transparent=True, dpi=200)`,
        "Papers/print ke liye 300 DPI. Web ke liye PNG/SVG (vector tight). PDF/SVG infinite zoom — slides ke liye best."),
      N("`plt.savefig` ko `plt.show()` se PEHLE call karo — show ke baad figure clear ho jata hai some backends me."),
    ],
  },
];

export const interview = [
  { topicSlug: "matplotlib", order: 1, difficulty: "easy",
    question: "plt vs fig/ax API — kab kya?",
    answer: "plt.* (pyplot) — quick scripts, single plot. fig/ax (OO) — production code, multiple subplots, reusable functions. OO me explicit hota hai ki kaunse axes pe draw kar rahe ho." },
  { topicSlug: "matplotlib", order: 2, difficulty: "easy",
    question: "savefig ki bagair show() ke kya hota?",
    answer: "Kuch backends me show() ke baad figure clear ho jata — savefig empty file deti. Hamesha savefig ko show ke PEHLE karo. Headless server me show ki zarurat nahi (Agg backend)." },
  { topicSlug: "matplotlib", order: 3, difficulty: "medium",
    question: "Matplotlib vs Seaborn — kab kya?",
    answer: "Matplotlib — low-level, full control. Seaborn — statistical plots, DataFrame-friendly, beautiful defaults. Mostly Seaborn use karo, deep customization ke liye `ax` extract karke matplotlib se tweak." },
  { topicSlug: "matplotlib", order: 4, difficulty: "medium",
    question: "Confusion matrix kaise plot karoge?",
    answer:
`from sklearn.metrics import confusion_matrix
import seaborn as sns
cm = confusion_matrix(y_true, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=labels, yticklabels=labels)
plt.xlabel('Predicted'); plt.ylabel('Actual')` },
  { topicSlug: "matplotlib", order: 5, difficulty: "medium",
    question: "High-dim embeddings (768D) ko 2D me plot kaise?",
    answer: "Dimensionality reduction: PCA (linear, fast) ya t-SNE/UMAP (non-linear, structure preserve). proj = PCA(n_components=2).fit_transform(emb). Phir scatter plot with label-based color." },
  { topicSlug: "matplotlib", order: 6, difficulty: "hard",
    question: "Production me chart export ke liye format choose karoge kaise?",
    answer:
`• PNG (raster) — web, slides — 150-300 DPI.
• PDF/SVG (vector) — papers, infinite zoom, small files for line charts.
• JPG — photographs (not charts).
Chart line-based hai to SVG/PDF best (sharp, small). Heatmap/dense scatter PNG better.` },
];
