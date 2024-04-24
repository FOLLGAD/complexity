import { CohereClient } from "cohere-ai";
import { type NextRequest } from "next/server";
import { getSessionData } from "@/components/serverutil";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const sessionId = params.id;
  if (!sessionId) return new Response("Missing sessionId", { status: 400 });

  const data = await getSessionData(sessionId);
  if (!data.length) return new Response("No history found", { status: 404 });

  const message = data
    .map((d) => `**${d.question}**:\n${d.message.slice(0, 100)}...`)
    .join("\n\n");

  // get the session id query param
  const response = await cohere.chat({
    preamble:
      "You will receive a list of questions and answers, and you will be asked to provide 3 followup question. Respond with a maximum of three (3) followup questions, each separated by a new line. Keep them extremely brief, around 5 words.",
    model: process.env.COHERE_MODEL || "command",
    message,
  });

  const items = response.text.split(/\n+/).map((item) => item.trim());

  return new Response(JSON.stringify({ data: items }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
