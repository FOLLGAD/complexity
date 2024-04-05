"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function Logo({}) {
  const ref = useRef<SVGSVGElement>(null);

  const [isHovered, setIsHovered] = useState(false);

  const animationDuration = 0.5;

  useEffect(() => {
    let start: number = null;
    let timer: NodeJS.Timeout;
    const handleMouseEnter = () => {
      if (timer) {
        clearTimeout(timer);
      }
      if (!start) {
        start = Date.now();
      }
      setIsHovered(true);
    };
    const handleMouseLeave = () => {
      const elapsed = Date.now() - start;
      const rest = elapsed % (animationDuration * 1000);
      const time = animationDuration * 1000 - rest;
      timer = setTimeout(() => {
        setIsHovered(false);
        start = null;
      }, time);
    };

    ref.current?.addEventListener("mouseenter", handleMouseEnter);
    ref.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      ref.current?.removeEventListener("mouseenter", handleMouseEnter);
      ref.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <svg
      viewBox="0 0 113 113"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M43.2045 8.0154C48.5481 -2.67181 63.7993 -2.6718 69.1429 8.01541L110.798 91.3255C115.618 100.967 108.608 112.31 97.8288 112.31H14.5187C3.73968 112.31 -3.27102 100.967 1.54951 91.3255L43.2045 8.0154ZM64.6708 10.2515C61.1698 3.24951 51.1777 3.24951 47.6767 10.2515L6.02165 93.5615C2.86337 99.8781 7.45658 107.31 14.5187 107.31H97.8288C104.891 107.31 109.484 99.8781 106.326 93.5615L64.6708 10.2515Z"
        fill="#EF5C0A"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M54.1738 110.239V54.2385H59.1738V110.239H54.1738Z"
        fill="#EF5C0A"
        className={cn("origin-bottom", {
          "animate-pendulum": isHovered,
        })}
      />
      <path
        d="M56.1738 71.2385C65.2865 71.2385 72.6738 63.6274 72.6738 54.2385C72.6738 44.8497 65.2865 37.2385 56.1738 37.2385C47.0611 37.2385 39.6738 44.8497 39.6738 54.2385C39.6738 63.6274 47.0611 71.2385 56.1738 71.2385Z"
        fill="url(#paint0_linear_4_147)"
        className={cn("origin-bottom", {
          "animate-pendulum": isHovered,
        })}
      />
      <defs>
        <linearGradient
          id="paint0_linear_4_147"
          x1="45.6738"
          y1="43.7385"
          x2="79.6738"
          y2="67.2385"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F9965E" />
          <stop offset="1" stopColor="#7D4120" />
        </linearGradient>
      </defs>
    </svg>
  );
}
