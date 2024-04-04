"use client";
import { Input } from "@/components/ui/input";
import { FC, useState } from "react";
import { useComplexity } from "./complexity";
import { ArrowUpIcon, LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import { AnswerStep } from "./AnswerStep";
import { cn } from "@/lib/utils";

export const Session: FC = ({}) => {
  const { ask, steps, loading } = useComplexity();
  const [followUp, setFollowUp] = useState("");

  return (
    <div
      className={
        "absolute bottom-0 top-0 flex flex-col items-center justify-start bg-background pt-6 transition-all duration-100 ease-in-out w-full " +
        (steps.length === 0 ? "pointer-events-none opacity-0" : "opacity-100")
      }
    >
      {steps.map((step, i) => (
        <AnswerStep key={step.id + "-" + i} step={step} />
      ))}

      <div className="flex-grow" />

      <div className="w-2xl pointer-events-none sticky bottom-0 flex w-full max-w-2xl items-center justify-between px-8 pt-16 drop-shadow-lg md:pb-8">
        {steps.length > 0 && (
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              ask(followUp);
              setFollowUp("");
            }}
          >
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg rounded-lg bg-background">
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
                      followUp ? "bg-orange-400" : "bg-gray-800",
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
      </div>
    </div>
  );
};
