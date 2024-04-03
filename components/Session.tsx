"use client";
import { Input } from "@/components/ui/input";
import { FC, useState } from "react";
import { useComplexity } from "./complexity";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import { AnswerStep } from "./AnswerStep";

export const Session: FC = ({ }) => {
  const { ask, steps, loading } = useComplexity();
  const [followUp, setFollowUp] = useState("");

  return (
    <div
      className={"w-full h-full transition-all duration-100 ease-in-out flex flex-col items-center justify-start absolute top-0 bottom-0 bg-background pt-6 " +
        (steps.length === 0 ? "opacity-0 pointer-events-none" : "opacity-100")}
    >
      {steps.map((step, i) => (
        <AnswerStep key={step.id + "-" + i} step={step} />
      ))}

      <div className="flex-grow" />

      <div className="w-full max-w-2xl w-2xl sticky bottom-0 flex items-center justify-between drop-shadow-lg pointer-events-none md:pb-16 pt-16 px-8">
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
              <div className="relative w-full max-w-lg bg-background rounded-lg">
                <Input
                  className="text-md max-w-lg min-w-[200px] p-4 py-6 shadow-xl rounded-xl w-full pointer-events-auto text-gray-300 focus:text-primary focus:bg-primary/10 border focus:border-primary/20 rounded-lg"
                  placeholder="Ask a follow-up question..."
                  onChange={(e) => setFollowUp(e.target.value)}
                  value={followUp}
                  disabled={loading} />
                <div className="absolute right-0 top-0 bottom-0 h-full flex items-center justify-center">
                  <Button
                    variant="outline"
                    className="w-10 h-10 p-0 mr-1 pointer-events-auto"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <LoaderCircle className="animate-spin w-6 h-6" />
                    ) : (
                      <ArrowRight className="w-6 h-6" />
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