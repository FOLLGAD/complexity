"use client";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
import {
  getSessions as remoteGetSessions,
  addSession as remoteAddSession,
  removeSession as remoteRemoveSession,
  editSession as remoteEditSession,
} from "./RemoteSessionDB";

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

console.log({
  POSTGRES_URL: process.env.POSTGRES_URL,
  POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
});

export const SessionProvider = ({ children }: PropsWithChildren<{}>) => {
  const [sessions, setSessions] = useState<Session[][]>([]);

  const userId = useMemo(() => {
    if ("window" in globalThis) {
      return localStorage.getItem("complexity-user-id") ?? Math.random().toString(36).substring(2);
    }
    return null;
  }, []);

  useEffect(() => {
    let isMounted = true;
    remoteGetSessions(userId)
      .then((s) => {
        console.log(s);
        return s;
      })
      .then((sessions) => isMounted && setSessions(sessions));

    return () => {
      isMounted = false;
    };
  }, []);

  const addSession = useCallback((session: Session[]) => {
    setSessions((s) => {
      remoteAddSession(userId, session);
      return [...s, session];
    });
  }, []);

  const removeSession = useCallback((id: string) => {
    setSessions((s) => {
      remoteRemoveSession(userId, id);
      return s.filter((s) => s[0].id !== id);
    });
  }, []);

  const editSession = useCallback(
    (id: string, sessionFn: (s: Session[]) => Session[]) => {
      setSessions((s) => {
        const updatedSession = s.map((s) => {
          if (s[0].id === id) {
            const s2 = sessionFn(s);
            remoteEditSession(userId, id, sessionFn);
            return s2;
          }
          return s;
        });
        return updatedSession;
      });
    },
    [],
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
