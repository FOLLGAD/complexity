import { getImage } from "../../../lib/getImage";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q");

  const data = await getImage(query);

  if (!data) {
    return new Response(JSON.stringify({ error: "Error" }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=864000",
    },
  });
}
