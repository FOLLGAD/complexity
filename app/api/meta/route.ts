// curl --data "q=https://google.com&fields=image_x,image_y,locale" https://api.linkpreview.net -H "X-Linkpreview-Api-Key: 123456"

// cache heavily:

const cache = new Map();

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q");

  if (cache.has(query)) {
    return new Response(JSON.stringify(cache.get(query)), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const response = await fetch(`https://api.linkpreview.net/?q=${query}`, {
    headers: {
      "X-Linkpreview-Api-Key": "",
    },
  });
  const json = await response.json();

  cache.set(query, json);

  return new Response(JSON.stringify(json), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
