"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";

export default function PostHogPageview(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  // Track pageviews
  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      const ref = document.referrer;
      const urlReferrer = new URL(url).searchParams.get("ref");
      posthog.capture("$pageview", {
        $current_url: url,
        $referrer: ref || urlReferrer,
      });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}
