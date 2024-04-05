import { ReactNode } from "react";
import { Citation, Document } from "./AnswerStep";
import { CitationCard } from "./CitationCard";
import { TrackedLink } from "./TrackedLink";
import { Tooltip, TooltipTrigger } from "./ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";

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
      <Tooltip delayDuration={500}>
        <TooltipTrigger className="inline" asChild>
          <span className="cursor-pointer text-orange-400 text-opacity-90">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className="z-20" key={id}>
          <div className="not-prose group relative w-[min(500px,_100svw)] max-w-[max-content] rounded-lg">
            <div className="flex flex-row gap-2 overflow-x-auto rounded-lg bg-card/95 p-2 shadow-xl">
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
                  <CitationCard
                    key={doc.url}
                    citation={doc}
                    className="shadow-lg"
                  />
                </TrackedLink>
              ))}
              <div className="absolute bottom-0 right-0 top-0 h-full w-32 rounded-lg bg-gradient-to-r from-transparent to-black opacity-50 transition-opacity group-hover:opacity-10"></div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </span>
  );
};
