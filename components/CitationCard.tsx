"use client";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";

export const CitationCard = ({ citation }) => {
  const [image, setImage] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Tax_revenue_as_a_percentage_of_GDP_%281985-2014%29.png/320px-Tax_revenue_as_a_percentage_of_GDP_%281985-2014%29.png"
  );
  useEffect(() => {
    fetch("/api/meta?q=" + citation.url)
      .then((res) => res.json())
      .then((data) => data && data.image && setImage(data.image));
  }, []);
  return (
    <Card className="w-48 text-sm">
      {image && (
        <div className="w-full h-16 overflow-hidden flex items-center justify-center rounded-t-lg relative">
          <img
            src={image}
            className="w-full h-full object-cover"
            // @ts-ignore
            onError={(e) => (e.target.src = "https://placehold.co/600x400")}
          />
          <div className="absolute inset-0 rounded-t-lg bg-primary opacity-20" />
        </div>
      )}
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
