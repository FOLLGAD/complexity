"use client";
import { Session } from "./Session";
import { Start } from "./Start";

export function MainContent() {
  return (
    <main className="relative flex flex-shrink flex-grow flex-col items-center justify-between overflow-y-auto py-8">
      <Start />
      <Session />
    </main>
  );
}
