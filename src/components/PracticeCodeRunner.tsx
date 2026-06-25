"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[460px] items-center justify-center rounded-md border border-slate-800 bg-slate-950 text-sm text-slate-400">
      Loading editor...
    </div>
  ),
});

const DEFAULT_CODE = `# Python practice
numbers = [1, 2, 3, 4, 5]
squares = [n * n for n in numbers]

print("Numbers:", numbers)
print("Squares:", squares)
print("Total:", sum(squares))
print("Average:", sum(squares) / len(squares))
`;

const PYODIDE_BASE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";

const PYTHON_CAPTURE_WRAPPER = `
import sys
import io
import traceback

__stdout = io.StringIO()
__stderr = io.StringIO()
__old_stdout = sys.stdout
__old_stderr = sys.stderr
__practice_globals = {"__name__": "__main__"}

try:
    sys.stdout = __stdout
    sys.stderr = __stderr
    exec(__USER_CODE__, __practice_globals)
except Exception:
    traceback.print_exc(file=__stderr)
finally:
    sys.stdout = __old_stdout
    sys.stderr = __old_stderr

__CAPTURED_STDOUT__ = __stdout.getvalue()
__CAPTURED_STDERR__ = __stderr.getvalue()
`;

const WORKER_SOURCE = `
let pyodidePromise = null;
const PYODIDE_BASE_URL = ${JSON.stringify(PYODIDE_BASE_URL)};
const PYTHON_CAPTURE_WRAPPER = ${JSON.stringify(PYTHON_CAPTURE_WRAPPER)};

function serializeError(error) {
  if (error && typeof error.message === "string") return error.message;
  return String(error);
}

async function getPyodide(runId) {
  if (!pyodidePromise) {
    self.postMessage({ type: "status", runId, message: "Loading Python runtime..." });
    importScripts(PYODIDE_BASE_URL + "pyodide.js");
    pyodidePromise = loadPyodide({ indexURL: PYODIDE_BASE_URL });
  }
  return pyodidePromise;
}

self.onmessage = async (event) => {
  const { type, code, runId } = event.data || {};
  if (type !== "run") return;

  try {
    const pyodide = await getPyodide(runId);
    self.postMessage({ type: "status", runId, message: "Running code..." });
    pyodide.globals.set("__USER_CODE__", code);
    await pyodide.runPythonAsync(PYTHON_CAPTURE_WRAPPER);
    const stdout = pyodide.globals.get("__CAPTURED_STDOUT__") || "";
    const stderr = pyodide.globals.get("__CAPTURED_STDERR__") || "";
    self.postMessage({ type: "result", runId, stdout, stderr });
  } catch (error) {
    self.postMessage({ type: "error", runId, message: serializeError(error) });
  }
};
`;

type WorkerMessage =
  | { type: "status"; runId: number; message: string }
  | { type: "result"; runId: number; stdout: string; stderr: string }
  | { type: "error"; runId: number; message: string };

export default function PracticeCodeRunner() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("Python ready");
  const [isRunning, setIsRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const activeRunIdRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearRunTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function stopWorker(message = "Execution stopped.") {
    clearRunTimeout();
    workerRef.current?.terminate();
    workerRef.current = null;
    activeRunIdRef.current = 0;
    setIsRunning(false);
    setStatus("Python ready");
    setOutput(message);
  }

  function getWorker() {
    if (workerRef.current) return workerRef.current;

    const blob = new Blob([WORKER_SOURCE], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    URL.revokeObjectURL(url);

    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;
      if (message.runId !== activeRunIdRef.current) return;

      if (message.type === "status") {
        setStatus(message.message);
        return;
      }

      clearRunTimeout();
      setIsRunning(false);
      setStatus("Python ready");

      if (message.type === "error") {
        setOutput(`Runtime error:\n${message.message}`);
        return;
      }

      const parts = [];
      if (message.stdout.trim()) parts.push(message.stdout.trimEnd());
      if (message.stderr.trim()) parts.push(message.stderr.trimEnd());
      setOutput(parts.join("\n") || "Code finished with no output. Use print(...) to see values.");
    };

    worker.onerror = (error) => {
      clearRunTimeout();
      setIsRunning(false);
      setStatus("Python ready");
      setOutput(`Runtime error:\n${error.message}`);
    };

    workerRef.current = worker;
    return worker;
  }

  function runCode() {
    const source = code.trimEnd();
    if (!source.trim()) {
      setOutput("No code to run.");
      return;
    }

    const runId = Date.now();
    activeRunIdRef.current = runId;
    setIsRunning(true);
    setOutput("");
    setStatus("Preparing Python...");

    const worker = getWorker();
    worker.postMessage({ type: "run", runId, code: source });

    clearRunTimeout();
    timeoutRef.current = setTimeout(() => {
      stopWorker("Execution stopped after 60 seconds.");
    }, 60000);
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <section className="min-w-0 rounded-lg border border-slate-800 bg-slate-900/50">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
          <div>
            <div className="text-sm font-semibold text-white">Python Editor</div>
            <div className="text-xs text-slate-400">{status}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={runCode}
              disabled={isRunning}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Run
            </button>
            <button
              type="button"
              onClick={() => stopWorker()}
              disabled={!isRunning}
              className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-rose-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Stop
            </button>
            <button
              type="button"
              onClick={() => {
                setCode(DEFAULT_CODE);
                setOutput("");
              }}
              className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-brand-500 hover:text-white"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="h-[520px] overflow-hidden rounded-b-lg">
          <MonacoEditor
            height="520px"
            language="python"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value ?? "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
              tabSize: 4,
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>
      </section>

      <aside className="min-w-0 rounded-lg border border-slate-800 bg-slate-950/70">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div className="text-sm font-semibold text-white">Output</div>
          <button
            type="button"
            onClick={() => setOutput("")}
            className="rounded border border-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:border-brand-500 hover:text-white"
          >
            Clear
          </button>
        </div>
        <pre className="min-h-[520px] whitespace-pre-wrap break-words p-4 font-mono text-sm leading-6 text-slate-200">
          {output || "Run Python code to see output here."}
        </pre>
      </aside>
    </div>
  );
}
