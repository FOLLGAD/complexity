"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, EyeIcon, LoaderCircle, SearchIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnswerStep, type Step } from "./AnswerStep";
import { Feedback } from "./Feedback";
import { useComplexity } from "./complexity";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import Link from "next/link";
import { SlugRedirect } from "@/app/q/[sessionId]/SlugRedirect";
import { useAsync } from "./utils";

const useMounted = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
};

export const Session: FC<{ sessionData: Step[] }> = ({
  sessionData: viewSessionData,
}) => {
  const { ask, steps, loading } = useComplexity();
  const posthog = usePostHog();

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, []);

  const recordFeedback = useCallback(
    (feedback: "positive" | "negative") => {
      posthog.capture("feedback_submitted", {
        feedback: feedback,
        sessionId: steps[steps.length - 1]?.id,
        question: steps[steps.length - 1]?.question,
        answer: steps[steps.length - 1]?.text,
      });
    },
    [steps?.[steps.length - 1]?.text],
  );
  const sessionId = useParams()?.sessionId as string;

  const [autoScroll, setAutoScroll] = useState(false);

  useEffect(() => {
    const fn = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const distanceFromBottom =
        target.scrollHeight - target.scrollTop - target.clientHeight;

      if (distanceFromBottom > 50) {
        setAutoScroll(false);
      }
    };
    scrollRef.current?.addEventListener("scroll", fn, {
      passive: false,
    });
    return () => {
      scrollRef.current?.removeEventListener("scroll", fn);
    };
  }, []);

  useEffect(() => {
    // on text change, scroll to bottom
    if (autoScroll) {
      scrollToBottom();
    }
  }, [steps[steps.length - 1]?.text?.length]);

  const handleSubmit = useCallback(
    async (question: string) => {
      setAutoScroll(true);
      await ask(question);
    },
    [ask],
  );

  const viewOnly = !steps || steps.length === 0;
  const sessionData: Step[] = viewOnly ? viewSessionData : steps;

  const memoizedAnswerSteps = useMemo(() => {
    return (
      sessionData?.map((step, i) => (
        <AnswerStep key={step.id + "-" + i} step={step} />
      )) ?? []
    );
  }, [sessionData]);

  const mounted = useMounted();

  return (
    <div
      className={
        "absolute bottom-0 top-0 flex w-full flex-col items-center justify-start overflow-y-auto bg-background pt-6 transition-all duration-100 ease-in-out " +
        (sessionData && sessionData.length === 0
          ? "pointer-events-none opacity-0"
          : "opacity-100")
      }
      ref={scrollRef}
    >
      <SlugRedirect question={sessionData?.[0]?.question} />

      {memoizedAnswerSteps}

      <Feedback
        recordFeedback={recordFeedback}
        isVisible={true}
        sessionId={sessionId}
      />

      <div className="flex-grow" />

      <div className="w-2xl pointer-events-none sticky bottom-0 flex w-full max-w-2xl items-center justify-between px-8 pb-8 pt-16 drop-shadow-lg md:pb-12">
        {!viewOnly && sessionData?.length > 0 && (
          <FollowupForm
            onSubmit={handleSubmit}
            loading={loading}
            length={sessionData?.length}
          />
        )}
        {!!viewOnly && (
          <div
            className={cn(
              "flex w-full flex-col items-center justify-center transition-opacity duration-1000 ease-in-out",
              {
                "opacity-0": !mounted, // to hide on SSR
              },
            )}
          >
            <Link href="/">
              <Button
                variant="ghost"
                className="pointer-events-auto mb-2 bg-background/80 hover:border hover:border-orange-300/20"
              >
                <SearchIcon className="mr-2 inline-block h-4 w-4" />
                Ask another question
              </Button>
            </Link>
            <Card className="pointer-events-auto mb-4 flex select-none flex-col items-center justify-center gap-4 bg-background px-8 py-4">
              <p className="vertical-align-middle flex text-center text-sm text-gray-400">
                <EyeIcon className="mr-2 inline-block h-5 w-5" /> This session
                is read-only.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

const FollowupForm: FC<{
  onSubmit: (text: string) => void;
  loading: boolean;
  length: number;
}> = ({ onSubmit, loading, length }) => {
  const [followUp, setFollowUp] = useState("");
  const posthog = usePostHog();

  const handleSubmit = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLDivElement>,
    ) => {
      e.preventDefault();
      await onSubmit(followUp);
      setFollowUp("");
    },
    [followUp, onSubmit],
  );

  const sessionId = useParams()?.sessionId as string;

  const { data: suggestions } = useAsync(async () => {
    if (loading) return null;
    const s = await fetch(`/api/chat/${sessionId}/suggestions?l=${length}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    }).then((res) => res.json());
    const d = s.data;
    if (!d) throw new Error("No suggestions");
    return d;
  }, [sessionId, length, loading]);

  return (
    <form
      className="relative flex w-full flex-col items-center"
      onSubmit={handleSubmit}
    >
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 mx-auto flex w-full max-w-xs -translate-y-full transform gap-2 overflow-x-auto pb-4 opacity-100 transition-all duration-1000 ease-in-out md:max-w-md lg:max-w-xl",
          {
            "opacity-0": !suggestions || !suggestions.length,
          },
        )}
      >
        {suggestions?.map?.((suggestion: string) => (
          <Card
            className="pointer-events-auto flex-shrink-0 cursor-pointer bg-card/90 p-4 py-2 text-sm transition-colors duration-100 ease-in-out hover:bg-gray-400/100"
            onClick={async (e) => {
              posthog.capture("followup_clicked", {
                sessionId,
                suggestion,
              });
              setFollowUp(suggestion);
              await onSubmit(suggestion);
              setFollowUp("");
            }}
            key={suggestion}
          >
            {suggestion}
          </Card>
        ))}
      </div>

      <div className="flex w-full justify-center">
        <div className="relative w-full max-w-lg rounded-full bg-background">
          <Input
            className="text-md pointer-events-auto w-full min-w-[200px] max-w-lg rounded-full border border-orange-50/10 p-4 py-6 pl-6 pr-14 text-gray-300 shadow-xl focus:border-primary/20 focus:bg-primary/10 focus:text-primary"
            placeholder="Ask a follow-up question..."
            onChange={(e) => setFollowUp(e.target.value)}
            value={followUp}
            disabled={loading}
          />
          <div className="absolute bottom-0 right-0 top-0 flex h-full items-center justify-center">
            <Button
              variant="outline"
              className={cn(
                "pointer-events-auto mr-2 h-10 w-10 rounded-full p-0",
                followUp ? "bg-orange-600" : "bg-gray-800",
              )}
              type="submit"
              disabled={loading || !followUp}
            >
              {loading ? (
                <LoaderCircle className="h-6 w-6 animate-spin" />
              ) : (
                <ArrowUpIcon className={cn("h-5 w-5")} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
