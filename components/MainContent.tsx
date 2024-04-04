"use client";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FC, useState } from "react";
import { useComplexity } from "./complexity";
import { ArrowRight, ArrowUp, ArrowUpIcon, LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import { AnswerStep } from "./AnswerStep";
import { cn } from "@/lib/utils";

const examples = [
  "xz backdoor",
  "EU AltStore coming soon",
  "Altman gives up OpenAI fund",
  "Microplastics found in ancient digs",
  "US House bans use of Microsoft Copilot",
];

const Session: FC = ({}) => {
  const { ask, steps, loading } = useComplexity();
  const [followUp, setFollowUp] = useState("");

  return (
    <div
      className={
        "transition-all duration-100 ease-in-out flex flex-col items-center justify-start absolute top-0 bottom-0 bg-background pt-6 " +
        (steps.length === 0 ? "opacity-0 pointer-events-none" : "opacity-100")
      }
    >
      {steps.map((step, i) => (
        <AnswerStep key={step.id + "-" + i} step={step} />
      ))}

      <div className="flex-grow" />

      <div className="w-full max-w-2xl w-2xl sticky bottom-0 flex items-center justify-between drop-shadow-lg pointer-events-none md:pb-8 pt-16 px-8">
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
                  className="text-md max-w-lg min-w-[200px] p-4 pl-6 py-6 shadow-xl w-full pointer-events-auto text-gray-300 focus:text-primary focus:bg-primary/10 border focus:border-primary/20 rounded-full"
                  placeholder="Ask a follow-up question..."
                  onChange={(e) => setFollowUp(e.target.value)}
                  value={followUp}
                  disabled={loading}
                />
                <div className="absolute right-0 top-0 bottom-0 h-full flex items-center justify-center">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-10 h-10 p-0 mr-2 pointer-events-auto rounded-full",
                      followUp ? "bg-orange-400" : "bg-gray-800",
                    )}
                    type="submit"
                    disabled={loading || !followUp}
                  >
                    {loading ? (
                      <LoaderCircle className="animate-spin w-6 h-6" />
                    ) : (
                      <ArrowUpIcon className={cn("w-5 h-5")} />
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

const Start = () => {
  const { ask, loading } = useComplexity();
  const [input, setInput] = useState("");

  return (
    <div
      className={
        "w-full transition-all duration-100 ease-in-out flex flex-col items-center justify-center absolute top-0 bottom-0 overflow-y-auto selection:bg-orange-200 selection:text-orange-600"
      }
    >
      <div className="flex flex-col items-center justify-between mb-2">
        <div className="w-24 h-24 mb-4">{/* <Logo /> */}</div>
        <h1 className="text-4xl font-medium tracking-tight mb-1 mt-2 text-gradient">
          complexity
        </h1>
      </div>
      <p className="mb-16 text-lg font-normal text-gray-300 animate-fade-in [--animation-delay:400ms]">
        The world's knowledge at your fingertips
      </p>
      <form
        className="w-full flex flex-col items-center gap-4 px-4"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input, true);
          setInput("");
        }}
      >
        <div className="relative w-full max-w-lg">
          <Input
            className="text-md p-4 pl-6 py-6 text-orange-50 focus:text-primary focus:bg-primary/5 border border-orange-50/10 focus:border-orange-100 rounded-full placeholder:text-gray-400 placeholder:font-thin"
            placeholder="Ask anything..."
            onChange={(e) => setInput(e.target.value)}
            value={input}
            disabled={loading}
          />
          <div className="absolute right-0 top-0 bottom-0 h-full flex items-center justify-center">
            <Button
              variant="outline"
              className={cn(
                "w-8 h-8 p-0 mr-2 rounded-full",
                input ? "bg-orange-400" : "bg-gray-800",
              )}
              type="submit"
              disabled={loading || !input}
            >
              {loading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        <h3 className="text-xs text-gray-200/90 font-bold mt-8 uppercase">
          Trending
        </h3>
        <div className="text-center flex flex-col gap-2 items-center">
          {examples.map((example) => (
            <Card
              key={example}
              className="text-sm w-auto cursor-pointer mt-0 p-2 px-3 text-gray-300 hover:text-primary hover:bg-primary/10 border hover:border-orange-300/20 rounded-xl bg-[#202222]"
              onClick={() => {
                if (loading) return;
                setInput(example);
                ask(example, true);
              }}
            >
              {example}
            </Card>
          ))}
        </div>
      </form>
    </div>
  );
};

export function MainContent() {
  return (
    <main className="flex flex-col items-center justify-between py-8 relative flex-shrink overflow-y-auto flex-grow">
      <Start />
      <Session />
    </main>
  );
}
