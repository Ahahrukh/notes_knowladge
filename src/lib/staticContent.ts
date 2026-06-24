import type { InterviewQuestion, Section, Topic } from "./models";

import * as python from "../../scripts/content/python.mjs";
import * as environment from "../../scripts/content/environment.mjs";
import * as mathematics from "../../scripts/content/mathematics.mjs";
import * as numpy from "../../scripts/content/numpy.mjs";
import * as pandas from "../../scripts/content/pandas.mjs";
import * as matplotlib from "../../scripts/content/matplotlib.mjs";
import * as sql from "../../scripts/content/sql.mjs";
import * as mlFundamentals from "../../scripts/content/ml-fundamentals.mjs";
import * as docker from "../../scripts/content/docker.mjs";
import * as fastapi from "../../scripts/content/fastapi.mjs";
import * as llmApis from "../../scripts/content/llm-apis.mjs";
import * as promptEngineering from "../../scripts/content/prompt-engineering.mjs";
import * as vectorDb from "../../scripts/content/vector-db.mjs";
import * as rag from "../../scripts/content/rag.mjs";
import * as langchain from "../../scripts/content/langchain.mjs";
import * as agenticAi from "../../scripts/content/agentic-ai.mjs";

type ContentModule = {
  topic: Topic;
  sections?: Section[];
  interview?: InterviewQuestion[];
};

const modules = [
  python,
  environment,
  mathematics,
  numpy,
  pandas,
  matplotlib,
  sql,
  mlFundamentals,
  docker,
  fastapi,
  llmApis,
  promptEngineering,
  vectorDb,
  rag,
  langchain,
  agenticAi,
] as ContentModule[];

export const staticTopics = modules
  .map((module) => module.topic)
  .sort((a, b) => a.order - b.order);

export const staticSections = modules.flatMap((module) => module.sections ?? []);

export const staticInterview = modules.flatMap((module) => module.interview ?? []);
