"use client";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Session {
  text: string;
  question: string;
  documents: any[];
  citations: any[];
  created?: string;
  id?: string;
}

export const SessionsContext = createContext<{
  sessions: Session[][];
  addSession: (session: Session[]) => void;
  removeSession: (id: string) => void;
  editSession: (id: string, session: (s: Session[]) => Session[]) => void;
}>({
  sessions: [],
  addSession: () => {},
  removeSession: () => {},
  editSession: () => {},
});

export const SessionProvider = ({ children }: PropsWithChildren<{}>) => {
  const [sessions, setSessions] = useState<Session[][]>([]);

  useEffect(() => {
    if (!window?.localStorage) return;
    const items = [];
    for (const key in localStorage) {
      if (key.startsWith("question_") && localStorage.getItem(key)) {
        items.push(JSON.parse(localStorage.getItem(key)!));
      }
    }
    items.sort((a, b) => {
      return b[0].created?.localeCompare(a[0].created) ?? 0;
    });
    setSessions(items);
  }, [setSessions]);

  const addSession = useCallback((session: Session[]) => {
    setSessions((s) => [...s, session]);
    localStorage.setItem(`question_${session[0].id}`, JSON.stringify(session));
  }, []);

  const removeSession = useCallback((id: string) => {
    setSessions((s) => s.filter((s) => s[0].id !== id));
    localStorage.removeItem(`question_${id}`);
  }, []);

  const editSession = useCallback(
    (id: string, sessionFn: (s: Session[]) => Session[]) => {
      setSessions((s) =>
        s.map((s) => {
          if (s[0].id === id) {
            const s2 = sessionFn(s);
            localStorage.setItem(`question_${id}`, JSON.stringify(s2));
            return s2;
          }
          return s;
        })
      );
    },
    []
  );

  return (
    <SessionsContext.Provider
      value={{ sessions, addSession, removeSession, editSession }}
    >
      {children}
    </SessionsContext.Provider>
  );
};

export function useSessions() {
  return useContext(SessionsContext);
}
