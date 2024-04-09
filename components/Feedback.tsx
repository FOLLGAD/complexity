"use client";

import { cn } from "@/lib/utils";
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  ShareIcon,
  Copy,
  Share2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components//ui/card";
import { Input } from "@/components//ui/input";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const Feedback = forwardRef<
  HTMLDivElement,
  {
    isVisible: boolean;
    recordFeedback: (feedback: "positive" | "negative") => void;
    sessionId: string;
  }
>(function Feedback(
  props: {
    isVisible: boolean;
    recordFeedback: (feedback: "positive" | "negative") => void;
    sessionId: string;
  },
  ref,
) {
  const { isVisible, recordFeedback, sessionId } = props;
  const [isFeedbackRecorded, setIsFeedbackRecorded] = useState(false);

  const feedbackButtonVisibility = [
    isVisible ? "opacity-100" : "hidden",
    isFeedbackRecorded && "hidden duration-300 ease-in",
  ];

  return (
    <div
      ref={ref}
      className={cn(
        "mb-6 mt-2 flex w-full max-w-xs flex-col pt-1 transition-opacity duration-700 ease-in md:max-w-md lg:max-w-xl",
      )}
    >
      <div className="flex flex-col">
        <div className="mt-2 flex w-full justify-end gap-2">
          <ShareButton sessionId={sessionId} />
          <Button
            variant="outline"
            title="Good answer!"
            className={cn(
              "feedback-button group",
              "hover:bg-green-200",
              feedbackButtonVisibility,
            )}
            onClick={() => {
              recordFeedback("positive");
              toast.success("Thanks for your feedback!");
              setIsFeedbackRecorded(true);
            }}
          >
            <ThumbsUpIcon className="feedback-icon group-hover:text-gray-500" />
          </Button>
          <Button
            variant="outline"
            title="Bad answer!"
            className={cn(
              "feedback-button group",
              "hover:bg-red-200",
              feedbackButtonVisibility,
            )}
            onClick={() => {
              recordFeedback("negative");
              toast.error("We'll do better next time!");
              setIsFeedbackRecorded(true);
            }}
          >
            <ThumbsDownIcon className="feedback-icon group-hover:text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  );
});

function ShareButton({ sessionId }: { sessionId: string }) {
  const [shareOpen, setShareOpen] = useState(false);
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "https://cplx.ai";
  const url = `${baseUrl}/q/${sessionId}`;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(url);
    toast.info("Link copied to clipboard!");
  }, []);

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          title="Share answer with others"
          className={cn("feedback-button group", "hover:bg-zinc-300")}
          onClick={handleCopy}
        >
          <Popover open={shareOpen} onOpenChange={setShareOpen}>
            <PopoverTrigger>
              <Share2Icon className="feedback-icon group-hover:text-gray-500" />
            </PopoverTrigger>
            <PopoverContent
              className="relative z-20 w-[min(500px,_100svw)] max-w-fit rounded-lg bg-card p-0"
              side="top"
            >
              <Card className="">
                <CardHeader>
                  <CardTitle>Share your findings with others:</CardTitle>
                </CardHeader>
                <CardContent className="flex w-full justify-center gap-2">
                  <Input
                    autoFocus
                    value={url}
                    readOnly
                    className="inline-block w-fit cursor-text"
                  ></Input>
                  <Button
                    variant="default"
                    className="group"
                    onClick={handleCopy}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardContent>
                <div className="mt-2 flex justify-center gap-2"></div>
              </Card>
            </PopoverContent>
          </Popover>
        </Button>
      </TooltipTrigger>

      <TooltipContent className="bg-primary/10 text-white">
        <p>Share with others</p>
      </TooltipContent>
    </Tooltip>
  );
}
