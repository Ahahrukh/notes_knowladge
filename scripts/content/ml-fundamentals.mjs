import { T, H, C, N, L } from "./_helpers.mjs";

export const topic = {
  slug: "ml-fundamentals",
  title: "Machine Learning Fundamentals",
  description:
    "Data tools ke baad AI ka bridge: train/test split, features, baseline models, metrics, overfitting, aur NumPy se model intuition.",
  icon: "🧠",
  color: "#22c55e",
  order: 8,
};

export const sections = [
  {
    topicSlug: "ml-fundamentals", slug: "workflow", order: 1,
    title: "ML Workflow — Problem se Model tak",
    summary: "Industry me ML project ka real flow.",
    content: [
      T("Machine Learning ka core idea: **data se pattern seekho**, phir unseen data pe prediction/decision lo. Industry me model banana sirf algorithm nahi hota — problem framing, data quality, metrics, baseline, monitoring sab equally important."),
      L([
        "**Problem define** — classification, regression, ranking, clustering, forecasting?",
        "**Target decide** — exactly kya predict karna hai? Example: churn within next 30 days.",
        "**Data collect/clean** — missing values, duplicates, leakage, wrong types.",
        "**Features banao** — raw columns ko model-friendly numeric signals me convert.",
        "**Split data** — train/validation/test alag rakho.",
        "**Baseline model** — simple rule/model first; fancy model baad me.",
        "**Evaluate** — metric business goal se match honi chahiye.",
        "**Ship + monitor** — data drift, metric drop, latency, failures track karo.",
      ], true),
      N("AI/GenAI engineer ke liye bhi yahi mindset chahiye. RAG, agents, prompts — sabko evaluation aur monitoring chahiye."),
    ],
  },
  {
    topicSlug: "ml-fundamentals", slug: "data-split", order: 2,
    title: "Train / Validation / Test Split",
    summary: "Model ko honest evaluate karne ka base.",
    content: [
      T("Agar model wahi data pe evaluate hota hai jisme train hua, score fake high aa sakta hai. Isliye data split zaroori hai."),
      L([
        "**Train** — model parameters yahan se learn karta hai.",
        "**Validation** — hyperparameters/threshold choose karne ke liye.",
        "**Test** — final honest check, baar-baar touch nahi karna.",
      ]),
      C("python",
`import numpy as np
import pandas as pd

df = pd.read_csv("customers.csv")
rng = np.random.default_rng(seed=42)

shuffled_idx = rng.permutation(len(df))
train_end = int(0.70 * len(df))
val_end = int(0.85 * len(df))

train_df = df.iloc[shuffled_idx[:train_end]]
val_df = df.iloc[shuffled_idx[train_end:val_end]]
test_df = df.iloc[shuffled_idx[val_end:]]`,
        "`default_rng(seed=42)` reproducible shuffle deta hai. `iloc` positional rows select karta hai. 70/15/15 common split hai."),
      N("Time-series/forecasting me random split mat karo. Past se train, future se test — warna future leakage ho jayega."),
    ],
  },
  {
    topicSlug: "ml-fundamentals", slug: "features-scaling", order: 3,
    title: "Features, Scaling & Leakage",
    summary: "Raw data ko model-ready banana.",
    content: [
      T("Feature = model ko diya gaya input signal. Good features model ko kaam easy banate hain; bad/leaky features production me model ko tod dete hain."),
      C("python",
`numeric_cols = ["age", "monthly_spend", "tickets_30d"]

train_mean = train_df[numeric_cols].mean()
train_std = train_df[numeric_cols].std().replace(0, 1)

X_train = (train_df[numeric_cols] - train_mean) / train_std
X_val = (val_df[numeric_cols] - train_mean) / train_std
X_test = (test_df[numeric_cols] - train_mean) / train_std`,
        "Mean/std **sirf train data se** calculate karo. Validation/test pe train values reuse karo. Ye leakage avoid karta hai."),
      H("Leakage kya hota hai?"),
      T("Leakage = model ko training/evaluation me aisi info mil jaye jo real prediction time pe available nahi hogi. Example: `cancelled_at` column se churn predict karna — production me future cancellation date pehle se nahi milegi."),
      L([
        "Target ke baad generate hone wale columns hatao.",
        "User-level duplicates split ke dono side me na chale jayein.",
        "Scaling/imputation stats validation/test se calculate mat karo.",
        "Date/time data me chronological split prefer karo.",
      ]),
    ],
  },
  {
    topicSlug: "ml-fundamentals", slug: "linear-regression", order: 4,
    title: "Linear Regression from Scratch",
    summary: "NumPy se prediction + gradient descent intuition.",
    content: [
      T("Linear regression continuous value predict karta hai: price, demand, revenue, latency. Formula simple hai: `prediction = X @ weights + bias`."),
      C("python",
`import numpy as np

X = X_train.to_numpy(dtype=float)
y = train_df["revenue_next_month"].to_numpy(dtype=float)

weights = np.zeros(X.shape[1])
bias = 0.0
learning_rate = 0.01

for epoch in range(500):
    predictions = X @ weights + bias
    errors = predictions - y
    loss = np.mean(errors ** 2)

    grad_w = (2 / len(X)) * (X.T @ errors)
    grad_b = 2 * errors.mean()

    weights -= learning_rate * grad_w
    bias -= learning_rate * grad_b

print("MSE:", loss)`,
        "`@` matrix multiply hai. `grad_w` batata hai weights ko kis direction me update karna hai. `learning_rate` step size control karta hai."),
      N("Production me scikit-learn use karoge, par NumPy version se model ka andar ka math clear hota hai."),
    ],
  },
  {
    topicSlug: "ml-fundamentals", slug: "classification-metrics", order: 5,
    title: "Classification Metrics",
    summary: "Accuracy se aage: precision, recall, F1.",
    content: [
      T("Classification me output category hota hai: spam/not spam, churn/not churn, fraud/not fraud. Sirf accuracy dekhna dangerous ho sakta hai, especially imbalanced data me."),
      C("python",
`import numpy as np

y_true = np.array([1, 0, 1, 1, 0, 0, 1])
y_prob = np.array([0.91, 0.20, 0.43, 0.88, 0.35, 0.10, 0.72])
threshold = 0.50
y_pred = (y_prob >= threshold).astype(int)

tp = np.sum((y_true == 1) & (y_pred == 1))
tn = np.sum((y_true == 0) & (y_pred == 0))
fp = np.sum((y_true == 0) & (y_pred == 1))
fn = np.sum((y_true == 1) & (y_pred == 0))

precision = tp / (tp + fp)
recall = tp / (tp + fn)
f1 = 2 * precision * recall / (precision + recall)
accuracy = (tp + tn) / len(y_true)`,
        "`threshold` change karne se precision/recall tradeoff change hota hai. Fraud/churn me recall often important hota hai; spam me precision."),
      H("Metric choose kaise karein?"),
      L([
        "False positive costly hai? **Precision** optimize karo.",
        "False negative costly hai? **Recall** optimize karo.",
        "Balance chahiye? **F1** use karo.",
        "Regression hai? MAE/RMSE/MAPE use karo.",
      ]),
    ],
  },
  {
    topicSlug: "ml-fundamentals", slug: "overfitting", order: 6,
    title: "Overfitting, Underfitting & Baselines",
    summary: "Model generalize kar raha hai ya memorize?",
    content: [
      T("Overfitting = train data pe great, unseen data pe poor. Underfitting = train aur validation dono pe poor. Goal: model **generalize** kare."),
      L([
        "**Baseline first** — simple average/rule/model se compare karo.",
        "**Validation gap dekho** — train score high, val low = overfit.",
        "**More data / simpler model / regularization** overfit reduce karte hain.",
        "**Better features / stronger model** underfit reduce karte hain.",
      ]),
      C("python",
`import matplotlib.pyplot as plt

history = pd.DataFrame({
    "epoch": np.arange(1, 11),
    "train_loss": [0.90, 0.70, 0.55, 0.44, 0.35, 0.28, 0.22, 0.18, 0.15, 0.12],
    "val_loss": [0.95, 0.76, 0.62, 0.54, 0.50, 0.49, 0.52, 0.56, 0.61, 0.68],
})

fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(history["epoch"], history["train_loss"], label="Train")
ax.plot(history["epoch"], history["val_loss"], label="Validation")
ax.set_xlabel("Epoch")
ax.set_ylabel("Loss")
ax.set_title("Overfitting Check")
ax.legend()
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()`,
        "Validation loss jab increase hone lage while train loss decrease ho raha ho, overfitting start ho gaya."),
    ],
  },
  {
    topicSlug: "ml-fundamentals", slug: "experiments", order: 7,
    title: "Experiment Tracking Basics",
    summary: "Models compare karne ke liye disciplined logs.",
    content: [
      T("Industry me experiments ka record nahi rakha to best model reproduce nahi hoga. Basic CSV log bhi enough start hai."),
      C("python",
`from pathlib import Path
import pandas as pd

run = {
    "run_id": "churn_baseline_001",
    "features": "age,monthly_spend,tickets_30d",
    "threshold": 0.45,
    "precision": 0.78,
    "recall": 0.84,
    "f1": 0.81,
}

path = Path("experiments.csv")
new_row = pd.DataFrame([run])

if path.exists():
    old = pd.read_csv(path)
    out = pd.concat([old, new_row], ignore_index=True)
else:
    out = new_row

out.to_csv(path, index=False)`,
        "`run_id`, features, parameters, metrics, data version — minimum track karo. Baad me MLflow/W&B jaise tools use kar sakte ho."),
      N("Production ML me reproducibility professional habit hai: seed, data version, feature list, code version, metric all logged."),
    ],
  },
];

export const interview = [
  { topicSlug: "ml-fundamentals", order: 1, difficulty: "easy",
    question: "Train, validation, test split ka difference kya hai?",
    answer: "Train se model learn karta hai, validation se hyperparameters/threshold choose hote hain, test final honest evaluation ke liye hota hai. Test ko baar-baar tune karne me use karoge to test leakage ho jayega." },
  { topicSlug: "ml-fundamentals", order: 2, difficulty: "easy",
    question: "Feature scaling kyu karte hain?",
    answer: "Different scale wali columns ko comparable range me lane ke liye. Gradient descent stable hota hai, distance-based models better behave karte hain. Mean/std train data se calculate karke validation/test pe reuse karna chahiye." },
  { topicSlug: "ml-fundamentals", order: 3, difficulty: "easy",
    question: "Data leakage kya hota hai?",
    answer: "Jab model ko training/evaluation ke time aisi information milti hai jo real prediction time pe available nahi hogi. Example: churn predict karte waqt cancellation date column use karna." },
  { topicSlug: "ml-fundamentals", order: 4, difficulty: "medium",
    question: "Overfitting kaise detect karoge?",
    answer: "Train score improve ho raha hai par validation score degrade/flat hai to overfitting. Learning curves, validation gap, cross-validation aur holdout test se detect karte hain." },
  { topicSlug: "ml-fundamentals", order: 5, difficulty: "medium",
    question: "Precision aur recall me kya tradeoff hai?",
    answer: "Precision high means predicted positives mostly correct. Recall high means actual positives mostly catch ho gaye. Threshold lower karoge to recall badhta hai aur precision often girta hai." },
  { topicSlug: "ml-fundamentals", order: 6, difficulty: "medium",
    question: "Baseline model kyu important hai?",
    answer: "Baseline simple reference score deta hai. Agar fancy model baseline se beat nahi kar raha, complexity justify nahi hoti. Baseline debugging aur business expectation set karne me help karta hai." },
  { topicSlug: "ml-fundamentals", order: 7, difficulty: "hard",
    question: "Time-series data me random split kyu dangerous hai?",
    answer: "Random split future rows ko train me la sakta hai aur past rows ko test me, jisse future leakage hota hai. Forecasting me chronological split use karo: past train, future validation/test." },
  { topicSlug: "ml-fundamentals", order: 8, difficulty: "hard",
    question: "Experiment reproducible banane ke minimum steps kya hain?",
    answer: "Random seed set karo, data version record karo, feature list and parameters log karo, code version/commit save karo, metrics save karo. Same inputs se same result reproduce hona chahiye." },
];
