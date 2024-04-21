import { CohereClient } from "cohere-ai";
import { sql } from "@vercel/postgres";
import { type NextRequest } from "next/server";
import short from "short-uuid";
import { getSessionData } from "@/components/serverutil";
import { Client, Event } from "agentops";
import { ChatMessage, ChatMessageRole } from "cohere-ai/api";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export const dynamic = "force-dynamic";
// export const runtime = "edge";

function generateSessionId(): string {
  return "s-" + short.generate();
}

const initializeSchema = () => {
  sql`
    CREATE TABLE IF NOT EXISTS chat (
      id SERIAL PRIMARY KEY,
      session_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      question TEXT NOT NULL,
      message TEXT NOT NULL,
      json_message JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
};

initializeSchema();

const getHistory = async (sessionId: string, userId: string) => {
  if (!sessionId || !userId) return [];

  const { rows: history } = await sql<{
    message: string;
    question: string;
    session_id: string;
    created_at: string;
  }>`
    SELECT message, question, session_id, created_at
    FROM chat
    WHERE session_id = ${sessionId} AND user_id = ${userId}
    ORDER BY created_at ASC
  `;
  return history;
};

const answerQuestion = ({
  message,
  chatHistory,
  session_id,
}: {
  message: string;
  chatHistory: ChatMessage[];
  session_id: string;
}) => {
  return cohere.chatStream({
    model: process.env.COHERE_MODEL || "command",
    message,
    preamble:
      "You are Complexity, an AI search LLM. User will input queries, you will try to inform the user about the query as well as possible. Keep it a bit brief but very informative, respond in a formal tone. User feedback should be directed to your creator Emil Ahlbäck https://twitter.com/emilahlback." +
      "\n\n" +
      `Current time: ${new Date().toISOString()}`,
    chatHistory,
    temperature: 0.1,
    promptTruncation: "AUTO",
    citationQuality: "fast",
    connectors: [
      {
        id: "web-search",
        // @ts-ignore
        name: "Web Search",
        created_at: "0001-01-01T00:00:00Z",
        updated_at: "0001-01-01T00:00:00Z",
        active: true,
        continue_on_failure: true,
      },
    ],
    documents: [],
  });
};

export async function POST(request: Request) {
  const { message, sessionId, userId } = await request.json();

  const agentops = new Client({
    apiKey: "b82252ff-a4de-48ff-9003-6aaa2ed2b489",
    tags: [],
    // patchApi: [],
  });

  const history = await getHistory(sessionId, userId);

  const chatHistory = history.flatMap(({ message, question }) => [
    { role: ChatMessageRole.User, message: question },
    { role: ChatMessageRole.Chatbot, message },
  ]);
  // @ts-expect-error
  agentops.session.session_id = sessionId;

  const cb = agentops.wrap(answerQuestion, [sessionId, userId]);
  const stream = await cb({
    message,
    chatHistory,
    session_id: sessionId,
  }).catch((e) => {
    agentops.endSession("Fail");
    throw e;
  });

  agentops.endSession("Success");

  const newSessionId = sessionId || generateSessionId();

  const encoder = new TextEncoder();
  const customReadable = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(
          JSON.stringify({
            eventType: "session_id",
            session_id: newSessionId,
          }) + "\n",
        ),
      );
      for await (const chat of stream) {
        controller.enqueue(encoder.encode(JSON.stringify(chat) + "\n"));

        if (chat.eventType === "stream-end") {
          const session = {
            message: chat.response.text,
            json_message: {
              citations: chat.response.citations,
              documents: chat.response.documents?.map((d) => ({
                ...d,
                snippet: null,
              })),
            },
            created_at: new Date().toISOString(),
          };
          try {
            await sql`
            INSERT INTO chat (session_id, user_id, question, message, json_message, created_at)
            VALUES (${newSessionId}, ${userId}, ${message}, ${session.message}, ${JSON.stringify(
              session.json_message,
            )}, ${session.created_at})
              `;
          } catch (e) {
            console.log("Insertion error", e);
          }
        }
      }
      controller.close();
    },
    cancel() {},
  });

  return new Response(customReadable, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

export async function GET(request: NextRequest) {
  // get the session id query param
  const sessionId = request.nextUrl.searchParams.get("sessionId");
  if (!sessionId) return new Response("Missing sessionId", { status: 400 });

  const data = await getSessionData(sessionId);

  if (!data.length) return new Response("No history found", { status: 404 });

  return new Response(JSON.stringify({ data }), {
    headers: {
      "Content-Type": "application/json",
      // cache for 1 hour
      "Cache-Control": "public, max-age=3600",
    },
  });
}
