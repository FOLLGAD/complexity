import { FC, ReactNode, Suspense, useRef } from "react";
import { Citation, Document } from "./AnswerStep";
import { CitationCard } from "./CitationCard";
import { TrackedLink } from "./TrackedLink";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { useScrollProgress } from "@/lib/hooks";

export const DocumentsScroller: FC<{
  documents: Document[];
  className?: string;
}> = ({
  documents,
  className,
}: {
  documents: Document[];
  className?: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { remaining } = useScrollProgress(scrollRef, "x");

  return (
    <div
      className={cn(
        "no-scrollbar flex flex-row gap-4 overflow-x-auto rounded-lg shadow-xl",
        className,
      )}
      ref={scrollRef}
    >
      {documents.map((doc) => (
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
            <CitationCard key={doc.url} citation={doc} className="shadow" />
          </Suspense>
        </TrackedLink>
      ))}
      <div
        className={cn(
          "absolute bottom-0 right-0 top-0 h-full w-32 rounded-lg bg-gradient-to-r from-transparent to-black opacity-0 transition-opacity",
          {
            "opacity-50": remaining > 5,
            "group-hover:opacity-25": remaining > 5,
          },
        )}
      ></div>
    </div>
  );
};

export const CitationPopup = ({
  citation,
  documents,
  children,
}: {
  citation: Citation;
  documents: Document[];
  children: ReactNode;
}) => {
  if (!citation) return null;

  const docs = documents.filter((doc) => citation.documentIds.includes(doc.id));
  const id = citation.start + "-" + citation.end;

  return (
    <span className="relative">
      <Popover>
        <PopoverTrigger className="inline" asChild>
          <span className="citation-mark link cursor-pointer rounded underline decoration-orange-400/75 transition-colors hover:bg-orange-400/75 focus:bg-orange-400/75">
            {children}
          </span>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          className="not-prose group relative z-20 w-[min(500px,_100svw)] max-w-[max-content] rounded-lg bg-card/95 px-2 py-2"
          key={id}
        >
          <DocumentsScroller documents={docs} key={id} />
        </PopoverContent>
      </Popover>
    </span>
  );
};
