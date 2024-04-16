"use server";
import type { Step } from "@/components/AnswerStep";
import { Session } from "@/components/Session";
import { getSessionData } from "@/components/serverutil";

export default async function Page({ params }) {
  const sessionId = params.sessionId as string;
  const preloadedSessionData: Step[] = await getSessionData(sessionId).then(
    (data) =>
      data?.map(
        (step): Step => ({
          ...step,
          text: step.message,
        }),
      ),
  );

  return (
    <main className="relative flex flex-shrink flex-grow flex-col items-center justify-between overflow-y-auto py-8">
      <Session sessionData={preloadedSessionData} />
    </main>
  );
}
