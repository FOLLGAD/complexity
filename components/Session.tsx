"use client";
import { Input } from "@/components/ui/input";
import { useIsVisible } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { EyeNoneIcon } from "@radix-ui/react-icons";
import { ArrowUpIcon, LoaderCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { AnswerStep, Step } from "./AnswerStep";
import { Feedback } from "./Feedback";
import { useComplexity } from "./complexity";
import { useSessions } from "./sessions";
import { Button } from "./ui/button";
import { useAsync } from "./utils";

export const Session: FC = ({}) => {
  const { ask, steps, loading } = useComplexity();
  console.log("rerender");
  const { loaded } = useSessions();
  const posthog = usePostHog();
  const feedbackRef = useRef<HTMLDivElement>(null);
  const isFeedbackVisible = useIsVisible(feedbackRef);

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
    [steps[steps.length - 1].text],
  );
  const sessionId = useParams()?.sessionId as string;
  const router = useRouter();

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
    // on height change, scroll to bottom
    if (autoScroll) {
      scrollToBottom();
    }
  }, [steps[steps.length - 1]?.text?.length]);

  const handleSubmit = useCallback(
    (question: string) => {
      setAutoScroll(true);
      ask(question);
    },
    [ask],
  );

  const { data: viewSessionData, error } = useAsync(async () => {
    if (
      loaded &&
      !loading &&
      sessionId &&
      !steps.find((item) => item.id === sessionId)
    ) {
      return fetch("/api/chat?sessionId=" + sessionId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) =>
          data.data.map((item) => ({
            ...item,
            message: undefined,
            text: item.message,
          })),
        );
    }
  }, [loaded, steps, sessionId, loading]);

  if (error) {
    console.log(error);
    router.push("/");
  }

  const viewOnly = !!viewSessionData;
  const sessionData: Step[] = viewOnly ? viewSessionData : steps;

  return (
    <div
      className={
        "absolute bottom-0 top-0 flex w-full flex-col items-center justify-start overflow-y-auto bg-background pt-6 transition-all duration-100 ease-in-out " +
        (sessionData.length === 0
          ? "pointer-events-none opacity-0"
          : "opacity-100")
      }
      ref={scrollRef}
    >
      {sessionData.map((step, i) => (
        <AnswerStep key={step.id + "-" + i} step={step} />
      ))}
      <Feedback
        ref={feedbackRef}
        recordFeedback={recordFeedback}
        isVisible={isFeedbackVisible}
      />

      <div className="flex-grow" />

      <div className="w-2xl pointer-events-none sticky bottom-0 flex w-full max-w-2xl items-center justify-between px-8 pt-16 drop-shadow-lg md:pb-8">
        {!viewOnly && sessionData.length > 0 && (
          <FollowupForm onSubmit={handleSubmit} loading={loading} />
        )}
        {!!viewOnly && (
          <div className="pointer-events-auto flex w-full select-none flex-col items-center justify-center">
            <p className="vertical-align-middle flex text-center text-sm text-gray-400">
              <EyeNoneIcon className="mr-2 inline-block h-5 w-5" /> This session
              is read-only.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const FollowupForm: FC<{
  onSubmit: (text: string) => void;
  loading: boolean;
}> = ({ onSubmit, loading }) => {
  const [followUp, setFollowUp] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit(followUp);
    },
    [followUp, onSubmit],
  );

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="flex justify-center">
        <div className="relative w-full max-w-lg rounded-full bg-background">
          <Input
            className="text-md pointer-events-auto w-full min-w-[200px] max-w-lg rounded-full border p-4 py-6 pl-6 text-gray-300 shadow-xl focus:border-primary/20 focus:bg-primary/10 focus:text-primary pr-14"
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
