import {
  FC,
  MutableRefObject,
  PropsWithRef,
  ReactNode,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { Citation, Document } from "./AnswerStep";
import { CitationCard } from "./CitationCard";
import { TrackedLink } from "./TrackedLink";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";

const useScrollProgress = (
  scrollRef: MutableRefObject<HTMLDivElement>,
  dir: "x" | "y" = "y",
) => {
  const [scrollProgress, setScrollProgress] = useState({
    scrolled: 0,
    remaining: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef || !scrollRef.current) return;

      let remaining = 0,
        scrolled = 0;

      if (dir === "x") {
        scrolled = scrollRef.current.scrollLeft;
        remaining =
          scrollRef.current.scrollWidth -
          scrollRef.current.clientWidth -
          scrolled;
      } else {
        scrolled = scrollRef.current.scrollTop;
        remaining =
          scrollRef.current.scrollHeight -
          scrollRef.current.clientHeight -
          scrolled;
      }

      setScrollProgress({
        scrolled,
        remaining,
      });
    };
    scrollRef.current.addEventListener("scroll", handleScroll);
    handleScroll();
    return () =>
      scrollRef?.current?.removeEventListener("scroll", handleScroll);
  }, [dir]);

  return scrollProgress;
};

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
          <span className="citation-mark cursor-pointer rounded bg-orange-400/50 transition-colors hover:bg-orange-400/75 focus:bg-orange-400/75">
            {children}
          </span>
        </PopoverTrigger>
        <PopoverContent
          className="not-prose group relative z-20 w-[min(500px,_100svw)] max-w-[max-content] rounded-lg bg-card/95 px-2 py-2"
          key={id}
        >
          <DocumentsScroller documents={docs} key={id} />
        </PopoverContent>
      </Popover>
    </span>
  );
};
