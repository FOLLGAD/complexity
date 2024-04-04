"use server";
import { sql } from "@vercel/postgres";
import { Session } from "./sessions";

sql`CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  session JSONB NOT NULL
)`;

export async function getSessions(userId: string) {
  "use server";
  const { rows } = await sql`SELECT * FROM sessions WHERE user_id = ${userId}`;
  return rows;
}

export async function addSession(userId: string, session: Session[]) {
  "use server";
  await sql`INSERT INTO sessions (user_id, session) VALUES (${userId}, ${JSON.stringify(
    session,
  )})`;
}

export async function removeSession(userId: string, id: string) {
  "use server";
  await sql`DELETE FROM sessions WHERE user_id = ${userId} AND id = ${id}`;
}

export async function editSession(
  userId: string,
  id: string,
  sessionFn: (s: Session[]) => Session[],
) {
  "use server";
  const { rows } =
    await sql`SELECT session FROM sessions WHERE user_id = ${userId} AND id = ${id}`;
  if (!rows.length) return;

  const session = JSON.parse(rows[0].session);
  const newSession = sessionFn(session);
  await sql`UPDATE sessions SET session = ${JSON.stringify(newSession)} WHERE user_id = ${userId} AND id = ${id}`;
}
