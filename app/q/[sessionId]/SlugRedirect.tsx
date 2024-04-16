"use client";
import { useParams, useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import slugify from "@sindresorhus/slugify";

export const SlugRedirect: FC<{ question?: string }> = ({ question }) => {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (question) {
      const newslug = slugify(question).slice(0, 30);
      if (newslug !== params.slug) {
        router.replace(`/q/${params.sessionId}/${newslug}`, {
          // @ts-ignore // for some reason nextjs doesn't recognize this
          shallow: true,
        });
      }
    }
  }, [params.slug, params.sessionId, question]);
  return null;
};
