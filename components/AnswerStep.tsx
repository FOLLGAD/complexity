import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { CitationPopup, DocumentsScroller } from "./Citations";
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
      code: ({ children }) => {
        const removeCiteTags = (str: string) =>
          str?.replace(/<\/?cite.*?>/g, "");

        return (
          <code>
            {typeof children === "string" ? removeCiteTags(children) : children}
          </code>
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

  const markdownContent = useMemo(
    () =>
      !isLoading ? (
        <Markdown
          rehypePlugins={[rehypeRaw]}
          components={components}
          allowedElements={[
            "cite",
            "p",
            "li",
            "ul",
            "ol",
            "blockquote",
            "pre",
            "code",
            "a",
            "img",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "table",
            "thead",
            "tbody",
            "tr",
            "th",
            "td",
          ]}
        >
          {text}
        </Markdown>
      ) : (
        <Skeleton className="h-24" />
      ),
    [isLoading, text, components],
  );

  return (
    <div className="w-full max-w-xs pt-12 md:max-w-md md:pt-10 lg:max-w-xl">
      <h1 className="mb-4 text-2xl font-light underline decoration-orange-600 decoration-2 underline-offset-4">
        <TypeAnimation
          sequence={[step.question]}
          cursor={false}
          speed={80}
          preRenderFirstString
        />
      </h1>
      {!isLoading && (
        <>
          <h2 className="text-md my-4 flex items-center font-medium">
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
          <div className="relative -mx-8 mb-4 overflow-hidden rounded-lg md:mx-0">
            <DocumentsScroller
              documents={uniqueDocuments}
              key={step.id}
              className="pl-8 md:pl-0"
            />
          </div>
        </>
      )}
      <h2 className="text-md my-4 flex items-center font-medium">
        <ReaderIcon className="mr-2 inline-block" width={18} height={18} />
        Answer
      </h2>
      <div className="prose mb-2 scroll-smooth font-light dark:prose-invert md:prose-base selection:bg-orange-200/30 selection:text-orange-600">
        {markdownContent}
      </div>
    </div>
  );
};
