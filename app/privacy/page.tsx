// app/privacy/page.tsx
import ReactMarkdown from "react-markdown";
import { loadMarkdown } from "@/lib/loadMarkdown";

export default function PrivacyPage() {
  const markdown = loadMarkdown("privacy");

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Privacy Policy
        </h1>
      </header>
      <article className="prose prose-sm sm:prose-base dark:prose-invert">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </article>
    </div>
  );
}