"use client";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionProvider, useSessions } from "@/components/sessions";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

function useComplexity() {
  const query_id = useSearchParams().get("id");
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { sessions, editSession, addSession } = useSessions();
  const steps = useMemo(
    () => sessions.find(([item]) => item.id === query_id) ?? [],
    [query_id, sessions]
  );

  const ask = useCallback(
    async (input: string, reset = false) => {
      setLoading(true);
      const id = steps[0]?.id ?? Math.random().toString(36).substring(7);
      if (reset) router.push("/?id=" + id);
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: input,
          history: steps.flatMap((step) => [
            { message: step.question, role: "USER" },
            { message: step.text, role: "CHATBOT" },
          ]),
        }),
      });

      const toPush = {
        id,
        text: "",
        question: input,
        documents: [],
        citations: [],
        created: new Date().toISOString(),
      };

      if (reset) addSession([toPush]);
      else editSession(id, (s) => [...s, toPush]);

      const reader = response.body.getReader();
      let lines = "";

      const popFirstLine = () => {
        try {
          const index = lines.indexOf("\n");
          const line = lines.slice(0, index);
          if (index > -1) {
            lines = lines.slice(index + 1);
            const json = JSON.parse(line);
            return json;
          }
        } catch (e) {
          console.warn(e);
        }
        return undefined;
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        lines += new TextDecoder().decode(value);
        while (true) {
          const json = popFirstLine();
          if (!json) break;
          if (json.eventType === "text-generation") {
            editSession(id, (s) => {
              const last = s[s.length - 1];
              return s
                .slice(0, -1)
                .concat([{ ...last, text: last.text + json.text }]);
            });
          } else if (json.eventType === "stream-end") {
            editSession(id, (s) => {
              const last = s[s.length - 1];
              return s.slice(0, -1).concat([
                {
                  ...last,
                  id: id,
                  text: json.response.text,
                  citations: json.response.citations,
                  documents: json.response.documents,
                },
              ]);
            });
          } else if (json.eventType === "search-results") {
            const docs = json.documents;
            editSession(id, (s) => {
              const last = s[s.length - 1];
              return s.slice(0, -1).concat([
                {
                  ...last,
                  documents: docs,
                },
              ]);
            });
          } else if (json.eventType === "citation-generation") {
            const citations = json.citations;
            editSession(id, (s) => {
              const last = s[s.length - 1];
              return s.slice(0, -1).concat([
                {
                  ...last,
                  citations: [...last.citations, ...citations],
                },
              ]);
            });
          }
        }
      }

      setLoading(false);
    },
    [steps, editSession, router]
  );

  return { ask, loading, steps };
}

const CitationCard = ({ citation }) => {
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

const AnswerStep = ({ step }) => {
  if (!step.text) {
    return (
      <div className="w-full">
        <h1 className="text-2xl font-medium mb-4">{step.question}</h1>
        <Skeleton>
          <div className="h-16" />
        </Skeleton>
      </div>
    );
  }
  return (
    <div className="w-full">
      <h1 className="text-2xl font-medium mb-4">{step.question}</h1>
      <h2 className="text-lg font-medium mb-4">Sources</h2>
      {step.documents.length === 0 && (
        <p className="text-sm text-gray-500">No sources used for this query.</p>
      )}
      <div className="relative rounded-lg overflow-hidden">
        <div className="flex gap-4 overflow-x-auto mb-4">
          {step.documents.map((doc) => (
            <a href={doc.url} key={doc.url} target="_blank" rel="noreferrer">
              <CitationCard citation={doc} />
            </a>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l to-transparent from-black opacity-60 pointer-events-none" />
      </div>
      <h2 className="text-lg font-medium mb-4">Answer</h2>
      <p className="whitespace-pre-wrap mb-8">{step.text}</p>
    </div>
  );
};

const Sidebar = () => {
  const { sessions } = useSessions();

  return (
    <aside className="flex flex-col items-center p-8 px-4 text-primary w-64 flex-shrink-0 flex-grow-0 border-r border-gray-800">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <p className="text-md font-medium flex items-center hover:text-orange-400">
              <span className="w-12 h-12">
                <Logo />
              </span>
              Complexity
            </p>
          </Link>
        </div>
      </div>
      <div className="mt-8 w-full">
        <div className="text-xs text-gray-500 font-bold mb-2 uppercase px-2">
          Sessions
        </div>
        {sessions.length > 0 ? (
          <div className="flex flex-col gap-2 w-full overflow-ellipsis">
            {sessions.map(([item]) => (
              <Link
                key={item.id}
                className="w-full overflow-ellipsis line-clamp-2 cursor-pointer text-sm font-medium text-gray-300 hover:text-primary hover:bg-primary/10 border p-2 hover:border-primary/20 rounded-lg"
                href={`/?id=${item.id}`}
              >
                {item.question}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 p-2">Ask a question.</p>
        )}
      </div>
    </aside>
  );
};

function Home() {
  const { ask, loading, steps } = useComplexity();
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
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex max-h-screen min-h-screen flex-col items-center justify-between p-24 relative flex-shrink overflow-y-auto flex-grow">
        <div
          className={
            "w-full h-full transition-all duration-100 ease-in-out absolute top-0 flex flex-col items-center " +
            (steps.length > 0 ? "opacity-0 pointer-events-none" : "opacity-100")
          }
        >
          <div className="pt-16 flex flex-col items-center justify-between">
            <div className="w-32 h-32">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold">Complexity</h1>
          </div>
          <p className="mb-8">Ask the AI anything.</p>
          <form
            className="w-full flex flex-col items-center gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input, true);
              setInput("");
            }}
          >
            <Input
              className="text-md p-4 py-6 max-w-lg text-gray-300 focus:text-primary focus:bg-primary/10 border focus:border-primary/20 rounded-lg"
              placeholder="Ask anything..."
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
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

        <div className="w-full max-w-2xl w-2xl sticky bottom-0 flex items-center justify-between drop-shadow-lg pointer-events-none">
          {steps.length > 0 && (
            <form
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault();
                ask(followUp);
                setFollowUp("");
              }}
            >
              <div className="bg-background rounded-lg">
                <Input
                  className="text-md max-w-lg min-w-[200px] p-4 py-6 shadow-md rounded-xl w-full pointer-events-auto text-gray-300 focus:text-primary focus:bg-primary/10 border focus:border-primary/20 rounded-lg"
                  placeholder="Ask a follow-up question..."
                  onChange={(e) => setFollowUp(e.target.value)}
                  value={followUp}
                />
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Main() {
  return (
    <Suspense fallback={<div></div>}>
      <SessionProvider>
        <Home />
      </SessionProvider>
    </Suspense>
  );
}
