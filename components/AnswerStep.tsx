import { Suspense, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CitationCard } from "./CitationCard";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { CitationPopup } from "./CitationPopup";
import { TrackedLink } from "./TrackedLink";
import { ActivityLogIcon, ReaderIcon } from "@radix-ui/react-icons";
import { TypeAnimation } from "react-type-animation";

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
  id?: string; // session id
  question: string;
  text: string;
  documents: Document[];
  citations: Citation[];
};

export const AnswerStep = ({ step }: { step: Step }) => {
  const text = useMemo(() => {
    let t = step.text;

    if (!step.citations) return t;

    for (let i = step.citations.length - 1; i >= 0; i--) {
      const citation = step.citations[i];
      const slice = t.slice(citation.start, citation.end);
      t =
        t.slice(0, citation.start) +
        `<cite data-citation-id="${i}">${slice}</cite>` +
        t.slice(citation.end);
    }
    return t;
  }, [step.text, step.citations]);

  const components = useMemo(
    () => ({
      ul: ({ children }) => <ul className="list-disc">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal">{children}</ol>,
      cite: ({ node, children }) => {
        const id = node.properties.dataCitationId as string;
        return (
          <CitationPopup
            citation={step.citations[parseInt(id)]}
            documents={step.documents}
            key={id}
          >
            {children}
          </CitationPopup>
        );
      },
    }),
    [step.citations, step.documents, step.text],
  );

  const uniqueDocuments = useMemo(() => {
    const docs = step.documents.filter(
      (d, i) => step.documents.findIndex((d2) => d2.url === d.url) === i, // remove duplicate urls
    );
    return docs;
  }, [step.documents]);

  const isLoading = !step.text;

  return (
    <div className="w-full max-w-xs pt-12 md:max-w-md md:pt-10 lg:max-w-xl">
      <h1 className="mb-4 text-2xl font-light underline decoration-orange-600 decoration-2 underline-offset-4">
        <TypeAnimation sequence={[step.question]} cursor={false} speed={80} />
      </h1>
      {!isLoading && (
        <>
          <h2 className="text-md mb-4 font-medium">
            <ActivityLogIcon
              className="mr-2 inline-block"
              width={18}
              height={18}
            />
            Sources
          </h2>
          {uniqueDocuments.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No sources used for this query.
            </p>
          )}
          <div className="relative overflow-hidden rounded-lg">
            <div className="mb-4 flex gap-4 overflow-x-auto">
              {uniqueDocuments.map((doc) => (
                <TrackedLink
                  href={doc.url}
                  key={doc.id}
                  target="_blank"
                  rel="noreferrer"
                  phData={{
                    url: doc.url,
                    title: doc.title,
                  }}
                >
                  <Suspense fallback={<div className="h-16 w-48" />}>
                    <CitationCard key={doc.id} citation={doc} />
                  </Suspense>
                </TrackedLink>
              ))}
            </div>
          </div>
        </>
      )}
      <h2 className="text-md mb-4 font-medium">
        <ReaderIcon className="mr-2 inline-block" width={18} height={18} />
        Answer
      </h2>
      <p className="prose mb-2 scroll-smooth font-light md:prose-base selection:bg-orange-200/30 selection:text-orange-600">
        {!isLoading ? (
          <Markdown rehypePlugins={[rehypeRaw]} components={components}>
            {text}
          </Markdown>
        ) : (
          <Skeleton className="h-24" />
        )}
      </p>
    </div>
  );
};
