import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY, // This is your trial API key
});

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function POST(request: Request) {
  const { message, history } = await request.json();
  console.log(history)

  const stream = await cohere.chatStream({
    model: "command-r",
    message: message,
    preamble:
      "You are Perplexity, an AI search LLM. User will input queries, you will try to inform the user about the query as well as possible. Keep it brief but informative.",
    chatHistory: history,
    temperature: 0.1,
    promptTruncation: "AUTO",
    citationQuality: "accurate",
    connectors: [
      {
        id: "web-search",
        name: "Web Search",
        created_at: "0001-01-01T00:00:00Z",
        updated_at: "0001-01-01T00:00:00Z",
        active: true,
        continue_on_failure: true,
      },
    ],
    documents: [],
  });

  const encoder = new TextEncoder();
  const customReadable = new ReadableStream({
    async start(controller) {
      for await (const chat of stream) {
        controller.enqueue(encoder.encode(JSON.stringify(chat) + "\n"));
      }
      controller.close();
    },
  });

  return new Response(customReadable, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
