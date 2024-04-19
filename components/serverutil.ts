"use server";
import { sql } from "@vercel/postgres";

export async function getSessionData(sessionId: string): Promise<
  | {
      message: string;
      question: string;
      session_id: string;
      created_at: string;
      documents: any[];
      citations: any[];
    }[]
  | null
> {
  const history = await sql<{
    message: string;
    question: string;
    session_id: string;
    created_at: string;
    json_message: any;
  }>`
SELECT message, question, session_id, created_at, json_message
FROM chat
WHERE session_id = ${sessionId}
ORDER BY created_at ASC
  `;
  console.log("history exists", !!history.rows.length, history);

  if (history.rows.length === 0) {
    return null;
  }

  const data = history.rows.map((row) => {
    const documents = row.json_message?.documents;
    const citations = row.json_message?.citations;
    return {
      message: row.message,
      question: row.question,
      session_id: row.session_id,
      created_at: row.created_at,
      documents,
      citations,
    };
  });

  return data;
}
