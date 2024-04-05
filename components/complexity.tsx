"use client";
import { Session, useSessions } from "@/components/sessions";
import { useParams, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import posthog from "posthog-js";
import { Document } from "./AnswerStep";

function useComplexityMain() {
  const params = useParams();
  const sessionId = (params.sessionId as string) || null;
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [lastSessionId, setLastSessionId] = useState<string | null>(null);

  const { sessions, editSession, addSession } = useSessions();
  const steps = useMemo(
    () => sessions.find(([item]) => item.id === sessionId) ?? [],
    [sessionId, sessions],
  );

  const [cancel, setCancel] = useState<null | (() => void)>(null);

  useEffect(() => {
    if (
      lastSessionId === currentSessionId &&
      sessionId !== currentSessionId &&
      cancel
    ) {
      cancel();
    }
    setLastSessionId(sessionId);
  }, [sessionId]);

  const ask = useCallback(
    async (input: string, reset = false) => {
      if (!input.trim()) return;
      setLoading(true);

      let resolve: (reader: ReadableStreamDefaultReader<any>) => void;
      const promise = new Promise<ReadableStreamDefaultReader<any>>(
        (_resolve) => {
          resolve = _resolve;
        },
      );

      setCancel(() => () => promise.then((reader) => reader.releaseLock()));

      const id = steps[0]?.id ?? Math.random().toString(36).substring(7);
      setCurrentSessionId(id);

      posthog.capture("asked_question", {
        question: input,
        sessionId: id,
        previous: reset ? [] : steps.map((s) => s?.question),
      });

      if (reset) router.push(`/q/${id}`);
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

      const readAll = async () => {
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
                    documents: json.response.documents.map((d: Document) => ({
                      ...d,
                      snippet: null,
                    })),
                  },
                ]);
              });
            } else if (json.eventType === "search-results") {
              const docs = json.documents?.map((d: Document) => ({
                ...d,
                snippet: null,
              }));
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
      };

      resolve(reader);

      await readAll().catch((e) => console.error(e));

      setLoading(false);
    },
    [steps, editSession, router],
  );

  return { ask, loading, steps, cancel };
}

export const ComplexityContext = createContext<{
  ask: (input: string, reset?: boolean) => void;
  loading: boolean;
  steps: Session[];
  cancel: () => void;
}>({
  ask: () => {},
  loading: false,
  steps: [],
  cancel: () => {},
});

export function ComplexityProvider({ children }: any) {
  const { ask, loading, steps, cancel } = useComplexityMain();

  return (
    <ComplexityContext.Provider
      value={useMemo(
        () => ({
          ask,
          loading,
          steps,
          cancel,
        }),
        [ask, loading, steps, cancel],
      )}
    >
      {children}
    </ComplexityContext.Provider>
  );
}

export function useComplexity() {
  return useContext(ComplexityContext);
}
