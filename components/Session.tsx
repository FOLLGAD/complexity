"use client";
import { Input } from "@/components/ui/input";
import { FC, useCallback, useRef, useState } from "react";
import { useComplexity } from "./complexity";
import { ArrowUpIcon, LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import { AnswerStep, Step } from "./AnswerStep";
import { cn } from "@/lib/utils";
import { usePostHog } from "posthog-js/react";
import { Feedback } from "./Feedback";
import { useIsVisible } from "@/lib/useIsVisible";
import { useSessions } from "./sessions";
import { useParams, useRouter } from "next/navigation";
import { EyeNoneIcon } from "@radix-ui/react-icons";
import { useAsync } from "./utils";

export const Session: FC = ({}) => {
  const { ask, steps, loading } = useComplexity();
  const { loaded } = useSessions();
  const [followUp, setFollowUp] = useState("");
  const posthog = usePostHog();
  const feedbackRef = useRef<HTMLDivElement>(null);
  const isFeedbackVisible = useIsVisible(feedbackRef);

  const recordFeedback = useCallback(
    (feedback: "positive" | "negative") => {
      posthog.capture("feedback_submitted", {
        feedback: feedback,
        sessionId: steps[steps.length - 1]?.id,
        question: steps[steps.length - 1]?.question,
        answer: steps[steps.length - 1]?.text,
      });
    },
    [steps],
  );
  const sessionId = useParams()?.sessionId as string;
  const router = useRouter();

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
        "absolute bottom-0 top-0 flex w-full flex-col items-center justify-start bg-background pt-6 transition-all duration-100 ease-in-out " +
        (sessionData.length === 0
          ? "pointer-events-none opacity-0"
          : "opacity-100")
      }
    >
      {sessionData.map((step, i) => (
        <AnswerStep key={step.id + "-" + i} step={step} />
      ))}
      {!viewOnly && (
        <Feedback
          ref={feedbackRef}
          recordFeedback={recordFeedback}
          isVisible={isFeedbackVisible}
        />
      )}

      <div className="flex-grow" />

      <div className="w-2xl pointer-events-none sticky bottom-0 flex w-full max-w-2xl items-center justify-between px-8 pt-16 drop-shadow-lg md:pb-8">
        {!viewOnly && sessionData.length > 0 && (
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              ask(followUp);
              setFollowUp("");
            }}
          >
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg rounded-full bg-background">
                <Input
                  className="text-md pointer-events-auto w-full min-w-[200px] max-w-lg rounded-full border p-4 py-6 pl-6 text-gray-300 shadow-xl focus:border-primary/20 focus:bg-primary/10 focus:text-primary"
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
