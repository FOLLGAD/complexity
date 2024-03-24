"use client";
import { ReactNode, useState } from "react";
import { Citation, Document } from "./AnswerStep";
import { CitationCard } from "./CitationCard";

export const CitationPopup = ({
  citation,
  documents,
  children,
}: {
  citation: Citation;
  documents: Document[];
  children: ReactNode;
}) => {
  const docs = documents.filter((doc) => citation.documentIds.includes(doc.id));

  if (!citation) return null;

  const id = citation.start + "-" + citation.end;

  return (
    <span className="group inline-block relative">
      <span className="text-orange-300 cursor-pointer" data-tooltip-target={id}>
        {children}
      </span>
      <div
        id={id}
        className="absolute right-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out pointer-events-none"
      >
        <div className="flex rounded-lg shadow-lg flex-row gap-2 max-w-[300px] overflow-x-auto group-hover:pointer-events-auto bg-popover">
          {docs.map((doc) => (
            <a href={doc.url} key={doc.url} target="_blank" rel="noreferrer">
              <CitationCard key={doc.url} citation={doc} />
            </a>
          ))}
        </div>
      </div>
    </span>
  );
};
