"use client";
import { Session } from "./Session";
import { Start } from "./Start";

export function MainContent() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-8 relative flex-shrink overflow-y-auto flex-grow overflow-hidden relative">
      <Start />
      <Session />
    </main>
  );
}
