"use server";
import OGS, { type SuccessResult } from "open-graph-scraper";
const cache: Map<string, SuccessResult["result"]> = new Map();

export async function getImage(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }

  const { error, result } = await OGS({ url });

  if (error) {
    return null;
  }

  if (!result.ogImage) {
    return null;
  }

  cache.set(url, result);

  return result;
}
