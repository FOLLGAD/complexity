import { ReactNode } from "react";
import { Citation, Document } from "./AnswerStep";
import { CitationCard } from "./CitationCard";
import { TrackedLink } from "./TrackedLink";

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
    <span className="group relative">
      <span className="cursor-pointer text-orange-400 text-opacity-90" data-tooltip-target={id}>
        {children}
      </span>
      <div
        id={id}
        className="pointer-events-none absolute right-0 z-10 opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100"
      >
        <div className="mt-[-5px] flex max-w-[300px] flex-row gap-2 overflow-x-auto rounded-lg bg-popover shadow-xl shadow-orange-400/15 group-hover:pointer-events-auto">
          {docs.map((doc) => (
            <TrackedLink
              href={doc.url}
              key={doc.id}
              target="_blank"
              rel="noreferrer"
              phData={{
                url: doc.url,
              }}
            >
              <CitationCard key={doc.url} citation={doc} />
            </TrackedLink>
          ))}
        </div>
      </div>
    </span>
  );
};
