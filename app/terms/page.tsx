import ReactMarkdown from "react-markdown";
import { loadMarkdown } from "@/lib/loadMarkdown";

export default function TermsPage() {
  const markdown = loadMarkdown("terms");

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Terms of Use
        </h1>
      </header>
      <article className="prose prose-sm sm:prose-base dark:prose-invert">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </article>
    </div>
  );
}