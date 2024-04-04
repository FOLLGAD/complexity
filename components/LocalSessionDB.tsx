"use client";
import { Session } from "./sessions";

export class SessionDB {
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

  static addSession(session: Session[]) {
    localStorage.setItem(`question_${session[0].id}`, JSON.stringify(session));
  }

  static removeSession(id: string) {
    localStorage.removeItem(`question_${id}`);
  }

  static editSession(id: string, sessionFn: (s: Session[]) => Session[]) {
    const session = JSON.parse(localStorage.getItem(`question_${id}`) ?? "[]");
    const newSession = sessionFn(session);
    localStorage.setItem(`question_${id}`, JSON.stringify(newSession));
  }
}
