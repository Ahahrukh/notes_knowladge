import CodeBlock from "./CodeBlock";
import type { ContentBlock } from "@/lib/models";

export default function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="prose-hinglish max-w-none">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading": {
            const Tag = (`h${b.level ?? 2}`) as keyof JSX.IntrinsicElements;
            return <Tag key={i}>{b.value}</Tag>;
          }
          case "text":
            return (
              <p key={i} dangerouslySetInnerHTML={{ __html: inline(b.value) }} />
            );
          case "note":
            return (
              <div
                key={i}
                className="my-4 border-l-4 border-brand-500 bg-brand-500/10 p-3 rounded-r"
              >
                <span className="text-brand-100 font-semibold mr-1">Note:</span>
                <span
                  className="text-slate-200"
                  dangerouslySetInnerHTML={{ __html: inline(b.value) }}
                />
              </div>
            );
          case "list":
            return b.ordered ? (
              <ol key={i}>
                {b.items.map((it, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: inline(it) }} />
                ))}
              </ol>
            ) : (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: inline(it) }} />
                ))}
              </ul>
            );
          case "code":
            return (
              <div key={i}>
                <CodeBlock language={b.language} value={b.value} />
                {b.explanation && (
                  <div className="text-sm text-slate-300 -mt-1 mb-3 pl-1">
                    <span className="text-brand-100 font-semibold">Samjho: </span>
                    <span dangerouslySetInnerHTML={{ __html: inline(b.explanation) }} />
                  </div>
                )}
              </div>
            );
        }
      })}
    </div>
  );
}

// minimal inline formatter: **bold**, `code`
function inline(s: string): string {
  const escaped = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}
