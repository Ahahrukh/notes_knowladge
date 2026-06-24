"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({
  language,
  value,
}: {
  language: string;
  value: string;
}) {
  return (
    <div className="rounded-lg overflow-hidden border border-slate-800 my-3">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/70 text-xs text-slate-300">
        <span className="font-mono">{language}</span>
        <button
          onClick={() => navigator.clipboard.writeText(value)}
          className="hover:text-white"
        >
          Copy
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark as any}
        customStyle={{ margin: 0, background: "#0b1020", fontSize: 13.5 }}
        wrapLongLines
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}
