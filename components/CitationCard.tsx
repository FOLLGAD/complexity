"use client";
import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { Document } from "./AnswerStep";
import { type SuccessResult } from "open-graph-scraper";
import { cn } from "@/lib/utils";
import { useIsVisible } from "react-is-visible";
type OgObject = SuccessResult["result"];

export const CitationCard = ({
  citation,
  className,
}: {
  citation: Document;
  className?: string;
}) => {
  const [image, setImage] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);
  const ref = useRef();
  const isVisible = useIsVisible(ref, { once: true });

  useEffect(() => {
    isVisible &&
      fetch("/api/meta?q=" + citation.url, {
        cache: "force-cache",
      })
        .then((res) => res.json())
        .then((data: OgObject) =>
          data?.ogImage?.[0]?.url
            ? setImage(data.ogImage[0].url)
            : setImage(
                "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Tax_revenue_as_a_percentage_of_GDP_%281985-2014%29.png/320px-Tax_revenue_as_a_percentage_of_GDP_%281985-2014%29.png",
              ),
        )
        .catch(() => {})
        .finally(() => setLoading(false));
  }, [isVisible]);

  return (
    <Card
      className={cn("not-prose w-48 overflow-hidden text-sm", className)}
      ref={ref}
    >
      <div className="relative flex h-16 w-full items-center justify-center overflow-hidden rounded-t-lg">
        <div className="h-full w-full">
          {(image || loading) && (
            <img
              src={image}
              className={cn(
                "h-full w-full object-cover group-hover:block",
                "transition-opacity duration-300",
                {
                  "opacity-0": loading,
                },
              )}
              // @ts-ignore
              onError={(e) => (
                (e.target.src = "https://placehold.co/600x400"),
                (e.target.style.visibility = "hidden")
              )}
            />
          )}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
            </div>
          )}
        </div>

        {/* <div className="absolute inset-0 bg-primary opacity-20" /> */}
      </div>
      <div className="p-2">
        <p
          // max 2 lines and ellipsis
          className="line-clamp-2 overflow-ellipsis"
        >
          {citation.title.slice(0, 300)}
        </p>
      </div>
    </Card>
  );
};
