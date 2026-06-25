import PracticeCodeRunner from "@/components/PracticeCodeRunner";

export const metadata = {
  title: "Practice Code — Notes Knowladge",
  description:
    "Practice Python code directly in the browser with a Monaco editor and Python runtime.",
};

export default function PracticeCodePage() {
  return (
    <div className="space-y-8">
      <section>
        <div className="text-sm font-medium text-brand-100">
          Python practice lab
        </div>
        <h1 className="mt-2 text-3xl font-bold text-white">Practice Code</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Browser me Python code likho, run karo, output dekho, aur examples ko
          modify karke concepts practice karo. Abhi language Python only hai.
        </p>
      </section>

      <PracticeCodeRunner />
    </div>
  );
}
