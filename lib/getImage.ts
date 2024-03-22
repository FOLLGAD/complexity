"use server";
import { cache } from "../app/api/meta/route";

export async function getImage(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }

  const data = await fetch(`https://api.linkpreview.net/?q=${url}`, {
    headers: {
      "X-Linkpreview-Api-Key": process.env.LINK_PREVIEW,
    },
  }).then((res) => res.json());

  if (!data.image) {
    return null;
  }

  cache.set(url, data);

  return data;
}
