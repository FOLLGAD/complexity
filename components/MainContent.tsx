"use client";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FC, useState } from "react";
import { useComplexity } from "./complexity";
import { ArrowRight, ArrowUp, ArrowUpIcon, LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import { AnswerStep } from "./AnswerStep";
import { cn } from "@/lib/utils";
import { Session } from "./Session";
import { Start } from "./Start";

const examples = [
  "xz backdoor",
  "EU AltStore coming soon",
  "Altman gives up OpenAI fund",
  "Microplastics found in ancient digs",
  "US House bans use of Microsoft Copilot",
];

export function MainContent() {
  return (
    <main className="relative flex flex-shrink flex-grow flex-col items-center justify-between overflow-y-auto py-8">
      <Start />
      <Session />
    </main>
  );
}
