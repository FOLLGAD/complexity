import { useSessions } from "@/components/sessions";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import posthog from "posthog-js";

export function useComplexity() {
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
      if (!input.trim()) return;

      posthog.capture("asked_question", {
        question: input,
        previous: reset ? [] : steps.map((s) => s?.question),
      });

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
