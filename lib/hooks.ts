import { MutableRefObject, useEffect, useState } from "react";

export function useIsVisible(ref) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    });

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}

export const useScrollProgress = (
  scrollRef: MutableRefObject<HTMLDivElement>,
  dir: "x" | "y" = "y",
) => {
  const [scrollProgress, setScrollProgress] = useState({
    scrolled: 0,
    remaining: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef || !scrollRef.current) return;

      let remaining = 0,
        scrolled = 0;

      if (dir === "x") {
        scrolled = scrollRef.current.scrollLeft;
        remaining =
          scrollRef.current.scrollWidth -
          scrollRef.current.clientWidth -
          scrolled;
      } else {
        scrolled = scrollRef.current.scrollTop;
        remaining =
          scrollRef.current.scrollHeight -
          scrollRef.current.clientHeight -
          scrolled;
      }

      setScrollProgress({
        scrolled,
        remaining,
      });
    };
    scrollRef.current.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    return () => {
      scrollRef?.current?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [dir]);

  return scrollProgress;
};
