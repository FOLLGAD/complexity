"use client";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Suspense, useState } from "react";
import { useComplexity } from "./complexity";
import { Skeleton } from "@/components/ui/skeleton";
import { CitationCard } from "./CitationCard";
import { ArrowRight, BookDown, ScrollText } from "lucide-react";
import { Button } from "./ui/button";
import Markdown from "react-markdown";

export function MainContent() {
  const { ask, steps } = useComplexity();
  const [input, setInput] = useState("");
  const [followUp, setFollowUp] = useState("");

  const examples = [
    // "Inflection founders join Microsoft",
    // "Nvidia powers humanoid robots",
    // "Facebook brings back Poke",
    // "Nvidia unveils Blackwell",
    // "Gemini-powered iPhone features",
    // "YouTube labels Al-made videos",
    "United States sues Apple",
    "Reddit IPO first day pop",
    "Android 15 satellite messaging",
    "GPT-5 release rumors",
    "Neuralink patient chess telepathy",
    "Saudi Arabia $40b Al fund",
  ];

  return (
    <main className="flex max-h-screen min-h-screen flex-col items-center justify-between p-8 relative flex-shrink overflow-y-auto flex-grow">
      <div
        className={
          "w-full h-full transition-all duration-100 ease-in-out absolute top-0 flex flex-col items-center " +
          (steps.length > 0 ? "opacity-0 pointer-events-none" : "opacity-100")
        }
      >
        <div className="pt-16 flex flex-col items-center justify-between mb-2">
          <div className="w-24 h-24 mb-4">
            <Logo />
          </div>
          <h1 className="text-3xl">Complexity</h1>
        </div>
        <p className="mb-8">The world's knowledge at your fingertips.</p>
        <form
          className="w-full flex flex-col items-center gap-4 px-2"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input, true);
            setInput("");
          }}
        >
          <div className="relative w-full max-w-lg">
            <Input
              className="text-md p-4 py-6 text-gray-300 focus:text-primary focus:bg-primary/10 border focus:border-primary/20 rounded-lg"
              placeholder="Ask anything..."
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <div className="absolute right-0 top-0 bottom-0 h-full flex items-center justify-center">
              <Button
                variant="outline"
                className="w-10 h-10 p-0 mr-1"
                type="submit"
              >
                <ArrowRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
          <h3 className="text-xs text-gray-400 font-bold mt-8 uppercase">
            Trending
          </h3>
          <div className="text-center flex flex-col gap-2 items-center">
            {examples.map((example) => (
              <Card
                key={example}
                className="text-sm w-auto cursor-pointer mt-0 p-1 px-2 text-gray-300 hover:text-primary hover:bg-primary/10 border hover:border-primary/20 rounded-lg"
                onClick={() => {
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

      {steps.map((step, i) => (
        <AnswerStep key={step.id + i} step={step} />
      ))}

      <div className="w-full max-w-2xl w-2xl sticky bottom-0 flex items-center justify-between drop-shadow-lg pointer-events-none md:pb-16">
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
                  className="text-md max-w-lg min-w-[200px] p-4 py-6 shadow-md rounded-xl w-full pointer-events-auto text-gray-300 focus:text-primary focus:bg-primary/10 border focus:border-primary/20 rounded-lg"
                  placeholder="Ask a follow-up question..."
                  onChange={(e) => setFollowUp(e.target.value)}
                  value={followUp}
                />
                <div className="absolute right-0 top-0 bottom-0 h-full flex items-center justify-center">
                  <Button
                    variant="outline"
                    className="w-10 h-10 p-0 mr-1 pointer-events-auto"
                    type="submit"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
export const AnswerStep = ({ step }) => {
  if (!step.text) {
    return (
      <div className="pt-12 container">
        <h1 className="text-2xl font-medium mb-4">{step.question}</h1>
        <Skeleton>
          <div className="h-16" />
        </Skeleton>
      </div>
    );
  }
  return (
    <div className="pt-12 container max-w-4xl">
      <h1 className="text-2xl font-medium mb-4 underline decoration-orange-400 decoration-2 underline-offset-4">
        {step.question}
      </h1>
      <h2 className="text-md font-medium mb-4">
        <ScrollText className="inline-block mr-2" size={18} />
        Sources
      </h2>
      {step.documents.length === 0 && (
        <p className="text-sm text-gray-500">No sources used for this query.</p>
      )}
      <div className="relative rounded-lg overflow-hidden">
        <div className="flex gap-4 overflow-x-auto mb-4">
          {step.documents.map((doc) => (
            <a href={doc.url} key={doc.url} target="_blank" rel="noreferrer">
              <Suspense fallback={<div className="w-48 h-16" />}>
                <CitationCard citation={doc} />
              </Suspense>
            </a>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l to-transparent from-black opacity-60 pointer-events-none" />
      </div>
      <h2 className="text-md font-medium mb-4">
        <BookDown className="inline-block mr-2" size={18} />
        Answer
      </h2>
      <p className="mb-8 prose">
        <Markdown
          components={{
            ul: ({ children }) => <ul className="list-disc">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal">{children}</ol>,
          }}
        >
          {step.text}
        </Markdown>
      </p>
    </div>
  );
};