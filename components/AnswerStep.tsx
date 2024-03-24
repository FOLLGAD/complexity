import { Suspense, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CitationCard } from "./CitationCard";
import { BookDown, ScrollText } from "lucide-react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { CitationPopup } from "./CitationPopup";

export interface Citation {
  documentIds: string[];
  text: string;
  start: number;
  end: number;
}

export interface Document {
  url: string;
  title: string;
  id: string;
}

export type Step = {
  question: string;
  text: string;
  documents: Document[];
  citations: Citation[];
};

export const AnswerStep = ({ step }: { step: Step }) => {
  const text = useMemo(() => {
    let t = step.text;
    for (let i = step.citations.length - 1; i >= 0; i--) {
      const citation = step.citations[i];
      const slice = t.slice(citation.start, citation.end);
      t =
        t.slice(0, citation.start) +
        `<cite class="text-orange-400" data-citation-id="${i}">${slice}</cite>` +
        t.slice(citation.end);
    }
    return t;
  }, [step.text, step.citations]);

  if (!step.text) {
    return (
      <div className="pt-12 container">
        <h1 className="text-2xl font-medium mb-4">{step.question}</h1>
        <Skeleton>
          <div className="h-16" />
        </Skeleton>
      </div>
    );
  }

  return (
    <div className="pt-12 container max-w-4xl">
      <h1 className="text-2xl font-medium mb-4 underline decoration-orange-400 decoration-2 underline-offset-4">
        {step.question}
      </h1>
      <h2 className="text-md font-medium mb-4">
        <ScrollText className="inline-block mr-2" size={18} />
        Sources
      </h2>
      {step.documents.length === 0 && (
        <p className="text-sm text-gray-500">No sources used for this query.</p>
      )}
      <div className="relative rounded-lg overflow-hidden">
        <div className="flex gap-4 overflow-x-auto mb-4">
          {step.documents.map((doc) => (
            <a href={doc.url} key={doc.url} target="_blank" rel="noreferrer">
              <Suspense fallback={<div className="w-48 h-16" />}>
                <CitationCard citation={doc} />
              </Suspense>
            </a>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l to-transparent from-black opacity-60 pointer-events-none" />
      </div>
      <h2 className="text-md font-medium mb-4">
        <BookDown className="inline-block mr-2" size={18} />
        Answer
      </h2>
      <p className="mb-8 prose">
        <Markdown
          rehypePlugins={[rehypeRaw]}
          components={{
            ul: ({ children }) => <ul className="list-disc">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal">{children}</ol>,
            cite: ({ node, children }) => {
              const id = node.properties.dataCitationId as string;
              return (
                <CitationPopup
                  citation={step.citations[parseInt(id)]}
                  documents={step.documents}
                >
                  {children}
                </CitationPopup>
              );
            },
          }}
        >
          {text}
        </Markdown>
      </p>
    </div>
  );
};
