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
      <span className="text-orange-300 cursor-pointer" data-tooltip-target={id}>
        {children}
      </span>
      <div
        id={id}
        className="absolute right-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out pointer-events-none"
      >
        <div className="mt-[-5px] flex rounded-lg flex-row gap-2 max-w-[300px] overflow-x-auto group-hover:pointer-events-auto bg-popover shadow-xl shadow-orange-400/15">
          {docs.map((doc) => (
            <TrackedLink
              href={doc.url}
              key={doc.url}
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
