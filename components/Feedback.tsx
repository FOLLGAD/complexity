"use client";

import { cn } from "@/lib/utils";
import { ThumbsUpIcon, ThumbsDownIcon, ShareIcon, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { forwardRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components//ui/card";
import { Input } from "@/components//ui/input";
import { toast } from "sonner";

export const Feedback = forwardRef<
  HTMLDivElement,
  {
    isVisible: boolean;
    recordFeedback: (feedback: "positive" | "negative") => void;
  }
>(function Feedback(
  props: {
    isVisible: boolean;
    recordFeedback: (feedback: "positive" | "negative") => void;
  },
  ref,
) {
  const { isVisible, recordFeedback } = props;
  const [isFeedbackRecorded, setIsFeedbackRecorded] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const pathname = usePathname();

  const feedbackButtonVisibility = [
    isVisible ? "opacity-100" : "hidden",
    isFeedbackRecorded && "hidden duration-300 ease-in",
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.origin + pathname);
    }
  }, [pathname]);

  return (
    <div
      ref={ref}
      className={cn(
        "mb-6 mt-2 flex w-full max-w-xs flex-col pt-1 transition-opacity duration-700 ease-in md:max-w-md lg:max-w-xl",
      )}
    >
      <div className="flex flex-col">
        <div className="mt-2 flex w-full justify-end gap-1">
          <Button
            variant="outline"
            title="Share answer with others"
            className={cn("feedback-button group", "hover:bg-zinc-300")}
            onClick={() => {}}
          >
            <Popover open={shareOpen} onOpenChange={setShareOpen}>
              <PopoverTrigger>
                <ShareIcon className="feedback-icon group-hover:text-gray-500" />
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
                      value={shareUrl}
                      className="inline-block w-fit cursor-text"
                    ></Input>
                    <Button
                      variant="default"
                      className="group"
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        toast.info("Link copied to clipboard!");
                        setShareOpen(false);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </CardContent>
                  <div className="mt-2 flex justify-center gap-2"></div>
                </Card>
              </PopoverContent>
            </Popover>
          </Button>
          <Button
            variant="outline"
            title="Good answer!"
            className={cn(
              "feedback-button group",
              "hover:bg-zinc-300",
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
              "hover:bg-zinc-300",
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
