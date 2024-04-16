"use server";
import type { Step } from "@/components/AnswerStep";
import { Session } from "@/components/Session";
import { getSessionData } from "@/components/serverutil";
import { cache } from "react";

const getCachedSessionData = cache(async (sessionId: string) => {
  const steps = await getSessionData(sessionId).then((data) =>
    data?.map(
      (step): Step => ({
        ...step,
        text: step.message,
      }),
    ),
  );
  return steps;
});

export default async function Page({ params }) {
  const sessionId = params.sessionId as string;
  const preloadedSessionData = await getCachedSessionData(sessionId);

  return (
    <main className="relative flex flex-shrink flex-grow flex-col items-center justify-between overflow-y-auto py-8">
      <Session sessionData={preloadedSessionData} />
    </main>
  );
}

// or Dynamic metadata
export async function generateMetadata({ params }) {
  const sessionId = params.sessionId as string;
  const data = await getCachedSessionData(sessionId);
  const firstQuestion = data?.[0];
  if (!firstQuestion) {
    return {};
  }

  const { text, question } = data?.[0];
  const ellipsify = (str: string, maxLength = 50) => {
    if (str.length > maxLength) {
      return `${str.slice(0, maxLength)}…`;
    }
    return str;
  };

  return {
    title: ellipsify(question),
    description: `${ellipsify(question)} - Answer: ${ellipsify(text, 100)}`,
  };
}
