import { T, H, C, N, L } from "./_helpers.mjs";

export const topic = {
  slug: "pandas",
  title: "Pandas",
  description:
    "Tabular data ka king. LLM datasets prep, evaluation results, logs — sab Pandas se handle hote hain.",
  icon: "🐼",
  color: "#150458",
  order: 5,
};

export const sections = [
  {
    topicSlug: "pandas", slug: "introduction", order: 1,
    title: "Introduction — Series & DataFrame",
    summary: "Pandas ke do core structures.",
    content: [
      T("Pandas me 2 main structures:"),
      L([
        "**Series** — 1D labeled array (ek column jaisa).",
        "**DataFrame** — 2D table (Excel sheet jaisa, multiple Series ka collection).",
      ]),
      C("bash", "pip install pandas"),
      C("python",
`import pandas as pd

# Series
s = pd.Series([10, 20, 30], index=["a","b","c"], name="scores")

# DataFrame from dict
df = pd.DataFrame({
    "name": ["Ali", "Sara", "Raj"],
    "age": [22, 25, 30],
    "model": ["gpt-4", "claude-3", "gemini"],
})

df.head()           # top 5 rows
df.tail(3)
df.shape            # (3, 3)
df.columns
df.dtypes
df.info()
df.describe()       # numeric columns ka summary stats`,
        "`info()` aur `describe()` data exploration ka pehla step — schema + stats ek shot me."),
    ],
  },
  {
    topicSlug: "pandas", slug: "read-write", order: 2,
    title: "Read / Write — CSV, JSON, Parquet, SQL",
    summary: "Real-world data sources se load karo.",
    content: [
      C("python",
`# CSV
df = pd.read_csv("data.csv")
df = pd.read_csv("data.csv", parse_dates=["created_at"], usecols=["id","text"])

# JSON / JSONL (LLM eval logs me common)
df = pd.read_json("logs.json")
df = pd.read_json("logs.jsonl", lines=True)

# Parquet (production data — columnar, fast, small)
df = pd.read_parquet("data.parquet")

# Excel
df = pd.read_excel("data.xlsx", sheet_name="Sheet1")

# SQL
import sqlalchemy as sa
engine = sa.create_engine("postgresql://user:pass@host/db")
df = pd.read_sql("SELECT * FROM users WHERE created_at > '2024-01-01'", engine)

# Write
df.to_csv("out.csv", index=False)
df.to_parquet("out.parquet")
df.to_json("out.jsonl", orient="records", lines=True)`,
        "**Parquet >> CSV** for big data — 5-10x smaller, type preserve hota hai, column-wise read possible. AI/ML me standard."),
      N("`usecols=` aur `dtype=` hint dene se memory bachta hai bade files me."),
    ],
  },
  {
    topicSlug: "pandas", slug: "selection", order: 3,
    title: "Selection & Filtering",
    summary: "Columns, rows, conditions — .loc vs .iloc.",
    content: [
      C("python",
`# Single column → Series
df["name"]

# Multiple columns → DataFrame
df[["name", "age"]]

# .loc → LABEL based
df.loc[0]                # row with label 0
df.loc[0:2]              # rows 0,1,2 (inclusive!)
df.loc[df["age"] > 24]
df.loc[df["age"] > 24, ["name", "age"]]   # condition + cols

# .iloc → POSITION based (0-indexed, exclusive)
df.iloc[0]               # first row
df.iloc[0:2]             # rows 0,1 (exclusive)
df.iloc[:, -1]           # last column

# Direct boolean
df[df["model"].isin(["gpt-4", "claude-3"])]
df[df["name"].str.startswith("A")]`,
        ".loc inclusive end, .iloc exclusive — common bug. .str accessor strings pe vectorized ops deta hai."),
      H("Chaining conditions"),
      C("python",
`df[(df["age"] > 22) & (df["model"] == "gpt-4")]
df[(df["age"] < 25) | (df["age"] > 28)]
df[~df["model"].isin(["gpt-4"])]      # NOT`,
        "`&`, `|`, `~` use karo Python ke `and/or/not` nahi — element-wise chahiye. Brackets zaroori hain priority ke liye."),
    ],
  },
  {
    topicSlug: "pandas", slug: "modify", order: 4,
    title: "Add / Modify / Drop Columns & Rows",
    summary: "DataFrame transform karna.",
    content: [
      C("python",
`# Add column
df["is_adult"] = df["age"] >= 18
df["greeting"] = "Hello " + df["name"]
df["score_normalized"] = df["score"] / df["score"].max()

# Multiple cols via assign (chainable, returns new df)
df = df.assign(
    upper_name=lambda d: d["name"].str.upper(),
    age_squared=lambda d: d["age"] ** 2,
)

# Drop
df.drop(columns=["greeting"])
df.drop(index=[0, 1])
df.drop(columns=["greeting"], inplace=True)

# Rename
df.rename(columns={"name": "full_name", "age": "yrs"})`,
        "`assign` chainable hai — pipelines me clean rehta hai. `inplace=True` modify-in-place karta hai (return None)."),
    ],
  },
  {
    topicSlug: "pandas", slug: "groupby", order: 5,
    title: "GroupBy & Aggregation",
    summary: "SQL ke GROUP BY ka Python version.",
    content: [
      C("python",
`# Simple
df.groupby("model")["latency_ms"].mean()

# Multiple aggregations
df.groupby("model").agg(
    avg_latency=("latency_ms", "mean"),
    p95_latency=("latency_ms", lambda s: s.quantile(0.95)),
    total_calls=("id", "count"),
    total_cost=("cost_usd", "sum"),
)

# Multi-level grouping
df.groupby(["model", "user_tier"])["cost_usd"].sum()

# Transform — group-level value broadcast to rows
df["model_avg"] = df.groupby("model")["latency_ms"].transform("mean")`,
        "LLM API logs analyze karne ka core pattern — per-model latency p95, per-user cost, etc."),
      N("`agg` me named aggregation syntax sabse readable hai. Lambda use kar sakte custom metrics ke liye (p95, p99)."),
    ],
  },
  {
    topicSlug: "pandas", slug: "merge-join", order: 6,
    title: "Merge / Join / Concat",
    summary: "Multiple DataFrames combine karna.",
    content: [
      C("python",
`# SQL JOIN ke equivalent
orders = pd.DataFrame({"order_id":[1,2,3], "user_id":[10,11,10], "amt":[100,200,150]})
users  = pd.DataFrame({"user_id":[10,11,12], "name":["A","B","C"]})

pd.merge(orders, users, on="user_id", how="inner")    # default inner
pd.merge(orders, users, on="user_id", how="left")
pd.merge(orders, users, on="user_id", how="outer")

# Different column names
pd.merge(orders, users, left_on="user_id", right_on="user_id")`,
        "`how`: inner/left/right/outer. Defaults inner. Big tables me merge mehnga hai — keys index banake rakhna fast."),
      H("Concat — rows ya cols stack"),
      C("python",
`# Rows stack (more rows)
pd.concat([df1, df2], axis=0, ignore_index=True)

# Cols stack (more columns)
pd.concat([df1, df2], axis=1)`,
        "`ignore_index=True` na do to original indices preserve honge (often duplicates banti hain)."),
    ],
  },
  {
    topicSlug: "pandas", slug: "missing-data", order: 7,
    title: "Missing Data & Cleaning",
    summary: "NaN handle karna, duplicates, type fixing.",
    content: [
      C("python",
`df.isna().sum()              # column-wise null count
df.isna().any(axis=1).sum()  # rows with any null

df.dropna()                                # any null row drop
df.dropna(subset=["email"])                # sirf email null wali drop
df.dropna(thresh=3)                        # at least 3 non-null chahiye

df.fillna(0)
df.fillna({"age": df["age"].median(),
           "city": "Unknown"})
df["age"].fillna(method="ffill")           # forward fill (time series)
df["age"].interpolate()                    # linear interpolation

# Duplicates
df.drop_duplicates()
df.drop_duplicates(subset=["email"], keep="last")

# Type conversion
df["age"] = pd.to_numeric(df["age"], errors="coerce")   # bad → NaN
df["date"] = pd.to_datetime(df["date"])`,
        "Real data me 80% time cleaning me jata hai. Strategy: drop ya impute (mean/median/mode/forward-fill)."),
    ],
  },
  {
    topicSlug: "pandas", slug: "apply-map", order: 8,
    title: "apply, map, transform — Custom Logic",
    summary: "Row/column wise custom function lagana.",
    content: [
      C("python",
`# Series.map — element-wise (dict/func)
df["role_short"] = df["role"].map({"user":"U","assistant":"A","system":"S"})

# Series.apply — element-wise function
df["length"] = df["text"].apply(len)
df["clean"]  = df["text"].apply(lambda s: s.strip().lower())

# DataFrame.apply — row/column wise
df.apply(lambda row: row["a"] + row["b"], axis=1)   # axis=1 row-wise
df.apply(lambda col: col.max() - col.min(), axis=0) # axis=0 col-wise

# Vectorized > apply (jab possible ho)
# SLOW
df["len"] = df["text"].apply(len)
# FAST
df["len"] = df["text"].str.len()`,
        "**Pehle vectorized op try karo** (`.str`, arithmetic). `.apply` last resort — Python loop chalta hai (slow)."),
    ],
  },
  {
    topicSlug: "pandas", slug: "datetime", order: 9,
    title: "DateTime Handling",
    summary: "Time-based analysis, resampling.",
    content: [
      C("python",
`df["ts"] = pd.to_datetime(df["ts"])

# Extract components
df["year"] = df["ts"].dt.year
df["month"] = df["ts"].dt.month
df["day_of_week"] = df["ts"].dt.day_name()
df["hour"] = df["ts"].dt.hour

# Filter by date
df[df["ts"] > "2026-01-01"]
df[df["ts"].between("2026-01", "2026-03")]

# Set as index → time series operations
df = df.set_index("ts").sort_index()

# Resample (downsample to hour/day)
df["cost_usd"].resample("H").sum()    # hourly total cost
df["latency_ms"].resample("D").mean() # daily avg latency

# Rolling window
df["latency_ma_5"] = df["latency_ms"].rolling(window=5).mean()`,
        "LLM monitoring dashboards yehi karte hain — per-hour cost, p95 latency, anomaly detection."),
    ],
  },
  {
    topicSlug: "pandas", slug: "pivot-melt", order: 10,
    title: "Pivot, Melt, Crosstab — Reshape Data",
    summary: "Wide ↔ long format conversion.",
    content: [
      C("python",
`# pivot_table — Excel pivot jaisa
df.pivot_table(
    index="model",
    columns="user_tier",
    values="cost_usd",
    aggfunc="sum",
    fill_value=0,
)
# Output: rows=models, cols=tiers, cells=total cost

# crosstab — frequency table
pd.crosstab(df["model"], df["status"])

# melt — wide → long (ML me feature engineering ke liye)
wide = pd.DataFrame({"id":[1,2], "q1":[10,20], "q2":[30,40]})
long = wide.melt(id_vars="id", var_name="quarter", value_name="sales")
#    id quarter  sales
# 0   1      q1     10
# 1   2      q1     20
# 2   1      q2     30
# 3   2      q2     40`,
        "Pivot wide me, melt long me. Plotting libraries (seaborn) long format prefer karti hain."),
    ],
  },
  {
    topicSlug: "pandas", slug: "performance", order: 11,
    title: "Performance & Memory Tips",
    summary: "Bade datasets handle karna.",
    content: [
      L([
        "**Parquet > CSV** — 5-10x smaller, faster I/O.",
        "**dtype** explicitly do — `category` for low-cardinality strings (10-100x memory saving).",
        "**Chunksize** read karte time bade CSV ke liye.",
        "**Vectorized > apply > iterrows** — order of speed.",
        "**Vector ops** ke liye `.values` ya `.to_numpy()` se NumPy me niche jao.",
        "**Polars** consider karo — Rust based, 5-10x fast for big data.",
      ]),
      C("python",
`# Memory check
df.memory_usage(deep=True).sum() / 1e6   # MB

# Convert to category
df["country"] = df["country"].astype("category")

# Chunked read
for chunk in pd.read_csv("huge.csv", chunksize=100_000):
    process(chunk)`,
        "100M+ rows ke liye Polars/DuckDB consider karo — Pandas single-threaded limit hai."),
    ],
  },
];

export const interview = [
  { topicSlug: "pandas", order: 1, difficulty: "easy",
    question: "Series vs DataFrame?",
    answer: "Series = 1D labeled array (ek column). DataFrame = 2D table (multiple Series ek saath, shared index)." },
  { topicSlug: "pandas", order: 2, difficulty: "easy",
    question: ".loc vs .iloc?",
    answer: ".loc → label-based (index name, column name). End INCLUSIVE in slice. .iloc → position-based (0,1,2..). End EXCLUSIVE. Boolean masks .loc me allowed hain." },
  { topicSlug: "pandas", order: 3, difficulty: "easy",
    question: "& vs and condition me?",
    answer: "Element-wise me & | ~ use hote hain (NumPy ki tarah). Python ke and/or/not Series pe error denge ya wrong result. Brackets zaroori — `(a>1) & (b<5)`." },
  { topicSlug: "pandas", order: 4, difficulty: "medium",
    question: "merge vs join vs concat?",
    answer:
`• merge → SQL JOIN jaisa, key column par.
• join → DataFrame.join() default index par, merge ka shortcut.
• concat → axis ke along stack (rows ya cols).
Most flexible: merge.` },
  { topicSlug: "pandas", order: 5, difficulty: "medium",
    question: "apply vs map vs vectorized — speed order?",
    answer: "Vectorized (.str, arithmetic, NumPy ufuncs) >> .map (Series) >= .apply >> .iterrows. .iterrows usually anti-pattern hai bade data me. Hamesha vectorized try pehle." },
  { topicSlug: "pandas", order: 6, difficulty: "medium",
    question: "SettingWithCopyWarning kya hai?",
    answer:
`Pandas confused hai ki tum copy modify kar rahe ho ya original. Common in chained indexing:
df[df.a>0]["b"] = 0   # warning, unpredictable

Fix: .loc use karo —
df.loc[df.a > 0, "b"] = 0` },
  { topicSlug: "pandas", order: 7, difficulty: "medium",
    question: "5GB CSV process karoge to kaise?",
    answer:
`• pd.read_csv(chunksize=100_000) se chunks me.
• usecols=[..] sirf zaroori columns.
• dtype hint do (str→category, int64→int32).
• Parquet me convert karke read karo.
• Polars/DuckDB consider karo (out-of-core capable).` },
  { topicSlug: "pandas", order: 8, difficulty: "medium",
    question: "pivot vs pivot_table?",
    answer: "pivot — strict reshape, duplicate (index, col) combos ho to error. pivot_table — duplicates allowed, aggregation function (mean/sum) lagti hai. Real data me 95% time pivot_table." },
  { topicSlug: "pandas", order: 9, difficulty: "hard",
    question: "GroupBy transform vs apply vs agg?",
    answer:
`• agg → group ke liye single value (reduce).
• transform → group ke har row ke liye value (broadcast — same shape return).
• apply → most flexible, kuch bhi return kar sakta (slowest).
Example: df.groupby('x')['y'].transform('mean') har row me uske group ka mean daal deta — features engineering me bahut useful.` },
  { topicSlug: "pandas", order: 10, difficulty: "hard",
    question: "Memory optimize kaise karoge ek DataFrame ka?",
    answer:
`1. dtype downcast — int64→int32/int16, float64→float32.
2. Low cardinality strings → category dtype.
3. Datetime parse karo (str ki jagah).
4. Parquet save karo CSV ki bajay.
5. Sirf zaroori columns read karo (usecols).
Effect: 50-90% memory saving common hai.` },
];
