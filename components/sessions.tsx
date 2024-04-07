"use client";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface SessionStep {
  text: string;
  question: string;
  documents: any[];
  citations: any[];
  created?: string;
  id?: string;
}

export const SessionsContext = createContext<{
  sessions: SessionStep[][];
  addSession: (session: SessionStep[]) => void;
  removeSession: (id: string) => void;
  editSession: (
    id: string,
    session: (s: SessionStep[]) => SessionStep[],
  ) => void;
  loaded: boolean;
}>({
  sessions: [],
  addSession: () => {},
  removeSession: () => {},
  editSession: () => {},
  loaded: false,
});

class SessionDB {
  static getSessions() {
    if (!window?.localStorage) return [];
    const items = [];
    for (const key in localStorage) {
      if (key.startsWith("question_") && localStorage.getItem(key)) {
        items.push(JSON.parse(localStorage.getItem(key)!));
      }
    }
    items.sort((a, b) => {
      return b[0].created?.localeCompare(a[0].created) ?? 0;
    });
    return items;
  }

  static addSession(session: SessionStep[]) {
    localStorage.setItem(`question_${session[0].id}`, JSON.stringify(session));
  }

  static removeSession(id: string) {
    localStorage.removeItem(`question_${id}`);
  }

  static editSession(
    id: string,
    sessionFn: (s: SessionStep[]) => SessionStep[],
  ) {
    const session = JSON.parse(localStorage.getItem(`question_${id}`) ?? "[]");
    const newSession = sessionFn(session);
    localStorage.setItem(`question_${id}`, JSON.stringify(newSession));
  }
}

export const SessionProvider = ({ children }: PropsWithChildren<{}>) => {
  const [sessions, setSessions] = useState<SessionStep[][]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSessions(SessionDB.getSessions());
    setLoaded(true);
  }, []);

  const addSession = useCallback((session: SessionStep[]) => {
    setSessions((s) => {
      SessionDB.addSession(session);
      return [session, ...s];
    });
  }, []);

  const removeSession = useCallback((id: string) => {
    setSessions((s) => {
      SessionDB.removeSession(id);
      return s.filter((s) => s[0].id !== id);
    });
  }, []);

  const editSession = useCallback(
    (id: string, sessionFn: (s: SessionStep[]) => SessionStep[]) => {
      setSessions((s: SessionStep[][]) => {
        const updatedSession = s.map((session_steps: SessionStep[]) => {
          if (session_steps[0].id === id) {
            const s2 = sessionFn(session_steps);
            SessionDB.editSession(id, sessionFn);
            return s2;
          }
          return session_steps;
        });
        return updatedSession;
      });
    },
    [],
  );

  return (
    <SessionsContext.Provider
      value={{ sessions, addSession, removeSession, editSession, loaded }}
    >
      {children}
    </SessionsContext.Provider>
  );
};

export function useSessions() {
  return useContext(SessionsContext);
}
