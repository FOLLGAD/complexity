// curl --data "q=https://google.com&fields=image_x,image_y,locale" https://api.linkpreview.net -H "X-Linkpreview-Api-Key: 123456"

import { getImage } from "../../../lib/getImage";

// cache heavily:

export const cache = new Map();

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
    },
  });
}
